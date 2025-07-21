const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Render all todos
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.className = `todo-item${todo.completed ? ' completed' : ''}`;

        li.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn" title="Mark as Done">&#10003;</button>
                <button class="delete-btn" title="Delete">&#128465;</button>
            </div>
        `;

        li.querySelector('.complete-btn').onclick = () => toggleComplete(idx);
        li.querySelector('.delete-btn').onclick = () => deleteTodo(idx);

        todoList.appendChild(li);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add new todo
todoForm.onsubmit = function(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        todoInput.value = '';
        renderTodos();
    }
};

function toggleComplete(idx) {
    todos[idx].completed = !todos[idx].completed;
    renderTodos();
}

function deleteTodo(idx) {
    todos.splice(idx, 1);
    renderTodos();
}

// Initial render
renderTodos();
