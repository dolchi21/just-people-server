var express = require('express')
var validator = require('validator')

var router = express.Router()

var db = require('../db')
var Location = db.model('Location')
var Profile = db.model('Profile')
var ProfileImage = db.model('ProfileImage')

function ProfileInterface(profile) {
    profile.coordinates = profile.ProfileCoordinate && {
        latitude: profile.ProfileCoordinate.latitude,
        longitude: profile.ProfileCoordinate.longitude
    }
    profile.avatar = (profile.ProfileImages.find(img => img.role === 'avatar') || {}).url
    profile.images = profile.ProfileImages.filter(img => img.role !== 'avatar')
    delete profile.ProfileCoordinate
    delete profile.ProfileImages
    delete profile.description
    return profile
}

router.get('/', (req, res, next) => {
    Profile.all({
        include: [{ all: true }]
    }).then(profiles => {
        var data = profiles.map(i => i.get()).map(ProfileInterface)
        res.json({ data })
    }).catch(next)
})

router.post('/', (req, res, next) => {
    var { name, phone, gender, location } = req.body
    if (!name || !phone || !gender || !location) {
        var err = new Error('Data is missing')
        err.data = req.body
        return next(err)
    }

    if (!validator.isIn(gender, ['f', 'm', 't']))
        return next(new Error('Gender is not valid'))

    if (!validator.isNumeric(location))
        return next(new Error('Location is not valid'))

    next()
}, (req, res, next) => {
    var { name, phone, gender, location } = req.body
    Profile.create({
        name,
        phone,
        gender,
        LocationId: +location
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
            data: ProfileInterface(profile.get())
        })
    }).catch(next)
})

router.get('/:id/images', (req, res, next) => {
    var { id } = req.params
    ProfileImage.all({
        where: {
            ProfileId: id
        }
    }).then(images => {
        res.json({
            data: images.map(i => i.get())
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
