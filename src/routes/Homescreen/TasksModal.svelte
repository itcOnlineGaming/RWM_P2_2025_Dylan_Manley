<script lang="ts">
    import { tasksStore } from '$lib/stores/tasks.js';

    type Task = {
        id: number;
        text: string;
        completed: boolean;
    };

    let { isOpen = $bindable(false) } = $props<{ isOpen?: boolean }>();

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

    function closeModal() {
        isOpen = false;
    }

    function handleOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    function handleOverlayKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div 
        class="popup-overlay" 
        onclick={handleOverlayClick}
        onkeydown={handleOverlayKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
    >
        <div class="popup modal-tasks">
            <div class="modal-header">
                <h2 id="modal-title">Edit Tasks</h2>
                <button onclick={closeModal} class="close-btn" aria-label="Close modal">×</button>
            </div>

            <div class="modal-body">
                <!-- Add New Task Section -->
                <section class="add-task-section">
                    <h3>Add New Task</h3>
                    <div class="input-group">
                        <input 
                            type="text" 
                            bind:value={newTaskText}
                            onkeydown={handleKeydown}
                            placeholder="Enter a new task..."
                            class="task-input"
                            maxlength="45"
                        />
                        <button onclick={addTask} class="add-btn">
                            ADD +
                        </button>
                    </div>
                </section>

                <!-- Task List Section -->
                <section class="task-list-section">
                    <h3>Your Tasks</h3>
                    <div class="task-list-container">
                        {#each tasks as task (task.id)}
                            <div class="task-item-edit">
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
            </div>

            <div class="modal-footer">
                <button onclick={closeModal} class="save-close-btn">
                    SAVE & CLOSE
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Modal-specific adjustments */
    .modal-tasks {
        background: #E9D5FF;
        max-width: 500px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid rgba(139, 92, 246, 0.3);
    }

    .modal-header h2 {
        margin: 0;
        color: #333;
        font-size: 1.5rem;
        font-weight: 700;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: #6c757d;
        line-height: 1;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s, color 0.2s;
    }

    .close-btn:hover {
        background: rgba(139, 92, 246, 0.15);
        color: #8B5CF6;
    }

    .modal-body {
        overflow-y: auto;
        flex: 1;
        margin-bottom: 1rem;
    }

    .add-task-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
    }

    .add-task-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .input-group {
        display: flex;
        gap: 10px;
    }

    .task-input {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        outline: none;
    }

    .add-btn {
        background: #8B5CF6;
        color: white;
        border: none;
        padding: 0.75rem 1.25rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 700;
        font-size: 14px;
        transition: background 0.2s;
    }

    .add-btn:hover {
        background: #7C3AED;
    }

    .task-list-section {
        background: white;
        border: 2px solid #8B5CF6;
        padding: 1.5rem;
        border-radius: 12px;
    }

    .task-list-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #8B5CF6;
    }

    .task-list-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 300px;
        overflow-y: auto;
    }

    .task-item-edit {
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
        flex-shrink: 0;
    }

    .task-text-input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
    }

    .task-text-input:focus {
        border-color: #8B5CF6;
    }

    .task-text-input.completed {
        text-decoration: line-through;
        opacity: 0.6;
    }

    .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 5px;
        border-radius: 4px;
        transition: background 0.2s;
        flex-shrink: 0;
    }

    .remove-btn:hover {
        background: #f8d7da;
    }

    .modal-footer {
        padding-top: 1rem;
        border-top: 2px solid rgba(139, 92, 246, 0.3);
    }

    .save-close-btn {
        background: #8B5CF6;
        color: white;
        border: none;
        padding: 0.875rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        font-size: 14px;
        width: 100%;
        transition: background 0.2s, transform 0.2s;
    }

    .save-close-btn:hover {
        background: #7C3AED;
        transform: translateY(-1px);
    }
</style>