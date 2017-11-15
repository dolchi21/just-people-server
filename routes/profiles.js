var express = require('express')
var validator = require('validator')

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
    }).catch(next)
})

router.post('/', (req, res, next) => {
    var { name, phone, gender } = req.body
    if (!name || !phone || !gender) {
        var err = new Error('Data is missing')
        err.data = req.body
        return next(err)
    }

    if (!validator.isIn(gender, ['f', 'm', 't']))
        return next(new Error('Gender is not valid'))

    next()
}, (req, res, next) => {
    var { name, phone, gender } = req.body
    Profile.create({
        name,
        phone,
        gender
    }).then(profile => {
        res.json({
            data: profile.get()
        })
    }).catch(next)
})

router.get('/:id', (req, res, next) => {
    Profile.findById(req.params.id, {
        include: [{ all: true }]
    }).then(profile => {
        res.json({
            data: profile.get()
        })
    }).catch(next)
})

router.post('/:id/images', (req, res, next) => {
    var { role, url } = req.body

    next()
}, (req, res, next) => {
    var { role, url } = req.body
    Profile.findById(req.params.id).then(async profile => {

        var image = await profile.createProfileImage({
            role,
            url
        })

        res.json({
            data: image.get()
        })

    }).catch(next)
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
