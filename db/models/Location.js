module.exports = function makeLocationModel(sequelize = require('../index'), Sequelize = require('sequelize')) {

    var Model = sequelize.define('Location', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
    Model.findByName = name => {
        return Model.findOne({
            where: { name }
        })
    }

    return Model
}