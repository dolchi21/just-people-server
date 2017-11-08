var express = require('express')
var router = express.Router()

var LocationService = require('../services/location')
var db = require('../db')
var asd = (async () => {
    //return
    await db.sync({ force: true })
    await require('../scripts/populate')
})()

router.get('/', (req, res, next) => {
    var routes = [{
        path: '/people'
    }]
    res.json({
        data: routes
    })
})

router.get('/profiles', (req, res, next) => {
    var Profile = db.model('Profile')
    Profile.all({
        include: [{ all: true }]
    }).then(profiles => {
        var data = profiles.map(i => i.get())
        res.json({ data })
    })
})

router.use('/profiles/stats/byLocation', (req, res, next) => {
    var sql = 'SELECT p.LocationId as id, l.name, COUNT(1) as profiles FROM Profiles p JOIN Locations l ON p.LocationId=l.id GROUP BY p.LocationId ORDER BY profiles DESC, l.name'
    db.query(sql, { type: db.Sequelize.QueryTypes.SELECT }).then(rows => {
        res.json({
            meta: sql,
            data: rows
        })
    }).catch(next)
})

router.get('/locations', (req, res, next) => {
    var Location = db.model('Location')
    Location.all().then(locations => {
        var data = locations.map(i => i.get())
        res.json({ data })
    })
})

router.get('/locations/:id', async (req, res, next) => {
    var Location = db.model('Location')
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

router.get('/queries', async (req, res, next) => {
    var queries = [
        'SELECT * FROM Profiles',
        'SELECT * FROM Locations'
    ]
    var results = queries.map(async sql => {
        return {
            sql,
            result: await db.query(sql)
        }
    })
    var data = await Promise.all(results)
    res.json({
        data
    })
})

router.get('/database', (req, res, next) => {
    var path = require('path')
    var filename = path.join(__dirname, '../db.sqlite')
    res.sendFile(filename)
})

module.exports = router
