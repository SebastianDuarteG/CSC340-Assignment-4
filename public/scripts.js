/*
Name: Sebastian Duarte
Assignment: Assignment: CSC340 Assignment 4
File Contents:  Script file for accessing API
*/

document.addEventListener('DOMContentLoaded', function(){
    getTaskList();

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const addName = document.getElementById('createName').value;
        const addPriority = document.getElementById('createPriority').value;
        const addDescription = document.getElementById('createDescription').value;
        addTask(addName, addPriority, addDescription);
    });
    
    const editButton = document.getElementById('edit');
    editButton.addEventListener('click', function(){
        const editName = document.getElementById('editName').value;
        const editPriority = document.getElementById('editPriority').value;
        const editDescription = document.getElementById('editDescription').value;
        editTask(editName, editPriority, editDescription);
    });

    const deleteButton = document.getElementById('delete');
    deleteButton.addEventListener('click', function(){
        const deleteName = document.getElementById('deleteName').value;
        deleteTask(deleteName);
    });

    function getTaskList (){
        const timestamp = new Date().getTime();
        const taskListAPI = `http://localhost:8000/taskList?timestamp=${timestamp}`;
        fetch (taskListAPI)
            .then (response => {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data => {
                displayList (data);
            })
            .catch (error => console.error('Could not get list', error));
    }

    function displayList (taskList){
        const taskTable = document.getElementById('taskTable');
        taskTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'NAME';
        const column2 = document.createElement ('th');
        column2.textContent = 'PRIORITY';
        const column3 = document.createElement ('th');
        column3.textContent = 'DESCRIPTION';
        row1.appendChild (column1);
        row1.appendChild (column2);
        row1.appendChild (column3);
        taskTable.appendChild(row1);

        taskList.forEach(task=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = task.name;
            const columnB = document.createElement ('th');
            columnB.textContent = task.priority;
            const columnC = document.createElement ('th');
            columnC.textContent = task.description;
            row.appendChild (columnA);
            row.appendChild (columnB);
            row.appendChild (columnC);
            taskTable.appendChild(row);
        });
    }

    function addTask (name, priority, description){
        if (!name || !priority){
            addError();
            return;
        }
        location.reload();
        const taskListAPI= 'http://localhost:8000/taskList/add';
        const reqBody = {
            name: name,
            priority: priority,
            description: description,
        }

        fetch(taskListAPI , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
            .then(response=> {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data =>{
                getTaskList();
            })
            .catch (error => console.error('Couldnt add task',error));
    }

    function editTask (name, priority, description){
        if (!name || !priority){
            editError();
            return;
        }
        location.reload();
        const taskListAPI= 'http://localhost:8000/taskList/edit';
        const reqBody = {
            name: name,
            priority: priority,
            description: description,
        }

        fetch (taskListAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
            .then(response=> {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then(data =>{
                getTaskList();
            })
            .catch (error => console.error('Couldnt edit task', error));
    }

    function deleteTask (name){
        if (!name){
            deleteError();
            return;
        }
        location.reload();
        const taskListAPI= 'http://localhost:8000/taskList/delete';
        const reqBody = {
            name: name,
        }

        fetch (taskListAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
            .then(response=> {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then(data =>{
                getTaskList();
            })
            .catch (error => console.error('Couldnt delete task', error));
    }

    function addError(){
        const errorMsg= document.getElementById('errorMessage');
        if (errorMsg){
            errorMsg.parentNode.removeChild(errorMsg);
        }
        const addSection = document.getElementById('add');
        const addErrorMsg = document.createElement('p');
        addErrorMsg.setAttribute('id', 'errorMessage');
        addErrorMsg.textContent="INVALID ADD REQUEST"
        addSection.appendChild(addErrorMsg);
    }

    function editError(){
        const errorMsg= document.getElementById('errorMessage');
        if (errorMsg){
            errorMsg.parentNode.removeChild(errorMsg);
        }
        const editSection = document.getElementById('edit');
        const editErrorMsg = document.createElement('p');
        editErrorMsg.setAttribute('id', 'errorMessage');
        editErrorMsg.textContent="INVALID EDIT REQUEST"
        editSection.appendChild(editErrorMsg);
    }

    function deleteError(){
        const errorMsg= document.getElementById('errorMessage');
        if (errorMsg){
            errorMsg.parentNode.removeChild(errorMsg);
        }
        const deleteSection = document.getElementById('delete');
        const deleteErrorMsg = document.createElement('p');
        deleteErrorMsg.setAttribute('id', 'errorMessage');
        deleteErrorMsg.textContent="INVALID DELETE REQUEST"
        deleteSection.appendChild(deleteErrorMsg);
    }
})