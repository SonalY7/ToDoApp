const Sequelize = require('sequelize');
const todoModel = require('./models/todo');
const userModel = require('./models/user')

const sequelize = new Sequelize('todo_development', 'todo_admint', 'postgres', 
                  {host: 'localhost',
                   dialect: 'postgres',
                   pool: {
                       max: 10,
                       min: 0,
                       acquire: 30000,
                       idle: 10000
                   }
                  });

const todo = todoModel(sequelize, Sequelize);
const user = userModel(sequelize, Sequelize);
// {force: true}
sequelize.sync()
 .then(() => {
    //   console.log(`Database with tables created!`);
 });
module.exports = {todo, user};

