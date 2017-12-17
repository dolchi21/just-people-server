module.exports = function makeProfileModel(sequelize = require('../index'), Sequelize = require('sequelize')) {

    var Model = sequelize.define('ProfileCoordinates', {
        latitude: {
            type: Sequelize.REAL,
            allowNull: false
        },
        longitude: {
            type: Sequelize.REAL,
            allowNull: false
        }
    })

    return Model
}