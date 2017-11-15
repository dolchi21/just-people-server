var fs = require('fs')
var express = require('express')
var multer = require('multer')
var router = express.Router()

var LocationService = require('../services/location')
var db = require('../db')

var appGetRoot = {
    start: new Date()
}
router.get('/', (req, res, next) => {
    res.json({
        data: appGetRoot
    })
})

router.get('/env', (req, res, next) => {
    res.json(process.env)
})

router.use('/locations', require('./locations'))
router.use('/profiles', require('./profiles'))
router.use('/tasks', require('./tasks'))

router.get('/queries', async (req, res, next) => {
    var queries = [
        'SELECT * FROM Profiles',
        'SELECT * FROM ProfileImages',
        'SELECT * FROM Locations'
    ]
    var results = queries.map(async sql => ({
        sql,
        result: await db.query(sql)
    }))
    Promise.all(results).then(data => {
        res.json({
            data
        })
    }).catch(next)
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

module.exports = router

function renameFile(oldName, newName) {
    return new Promise((resolve, reject) => {
        fs.rename(oldName, newName, err =>
            err ? reject(err) : resolve())
    })
}