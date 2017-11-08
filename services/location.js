var db = require('../db')
var Location = db.model('Location')

async function getChildLocations(id) {
    var locations = (await Location.all({
        where: {
            LocationId: id
        }
    })).map(l => l.id)

    var childLocations = (await Promise.all(locations.map(getChildLocations))).reduce((sum, arr) => {
        return sum.concat(arr)
    }, [])

    return locations.concat(childLocations)
}

module.exports = {
    getChildLocations
}
