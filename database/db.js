const Sequelize = require("sequelize");

const db = new Sequelize( {
    dialect: 'sqlite',
    storage: __dirname + '/todos.db'
})

const Tasks = db.define('tasks', {

    //Column: stores Id of task
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    /* Column : stores Title of task
    Compulsory */
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    /* Column: stores Description of task
    Optional */
    description: {
        type: Sequelize.STRING(1234),
        allowNull: true
    },

    /* Column: stores due date
    Compulsory with default (at UI side) */
    due: {
        type: Sequelize.DATE
    },

    /* Column: stores status of task : Completed/Incompleted
    New tasks to be in incompleted state
    CompletedTask - Boolean True,
    IncompletedTask - Boolean False */
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    /* Column: stores priority of task :
    Can be HIGH, MEDIUM, LOW
    defaults to MEDIUM */
    priority: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Medium'
    }
})

const Notes = db.define('notes', {

    // Column: stores Id of note
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Column: stores a note
    note: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Defining One-to-Many Relationship
Tasks.hasMany(Notes, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
})
Notes.belongsTo(Tasks)

module.exports = {
    db, Tasks, Notes
}

// Testing the connection
/* db
    .authenticate()
    .then( ()=> {
        console.log('Connection has been established now')
    })
    .catch( (err)=> {
        console.error('Unable to connect', err)
    }) */