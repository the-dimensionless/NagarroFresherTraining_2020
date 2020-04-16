const express = require('express')

const { db } = require('./database/db')
const routingService = require('./routes/todos')

const port = process.env.PORT || 6543
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', express.static(__dirname + '/public'))
app.use('/tasks', routingService)

db.sync()
    .then(() => {
        app.listen(port)
    })
    .catch((err) => {
        console.error(err)
    })

