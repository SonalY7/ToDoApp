const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const todo = require("./sequelize");

// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/public", express.static("public"));

// retrieve
app.get("/todo", (req, res) => {
  todo.findAll({ raw: true }).then(todos => {
    res.send(todos);
  });
});

// create
app.post("/todo", (req, res) => {
  todo.create({ text: req.body.text }).then(() => {
    res.redirect("/todo");
  });
});

//update
app.put("/todo/:id", (req, res) => {
  todo
    .update(
      {
        text: req.body.text
      },
      {
        where: { id: req.params.id }
      }
    )
    .then(() => {
      res.redirect("/todo");
    });
});

// delete
app.delete("/todo/:id", (req, res) => {
  todo
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.redirect("/todo");
    });
});

// for undefined urls.
app.get("*", (req, res) => res.send("Invalid route!"));

app.listen(port, () => console.log(`Todo app listening on port ${port}!`));
