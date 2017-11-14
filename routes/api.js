var fs = require('fs')

var express = require('express')
var multer = require('multer')
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

router.get('/env', (req, res, next) => {
    res.json(process.env)
})

router.use('/locations', require('./locations'))
router.use('/profiles', require('./profiles'))

router.get('/queries', async (req, res, next) => {
    var queries = [
        'SELECT * FROM Profiles',
        'SELECT * FROM Locations'
    ]
    var results = queries.map(async sql => ({
        sql,
        result: await db.query(sql)
    }))
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

var upload = multer({
    dest: 'tmp/'
})
router.post('/database', upload.single('database'), async (req, res, next) => {
    await db.close()
    await renameFile('./db.sqlite', './db.' + Date.now() + '.sqlite')
    await renameFile(req.file.path, './db.sqlite')
    res.json(req.file)
})
router.get('/shutdown', (req, res, next) => {
    res.on('finish', () => process.exit(0))
    res.send('Server will shutdown now.')
})

module.exports = router

function renameFile(oldName, newName) {
    return new Promise((resolve, reject) => {
        fs.rename(oldName, newName, err =>
            err ? reject(err) : resolve())
    })
}