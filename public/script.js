var listOfTasks = []
const list = document.getElementById("listElement")

var currentTaskID = null
var currenNoteID = null
notesSection = null
noteForm = null

notesFetch = fetch("/todoElement.html").then(res => res.text())
notesFetch.then(j => {
    notesSection = j
})
notesFetch = fetch("/addNoteFormElement.html").then(res => res.text())
notesFetch.then(j => {
    noteForm = j
})

actives = []

async function fetchAll() {
    document.getElementById("AddtaskForm").style.display = "none"
    document.getElementById("UpdatetaskForm").style.display = "none"

    res = await fetch('/tasks', { method: 'GET' })
    data = await res.json()
    await data.forEach(i => {
        listOfTasks.push(i)
    })
    // console.log("GET Success and then listOfTasks is ", listOfTasks)
    printViewTasks()
}

function printViewTasks() {
    list.innerHTML = ""
    index = 0
    listOfTasks.forEach(element => {
        index = index + 1
        printView(element, index)
    });
}

function printView(i, index) {
    let task = document.createElement('li')
    task.setAttribute('id', i['id'])
    task.classList.add(`e${i.id}`)
    task.innerHTML = notesSection
    task.querySelector('.mainContent').addEventListener("click", displayNotesOnThis, true)
    task.querySelector('.mainContent').id = i.id
    list.appendChild(task)

    task.querySelector(".orderID").innerHTML = "ID : " + index
    task.querySelector(".title").innerHTML = "Title : " + i['title']
    task.querySelector(".description").innerHTML = "Description : " + i['description']
    task.querySelector(".due").innerHTML = "Due Date : " + i['due'].substr(0, 10)
    task.querySelector(".priority").innerHTML = "Priority : " + i['priority']
    task.querySelector(".status").innerHTML = "Status : " + i['status']
}

async function displayNotesOnThis(e) {
    callerTaskId = this.id
    const element = document.querySelector(`.e${callerTaskId}`)

    if (actives.indexOf(callerTaskId) !== -1) {
        actives = actives.filter(function (i) {
            return i !== callerTaskId
        })
        collapseThis(callerTaskId)
    } else {
        actives.push(callerTaskId)
        notesList = element.querySelector(".notes")

        res = await fetch(`tasks/${this.id}/notes`, { method: 'GET' })
        notesArray = await res.json()
        if (notesArray.length == 0) {
            console.log("No notes")
            addFormNoteViewer(callerTaskId)
            return
        } else {
            notesList.innerHTML = ""
            await notesArray.forEach(element => {
                // console.log("ading a note with value ",element)
                displayNote(notesList, element)
            })
            await addFormNoteViewer(callerTaskId)
        }
        console.log("You are viewing Task Notes")
    }
}

async function collapseThis(callerTaskId) {
    // console.log("Time to close taskID", callerTaskId)
    noteList = document.querySelector(`.e${callerTaskId}`).querySelector(".notes")
    noteList.innerHTML = ""
    document.querySelector(`.e${callerTaskId}`).querySelector(".notesFormDiv").innerHTML = ""
}

function displayNote(notesList, note) {
    child = document.createElement('li')
    child.className += "customListClass"
    notesList.appendChild(child)
    child.innerHTML = note['note']
}

async function addFormNoteViewer(callerTaskId) {
    buttonElement = document.querySelector(`.e${callerTaskId}`).querySelector(".notesFormDiv")
    buttonElement.innerHTML = noteForm
    formButton = buttonElement.querySelector(".noteSubmitButton")
    formButton.addEventListener("click", addNote)
}

async function addNote(e) {
    noteFormGet = e.srcElement.parentNode
    taskNode = e.path[5]
    currentTaskID = taskNode.id
    console.log(currentTaskID)

    note = {
        /* id: noteForm.querySelector('.noteId').value, */
        note: noteFormGet.querySelector('.noteVerbose').value,
        taskId: currentTaskID
    }

    resp = await fetch('/tasks/' + currentTaskID + '/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
    })

    if (resp.status == 200) {
        console.log('All good')
    } else {
        console.log('Some error')
    }

    taskItem = document.getElementById(currentTaskID)
    notesList = taskItem.querySelector(".notes")
    displayNote(notesList, note)
}

function Sort() {
    preferenceNode = document.getElementById("sortingPreference")
    console.log(preferenceNode)
    preference = preferenceNode.value
    callback = printViewTasks

    if (preference == "dateASC") {
        modeDateASC(callback)
    } else if (preference == "priority") {
        modePriority(callback)
    } else if (preference == "status") {
        modeStatus(callback)
    } else if (preference == "dateDESC") {
        modeDateDESC(callback)
    }
}

function modeStatus(callback) {
    l1 = listOfTasks.filter(function (i) {
        if (i['status'] == "Completed") {
            return i
        }
    })

    listOfTasks = listOfTasks.filter(function (i) {
        if (i['status'] == "Incomplete") {
            return i
        }
    })
    listOfTasks.push.apply(listOfTasks, l1)
    callback()
}

function modePriority(callback) {
    l1 = listOfTasks.filter(function (i) {
        if (i['priority'] == "Medium") {
            return i
        }
    })
    listOfTasks.push.apply(listOfTasks, l1)

    l2 = listOfTasks.filter(function (i) {
        if (i['priority'] == "Low") {
            return i
        }
    })

    listOfTasks = listOfTasks.filter(function (i) {
        if (i['priority'] == "High") {
            return i
        }
    })
    listOfTasks.push.apply(listOfTasks, l1)
    listOfTasks.push.apply(listOfTasks, l2)
    callback()
}

function modeDateDESC(callback) {
    function GetSortOrder(prop) {
        return function (a, b) {
            if (new Date(a[prop]) < new Date(b[prop])) {
                return 1;
            } else if (new Date(a[prop]) > new Date(b[prop])) {
                return -1;
            }
            return 0;
        }
    }
    listOfTasks.sort(GetSortOrder("due"))
    callback()
}

function modeDateASC(callback) {
    function Order(prop) {
        return function (a, b) {
            if (new Date(a[prop]) < new Date(b[prop])) {
                return -1;
            } else if (new Date(a[prop]) > new Date(b[prop])) {
                return 1;
            }
            return 0;
        }
    }
    listOfTasks.sort(Order("due"))
    callback()
}

async function addTask() {
    const allInputs = document.querySelectorAll(".formInput")
    let task = {}
    allInputs.forEach(el => {
        task[el.id] = el.value
    })

    resp = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })

    console.log(JSON.stringify(task))
    console.log('Data sent from Client side')

    if (resp.status == 201) {
        console.log('Successfully Added')
    } else {
        console.error('Some problem ocurred')
    }

    // await globalListOfTasks.push(task)
    // list.innerHTML = ""
    printView(task, listOfTasks.length + 1)
    collapseAllView()
}

function collapseAllView() {
    document.getElementById("AddtaskForm").style.display = "none"
    document.getElementById("UpdatetaskForm").style.display = "none"
}

async function updateTask() {
    tID = document.getElementById("idToUpdate").value

    priorityByUser = document.getElementById("priorityToUpdate").value
    dueByUser = document.getElementById("dueToUpdate").value
    statusByUser = document.getElementById("statusToUpdate").value

    currentDetailsOnId = listOfTasks[tID - 1]
    if (currentDetailsOnId == undefined) {
        window.alert("No such TaskId exists. Please enter a valid TaskID")
        return false
    }
    // await console.log("current details", currentDetailsOnId)

    if (statusByUser != "") {
        currentDetailsOnId.status = statusByUser
    }
    if (priorityByUser != "") {
        currentDetailsOnId.priority = priorityByUser
    }
    if (dueByUser != "") {
        currentDetailsOnId.due = dueByUser
    }
    // console.log("to modify as", currentDetailsOnId)
    try {
        resp = await fetch('/tasks/' + currentDetailsOnId.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentDetailsOnId)
        })

    } catch (err) {
        console.log(err)
    }

    if (res.status == 200) {
        listOfTasks = []
        fetchAll()
    } else {
        console.log("error on server side", res)
    }
    collapseAllView()
}