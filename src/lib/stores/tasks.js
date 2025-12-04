import { writable } from 'svelte/store';

// Initialize with default tasks
const defaultTasks = [
    { id: 1, text: 'Finish Concepts', completed: false },
    { id: 2, text: 'Finish Concepts', completed: false },
    { id: 3, text: 'Finish Concepts', completed: false }
];

export const tasksStore = writable(defaultTasks);

// Breathing Storage
export const tasksBreathingStore = writable({
    timer_number: 0,
    b_isTriggered: false
});

// Form submitted -> Rating (number), Feedback (text)
export const tasksSubmissionStore = writable({
    rating_number: 0,
    feedback_text: " "
});
