//app.js
// API for access to database
'use strict';
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const multer = require('multer');
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = 'Something went wrong on the server.';
/**
* Establishes a database connection to a database and returns the database object.
* Any errors that occur during connection should be caught in the function
* that calls this one.
* @returns {Object} - The database object for the connection.
*/
async function getDBConnection() {
const db = await sqlite.open({
filename: 'database.db',
driver: sqlite3.Database
});
return db;
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3002');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 
    next();
});

app.get('/taskList', async function (req, res){
    try{
        let qry = 'SELECT name, priority, description FROM taskList ORDER BY priority DESC;';
        let db = await getDBConnection();
        let taskList = await db.all(qry);
        await db.close();
        res.json(taskList);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/taskList/add', async (req,res) => {
    try {
        const reqBody = {
            name: req.body.name,
            priority: req.body.priority,
            description: req.body.description,
        };
        if (!reqBody.name, !reqBody.priority){
            return res.status(400).send ("Invalid request.");
        } else if (!reqBody.description){
            reqBody.description = "N/A";
        }
        const query = 'INSERT INTO taskList (name, priority, description) '+
        `VALUES (?,?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.name, reqBody.priority, reqBody.description]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/taskList/delete', async (req, res)=>{
    try{
        const reqBody = {
            name : req.body.name,
        };
        if (!reqBody.name){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM taskList WHERE name = ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.name]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/taskList/edit', async (req, res)=>{
    try{
        const reqBody = {
            name : req.body.name,
            priority : req.body.priority,
            description : req.body.description,
        };
        if (!reqBody.name || !reqBody.priority){
            return res.status(400).send("Invalid Request");
        } else if (!reqBody.description){
            reqBody.description="N/A";
        }
        const query = `UPDATE taskList SET priority = ?, description= ? WHERE name = ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.priority, reqBody.description, reqBody.name]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});



const PORT = process.env.PORT || 8000;
app.listen(PORT);