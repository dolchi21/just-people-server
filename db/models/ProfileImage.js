module.exports = function makeProfileModel(sequelize = require('../index'), Sequelize = require('sequelize')) {

    var Model = sequelize.define('ProfileImage', {
        role: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    return Model
}