module.exports = (sequelize, type) => {
    return sequelize.define('todo', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: type.STRING
        },
        done: {
            type: type.BOOLEAN,
            defaultValue: false,
            set: function(value) {
                if (value === 'true') value = true;
                if (value === 'false') value = false;
                this.setDataValue('done', value);
            }
        }
    })
}