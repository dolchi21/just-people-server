module.exports = function makeProfileModel(sequelize = require('../index'), Sequelize = require('sequelize')) {
    
    var Model = sequelize.define('Profile', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.STRING
        },
        avatar: {
            type: Sequelize.STRING
        }
    })

    return Model
}