const express = require('express')

const {db} = require('./database/db')
const routingService = require('./routes/todos')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', express.static(__dirname + '/public'))
app.use('/tasks', routingService)

db.sync()
    .then( ()=> {
        app.listen(6543)
    })
    .catch( (err)=> {
        console.error(err)
    })

