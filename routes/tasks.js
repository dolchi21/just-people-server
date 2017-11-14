var express = require('express')
var router = express.Router()

var db = require('../db')
var populate = require('../scripts/populate')

router.get('/populate', async (req, res, next) => {
    await db.sync({ force: true })
    await populate()
    res.send('populated')
})
router.get('/shutdown', (req, res, next) => {
    res.on('finish', () => process.exit(0))
    res.send('Server will shutdown now.')
})

module.exports = router
