var Sequelize = require('sequelize')

function connection() {
    var sequelize = new Sequelize('JustPeople', 'sa', 'password', {
        dialect: 'sqlite',
        storage: 'db.sqlite'
    })
    
    var Profile = require('./models/Profile')(sequelize)
    var ProfileCoordinates = require('./models/ProfileCoordinates')(sequelize)
    var ProfileImage = require('./models/ProfileImage')(sequelize)
    var Location = require('./models/Location')(sequelize)

    Profile.hasMany(ProfileImage)
    Profile.hasOne(ProfileCoordinates)

    Profile.belongsTo(Location)
    Location.belongsTo(Location)

    return sequelize
}

module.exports = connection()
