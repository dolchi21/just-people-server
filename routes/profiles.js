var express = require('express')
var router = express.Router()

var db = require('../db')
var Location = db.model('Location')
var Profile = db.model('Profile')

router.get('/', (req, res, next) => {
    Profile.all({
        include: [{ all: true }]
    }).then(profiles => {
        var data = profiles.map(i => i.get())
        res.json({ data })
    })
})

router.use('/stats/byLocation', (req, res, next) => {
    var sql = 'SELECT p.LocationId as id, l.name, COUNT(1) as profiles FROM Profiles p JOIN Locations l ON p.LocationId=l.id GROUP BY p.LocationId ORDER BY profiles DESC, l.name'
    db.query(sql, { type: db.Sequelize.QueryTypes.SELECT }).then(rows => {
        res.json({
            meta: sql,
            data: rows
        })
    }).catch(next)
})

module.exports = router
