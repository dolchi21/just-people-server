const {
    RESPONSE_DELAY
} = process.env

var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var logger = require('morgan')

var app = express()

app.use(cors())

app.use(logger('dev'))
app.use(bodyParser.json())
app.use('/api', (req, res, next) => {
    var timeout = RESPONSE_DELAY ? +RESPONSE_DELAY : 0
    setTimeout(next, timeout)
})
app.use('/api', require('./routes/api'))

var appGetRoot = {
    start: new Date()
}
app.get('/', (req, res, next) => {
    res.json({
        data: appGetRoot
    })
})

module.exports = app
