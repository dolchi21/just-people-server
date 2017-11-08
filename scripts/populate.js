var db = require('../db')
var Profile = db.model('Profile')
var Location = db.model('Location')

function makeData() {

    var profiles = [{
        id: 1,
        name: 'Denise',
        phone: '+54 11 7894-1591',
        gender: 'm',
        location: 'Santa Fe'
    }, {
        id: 2,
        name: 'Jessica',
        phone: '+54 11 9879-4564',
        gender: 'f',
        location: 'Vicente López'
    }, {
        id: 3,
        name: 'Tatiana',
        phone: '+54 11 1234-4789',
        gender: 't',
        location: 'Gran Buenos Aires'
    }].map(profile => {
        profile.avatar = '/assets/profiles/:id/avatar.png'.replace(':id', profile.id)
        return profile
    })

    var locations = [{
        id: 1,
        name: 'Argentina'
    }, {
        id: 2,
        name: 'Buenos Aires',
        parentId: 1
    }, {
        id: 3,
        name: 'CABA',
        parentId: 2
    }, {
        id: 4,
        name: 'Gran Buenos Aires',
        parentId: 2
    }, {
        id: 5,
        name: 'Vicente López',
        parentId: 4
    }, {
        id: 6,
        name: 'Santa Fe',
        parentId: 1
    }, {
        id: 7,
        name: 'Nuñez',
        parentId: 3
    }]

    return {
        locations,
        profiles
    }
}
async function syncDatabase() {
    await db.sync({ force: true })
}
async function createLocations(locations = []) {
    for (var i = 0; i < locations.length; i++) {
        var location = locations[i]
        await Location.findOrCreate({
            where: {
                name: location.name,
                LocationId: location.parentId
            }
        })
    }
}
async function createProfiles(profiles) {
    for (var i = 0; i < profiles.length; i++) {
        var profile = profiles[i]
        var dbProfile = await Profile.create(profile)
        if (profile.location) {
            var dbLocation = await Location.findByName(profile.location) || await Location.create({
                name: profile.location
            })
            await dbProfile.setLocation(dbLocation)
        }
    }
}

async function main() {

    var { locations, profiles } = makeData()

    await createLocations(locations)
    await createProfiles(profiles)

}

module.exports = main().catch(err => {
    console.error(err)
})
