document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-list');
    const editPopup = document.getElementById('edit-popup');
    const editForm = document.getElementById('edit-form');
    const editInput = document.getElementById('edit-input');
    const editOkButton = document.getElementById('edit-ok');
    const editCancelButton = document.getElementById('edit-cancel');
    const closeEditPopup = document.querySelector('.close');

    let currentEditSpan = null;

    loadTodos();

    todoForm.addEventListener('submit', addTodo);
    editOkButton.addEventListener('click', saveEdit);
    editCancelButton.addEventListener('click', closePopup);
    closeEditPopup.addEventListener('click', closePopup);
    window.addEventListener('click', (event) => {
        if (event.target === editPopup) {
            closePopup();
        }
    });

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const completed = JSON.parse(localStorage.getItem('completed')) || [];

        todos.forEach(todoText => {
            const todoItem = createTodoItem(todoText);
            todoList.appendChild(todoItem);
        });

        completed.forEach(todoText => {
            const todoItem = createTodoItem(todoText, true);
            completedList.appendChild(todoItem);
        });
    }

    function saveTodos() {
        const todos = [];
        const completed = [];

        todoList.querySelectorAll('li span').forEach(span => todos.push(span.textContent));
        completedList.querySelectorAll('li span').forEach(span => completed.push(span.textContent));

        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.setItem('completed', JSON.stringify(completed));
    }

    function addTodo(event) {
        event.preventDefault();
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            const todoItem = createTodoItem(todoText);
            todoList.appendChild(todoItem);
            todoInput.value = '';
            saveTodos();
        }
    }

    function createTodoItem(text, isCompleted = false) {
        const li = document.createElement('li');

        const taskDetails = document.createElement('div');
        taskDetails.classList.add('task-details');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', toggleComplete);

        const taskInfo = document.createElement('div');
        taskInfo.classList.add('task-info');

        const span = document.createElement('span');
        span.textContent = text;
        if (isCompleted) span.classList.add('completed');

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            editInput.value = span.textContent;
            currentEditSpan = span;
            editPopup.style.display = 'block';
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            const confirmed = confirm('Are you sure you want to delete this task?');
            if (confirmed) {
                li.parentElement.removeChild(li);
                saveTodos();
            }
        });

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        const now = new Date();
        timestamp.textContent = `Created on: ${now.toLocaleString()}`;

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(span);
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);
        taskDetails.appendChild(taskInfo);
        taskDetails.appendChild(taskActions);

        li.appendChild(taskDetails);
        li.appendChild(timestamp);

        return li;
    }

    function toggleComplete(event) {
        const listItem = event.target.closest('li');
        const taskInfo = listItem.querySelector('.task-info span');

        if (event.target.checked) {
            completedList.appendChild(listItem);
            taskInfo.classList.add('completed');
            listItem.querySelector('.edit').remove();
            listItem.querySelector('.delete').remove();
        } else {
            todoList.appendChild(listItem);
            taskInfo.classList.remove('completed');
            const taskActions = listItem.querySelector('.task-actions');
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            editButton.classList.add('edit');
            editButton.addEventListener('click', () => {
                editInput.value = listItem.querySelector('span').textContent;
                currentEditSpan = listItem.querySelector('span');
                editPopup.style.display = 'block';
            });

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => {
                const confirmed = confirm('Are you sure you want to delete this task?');
                if (confirmed) {
                    const parentList = listItem.parentElement;
                    parentList.removeChild(listItem);
                }
            });
            
            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);
        }

        saveTodos();
    }

    function saveEdit() {
        const confirmed = confirm('Are you sure you want to save changes?');
        if (confirmed && currentEditSpan) {
            currentEditSpan.textContent = editInput.value.trim() || 'Unnamed task';
            closePopup();
            saveTodos();
        }
    }

    function closePopup() {
        editPopup.style.display = 'none';
        editInput.value = '';
        currentEditSpan = null;
    }
});
