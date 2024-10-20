const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

addTodoBtn.disabled = true;

// Load saved todos from local storage
document.addEventListener('DOMContentLoaded', loadTodos);

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        addTodoToDOM(todo);
    });
}

function taskExists(todoText) {
    const tasks = Array.from(todoList.children);
    return tasks.some(task => task.childNodes[1].textContent === todoText);
}

function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText !== "") {
        if (taskExists(todoText)) {
            alert('This task already exists in the list.');
            return;
        }

        addTodoToDOM(todoText);
        saveTodoToLocalStorage(todoText);
        todoInput.value = '';
    } else {
        alert('Please enter a task');
    }
}

function addTodoToDOM(todoText) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed', checkbox.checked);
    });

    const textNode = document.createTextNode(todoText);
    li.appendChild(checkbox);
    li.appendChild(textNode);

    const removeBtn = document.createElement('button');
    removeBtn.classList = "remove-Btn";
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this task?')) {
            li.remove();
            removeTodoFromLocalStorage(todoText);
        }
    });

    li.setAttribute('draggable', true);
    li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', todoText);
        li.classList.add('dragging');
    });
    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
    });

    li.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    li.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedText = e.dataTransfer.getData('text/plain');
        const draggedElement = Array.from(todoList.children).find(task => task.childNodes[1].textContent === draggedText);
        if (draggedElement && draggedElement !== li) {
            const rect = li.getBoundingClientRect();
            const offset = e.clientY - rect.top;
            if (offset > rect.height / 2) {
                todoList.insertBefore(draggedElement, li.nextSibling);
            } else {
                todoList.insertBefore(draggedElement, li);
            }
        }
    });

    li.appendChild(removeBtn);
    todoList.appendChild(li);
}

function saveTodoToLocalStorage(todoText) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function removeTodoFromLocalStorage(todoText) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function toggleAddButton() {
    addTodoBtn.disabled = todoInput.value.trim() === "";
}

// Event listeners
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
todoInput.addEventListener('input', toggleAddButton);
