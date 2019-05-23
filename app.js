const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const { todo, user } = require("./sequelize");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
let ExtractJWT = passportJWT.ExtractJwt;
let jwtOptions = {};
let cors = require("cors");
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
// yet to be stored in a separate place
jwtOptions.secretOrKey = "blue";

app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.use(cors());

//APIs

//list users
app.get("/api/users", async (req, res) => {
  let userlist = await user.findAll({ raw: true });
  res.json(userlist);
});

// create users
app.post("/api/users/", async (req, res) => {
  let temp = await user.create({
    username: req.body.username,
    password: req.body.password
  });
  res.json({ username: temp.username, msg: "created!" });
});

// login route
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    let userOne = await user.findOne(
      {
        where: { username: username }
      },
      { raw: true }
    );
    if (!userOne) {
      res.status(401).json({ msg: "No such user found", userOne });
    }
    if (userOne.password === password) {
      let payload = { id: userOne.id };
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ msg: "ok", token: token });
    } else {
      res.status(401).json({ msg: "Password is incorrect" });
    }
  }
});

// list user by id
app.get("/api/users/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(
    err,
    decoded
  ) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let userOne = await user.findOne(
    { where: { id: req.params.id } },
    { raw: true }
  );
  res.send(userOne);
});

//update user
app.put("/api/users/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(
    err,
    decoded
  ) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let temp = await user.update(
    {
      username: req.body.username,
      password: req.body.password
    },
    {
      where: { id: req.params.id }
    }
  );
  res.send({ username: temp.username, msg: "updated!" });
});

// delete user
app.delete("/api/users/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(err) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let temp = await user.destroy({
    where: {
      id: req.params.id
    }
  });
  res.send({ username: temp.username, msg: "deleted!" });
});

// retrieve todos
app.get("/api/todos", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(err) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let todoList = await todo.findAll({ raw: true });
  res.send(todoList);
});

//retrieve todo by id
app.get("/api/todos/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(err) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let todoOne = await todo.findOne(
    { where: { id: req.params.id } },
    { raw: true }
  );
  res.send(todoOne);
});

// create
app.post("/api/todos", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(err) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let temp = await todo.create({ text: req.body.text });
  res.send(temp);
});

//update
app.put("/api/todos/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(err) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let temp = await todo.update(
    {
      text: req.body.text,
      done: req.body.done
    },
    {
      where: { id: req.params.id }
    }
  );
  res.send(temp);
});

app.put("/api/donetodos/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(err) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let temp = await todo.update(
    {
      done: req.body.done
    },
    {
      where: { id: req.params.id }
    }
  );
  res.send(temp);
});

// delete
app.delete("/api/todos/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, jwtOptions.secretOrKey, function(err) {
    if (err) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    }
  });
  let temp = await todo.destroy({
    where: {
      id: req.params.id
    }
  });
  res.send({ id: temp.id, text: temp.text });
});

// for undefined urls.

app.listen(port, () => console.log(`Todo app listening on port ${port}!`));
