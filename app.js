const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const todo = require("./sequelize");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public',express.static('public'));

// fetching the todo-list from db.
app.get("/", (req, res) => {
  
  todo.findAll({raw: true}).then(todos => { 
    res.render("base.ejs", { todoList: todos});
  });
});

// adding the entered todo item in the db.
app.post("/newtoDO", (req, res) => {
  todo.create({text: req.body.item}).then(() => {
    console.log(`Todo item added to database.`)
  });
  res.redirect("/");
});

// for undefined urls.
app.get("*", (req, res) => res.send("<h1>Invalid route!</h1>"));

app.listen(port, () => console.log(`Todo app listening on port ${port}!`));
