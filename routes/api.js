var express = require('express')
var router = express.Router()

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

router.get('/locations', (req, res, next) => {
    var Location = db.model('Location')
    Location.all().then(locations => {
        var data = locations.map(i => i.get())
        res.json({ data })
    })
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
