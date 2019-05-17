const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const todo = require("./sequelize");

app.use(bodyParser.json());
app.use("/public", express.static("public"));

// retrieve
app.get("/todo", async (req, res) => {
  let todoList = await todo.findAll({ raw: true });
  res.send(todoList);
});

//retrieve one
app.get("/todo/:id", async (req, res) => {
  let todoOne = await todo.findOne(
    { where: { id: req.params.id } },
    { raw: true }
  );
  res.send(todoOne);
});

// create
app.post("/todo", async (req, res) => {
  let temp = await todo.create({ text: req.body.text });
  res.redirect("/todo");
});

//update
app.put("/todo/:id", async (req, res) => {
  let temp = await todo.update(
    {
      text: req.body.text
    },
    {
      where: { id: req.params.id }
    }
  );
  res.redirect("/todo");
});

// delete
app.delete("/todo/:id", async (req, res) => {
  let temp = await todo.destroy({
    where: {
      id: req.params.id
    }
  });
  res.redirect("/todo");
});

// for undefined urls.
app.get("*", (req, res) => res.send("Invalid route!"));

app.listen(port, () => console.log(`Todo app listening on port ${port}!`));
