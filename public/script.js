const list = document.getElementById("listElement")
var todoElement = null
var addNoteForm = null
var currentTaskID = 0
listOfTodos = []

async function addTask () {
    const allInputs = document.querySelectorAll(".formInput")
    let task = {}
    allInputs.forEach(el=>{
        task[el.id] = el.value
    })

    resp = await fetch ('/tasks', {
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

    fetchAll()
}

async function viewTaskList (listOfTasks) {
     let element = document.createElement('li')
     element.setAttribute('id', listOfTasks['id'])

     if (todoElement == null || addNoteForm == null) {
        todoElement = await fetch("/todoElement.html").then(res=>res.text())
        addNoteForm = await fetch("/addNoteFormElement.html").then(res=>res.text())
    }
    element.innerHTML = todoElement
    element.addEventListener("click", displayNotes)
   //  element.addEventListener("click", displayNotes, true)
    list.appendChild(element)
    element.querySelector(".title").innerHTML = listOfTasks['id']
    element.querySelector(".body").innerHTML = listOfTasks['description'] 
}

 async function displayNotes (e) {
    thisId = (this.id).trim()
    res = await fetch(`tasks/${thisId}/notes`, {method: 'GET'})
    notesArray = await res.json()

    currentTaskID = thisId
    taskItem = document.getElementById(thisId)

    div2 = document.createElement("div")
    div2.innerHTML = addNoteForm
    await taskItem.appendChild(div2)

    targets = ['#noteId', '#noteVerbose']
    targets.forEach(i=>{
        document.querySelector('#noteId').addEventListener(
            'click',
            function(event) {
              console.log('propagation stopped');
              event.stopPropagation();
            },
            true // Add listener to *capturing* phase
          );
    })
    
    notesList = taskItem.querySelector(".notes")
    formButton = div2.querySelector("#noteSubmitButton")
    formButton.addEventListener("click", addNote)

    if (notesArray.length == 0) {
        console.log("No notes")
        return
    } else {
        notesList.innerHTML = ""
        await notesArray.forEach(element => {
        console.log("ading a note with value ",element)
        displayNote(notesList, element)
    });
    }
}

 function displayNote (notesList, note) {
    child = document.createElement('li')
    notesList.appendChild(child)
    child.innerHTML = note['note']
}

async function addNote (e) {
    console.log("We are here in addNote()")

    if (!e) var e = window.event;
	e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    
    taskItem = document.getElementById(currentTaskID)
    noteForm = taskItem.querySelector("#addNote")

    note = {
        id: noteForm.querySelector('#noteId').value,
        note: noteForm.querySelector('#noteVerbose').value,
        taskId: currentTaskID
    }
    
    resp = await fetch ('/tasks/'+currentTaskID+'/notes', {
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
    console.log(this)
    taskItem = document.getElementById(currentTaskID)
    notesList = taskItem.querySelector(".notes")
     displayNote(notesList, note)
}

async function fetchAll () {
    resp = await fetch ('/tasks', {method: 'GET'})
    data = await resp.json()
    console.log("respone is ", data)

    for (let index = 0; index < data.length; index++) {
        viewTaskList (data[index])
        listOfTodos.push(data[index])
    }

    console.log("list of todos - > ", listOfTodos)
}