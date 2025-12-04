// store.ts
import { writable, type Writable } from 'svelte/store';
export const exerciseEnabled = writable<boolean[]>(Array(10).fill(true));
export const timer: Writable<number> = writable(600);
export const timeRemaining: Writable<number> = writable(0);
export const completedTime: Writable<number> = writable(0);
export const pastFeelingReported: Writable<number> = writable(-1);
export const currentFeelingReported: Writable<number> = writable(-1);
export const statusMessage: Writable<string> = writable("Not Recorded Yet");