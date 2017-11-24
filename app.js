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
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('./public'))

app.use('/api', (req, res, next) => {
    var timeout = RESPONSE_DELAY ? +RESPONSE_DELAY : 0
    setTimeout(next, timeout)
})
app.use('/api', require('./routes/api'))

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    var jres = {
        name: err.name,
        message: err.message,
        stack: err.stack
    }
    if (err.data) jres.data = data
    res.json(jres)
})

module.exports = app
