<script lang="ts">
    import { tasksStore } from '$lib/stores/tasks.js';

    type Task = {
        id: number;
        text: string;
        completed: boolean;
    };


    let tasks: Task[] = $state([]);
    let newTaskText = $state('');

    // Subscribe to the store
    tasksStore.subscribe(value => {
        tasks = value;
    });

    function addTask() {
        if (newTaskText.trim()) {
            const newTask: Task = {
                id: Date.now(),
                text: newTaskText.trim(),
                completed: false
            };
            const updatedTasks = [...tasks, newTask];
            tasksStore.set(updatedTasks);
            newTaskText = '';
        }
    }

    function removeTask(id: number) {
        const updatedTasks = tasks.filter(task => task.id !== id);
        tasksStore.set(updatedTasks);
    }

    function toggleTask(id: number) {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        tasksStore.set(updatedTasks);
    }

    function updateTaskText(id: number, newText: string) {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, text: newText } : task
        );
        tasksStore.set(updatedTasks);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            addTask();
        }
    }
</script>

<h1 class="title">Edit Tasks</h1>

<!-- Add New Task Section -->
<section class="section add-task-section">
    <h2>Add New Task</h2>
    <div class="input-group">
        <input 
            type="text" 
            bind:value={newTaskText}
            onkeydown={handleKeydown}
            placeholder="Enter a new task..."
            class="task-input"
        />
        <button onclick={addTask} class="add-btn">
            ADD +
        </button>
    </div>
</section>

<!-- Task List Section -->
<section class="section task-list-section">
    <h2>Your Tasks</h2>
    <div class="task-list">
        {#each tasks as task (task.id)}
            <div class="task-item">
                <input 
                    type="checkbox" 
                    checked={task.completed}
                    onchange={() => toggleTask(task.id)}
                    class="task-checkbox"
                />
                <input 
                    type="text" 
                    value={task.text}
                    oninput={(e) => updateTaskText(task.id, (e.target as HTMLInputElement).value)}
                    class="task-text-input"
                    class:completed={task.completed}
                />
                <button 
                    onclick={() => removeTask(task.id)} 
                    class="remove-btn"
                    aria-label="Remove task"
                >
                    🗑️
                </button>
            </div>
        {/each}
    </div>
</section>

<style>
    /* Page-specific styles */
    .add-task-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .input-group {
        display: flex;
        gap: 10px;
    }

    .task-input {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
    }

    .add-btn {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    }

    .add-btn:hover {
        background: #45a049;
    }

    .task-list-section {
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .task-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .task-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }

    .task-checkbox {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .task-text-input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
    }

    .task-text-input:focus {
        border-color: #667eea;
    }

    .task-text-input.completed {
        text-decoration: line-through;
        opacity: 0.6;
    }

    .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 5px;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .remove-btn:hover {
        background: #f8d7da;
    }

    .add-task-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .input-group {
        display: flex;
        gap: 10px;
    }

    .task-input {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
    }

    .add-btn {
        background: linear-gradient(180deg, #6366f1 0%, #818cf8 100%);
        color: white;
        border: none;
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    }

    .add-btn:hover {
        background: #45a049;
    }

    .task-list-section {
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .task-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .task-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }

    .task-checkbox {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .task-text-input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
    }

    .task-text-input:focus {
        border-color: #667eea;
    }

    .task-text-input.completed {
        text-decoration: line-through;
        opacity: 0.6;
    }

    .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 5px;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .remove-btn:hover {
        background: #f8d7da;
    }
</style>