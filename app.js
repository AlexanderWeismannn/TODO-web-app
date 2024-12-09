const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allToDos = getToDos();
updateToDoList();

todoForm.addEventListener('submit',function(e){
    e.preventDefault();
    addToDo();
});


function addToDo(){
    const toDoText = todoInput.value.trim();
    if(toDoText.length > 0){
        const todoObject = {
            text: toDoText,
            completed: false
        }
        allToDos.push(todoObject);
        updateToDoList(); 
        todoInput.value = "";
    }   
}

function updateToDoList(){
    todoListUL.innerHTML = ""; 
    allToDos.forEach((todo,todoIndex) =>{
        todoItem = createTodoItem(todo,todoIndex);
        // reduce the text size
        todoItem.querySelector('.todo-text').style.fontSize = `${24 - (todoIndex * 2)}pt`;
        // make the widget smaller
        const baseW = 90;
        const decrement = 6;
        const newWidth = baseW - (todoIndex * decrement);
        todoItem.style.width = `${newWidth}%`;
        todoListUL.append(todoItem);
        saveToDos();
    })

    //sortable.js
    new Sortable(todoListUL,{
        animation: 150,
        ghostClass: 'ghost',
        onEnd: function() {
            const newOrder = Array.from(todoListUL.children).map((item) =>
            item.querySelector('.todo-text').textContent.trim()
            );

            allToDos = newOrder.map((text) =>
                 allToDos.find((todo) => todo.text === text)
            );
            updateToDoList();
            saveToDos();
        },
    });
}

function createTodoItem(todo, todoIndex){
    const todoID = "todo-"+todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
    <input type="checkbox" id= "${todoID}">
            <label class="custom-checkbox" for= "${todoID}">
                <svg fill="transparent" xmlns="htt p://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                </svg>
            </label>
            <label for= "${todoID}" class="todo-text">
                ${todoText}
            </label>
            <button class="delete-button">
                <svg fill var(--secondary-color) xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </button>
    `
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click",()=>{
        deleteToDoItem(todoIndex);
    })
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
         allToDos[todoIndex].completed = checkbox.checked;
         saveToDos();
    })
    checkbox.checked = todo.completed;
    return todoLI;
}

function saveToDos(){
    const todoJson = JSON.stringify(allToDos);
    localStorage.setItem("todos",todoJson);
}

function getToDos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function deleteToDoItem(index){
    allToDos = allToDos.filter((_,i) => i !== index);
    saveToDos();
    updateToDoList();
}



