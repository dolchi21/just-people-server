var express = require('express')
var router = express.Router()

var db = require('../db')
var Location = db.model('Location')

var LocationService = require('../services/location')

router.get('/', (req, res, next) => {
    Location.all().then(locations => {
        var data = locations.map(i => i.get())
        res.json({ data })
    }).catch(next)
})

router.get('/:id', async (req, res, next) => {
    try {
        var location = await Location.findById(req.params.id)
        var children = await LocationService.getChildLocations(req.params.id)
        var locations = await Location.all({
            where: {
                id: {
                    [db.Op.in]: children
                }
            }
        })
        res.json({
            data: {
                name: location.get('name'),
                location,
                children,
                locations
            }
        })
    } catch (err) {
        return next(err)
    }
})

module.exports = router
