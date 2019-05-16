module.exports = (sequelize, type) => {
    return sequelize.define('todo', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: type.STRING
        }
    })
}