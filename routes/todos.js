const { Router } = require('express')

const { Tasks } = require('../database/db')
const { Notes } = require('../database/db')

const route = Router()

// GET request to get all the tasks
route.get('/', async (req, res) => {
    console.log('GET request to get all the tasks')
    try {
        const taskList = await Tasks.findAll()
        res.send(taskList)
    } catch (err) {
        console.err(err)
        res.status(404).send("No such data found")
    }
})

// GET Request for Task with Id
route.get('/:id', async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'Task Id must be an Integer',
        })
    }

    const taskFetched = await Tasks.findByPk(req.params.id)

    if (!taskFetched) {
        return res.send(404).send({
            error: 'No task found with id = ' + req.params.id,
        })
    }

    res.status(201).send(taskFetched)
})

// POST Request for adding new Task
route.post('/', async (req, res) => {
    console.log('Data received')
    var task = req.body
    createdTask = await Tasks.create(task)
    res.status(201).send({ success: 'New task added' })
})

// PATCH Request for updating a Task with given Id
route.patch('/:id', async (req, res) => {
    console.log('Data received on id ', req.params.id)
    var task = req.body
    createdTask = await Tasks.update(task, {
        where: {
            id: req.params.id
        }
    })
    res.status(200).send({ success: 'Task Details Updated' })

})

// GET Request for Notes under given TaskId
route.get('/:id/notes', async (req, res) => {
    listOfNotes = await Notes.findAll({
        where: {
            taskId: req.params.id
        }
    })
    // console.log(listOfNotes)
    res.send(listOfNotes)
})

// POST Request to add a Note under given TaskId
route.post('/:id/notes', async (req, res) => {

    createdNote = await Notes.create(req.body)
    res.status(200).send({ success: 'New note created' })

})

module.exports = route