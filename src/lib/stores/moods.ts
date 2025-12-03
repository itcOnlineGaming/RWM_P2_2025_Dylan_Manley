import { writable } from 'svelte/store';

export interface MoodEntry {
  mood: number; // 1-5
  timestamp: number;
}

// Initialize from localStorage if available
function createMoodStore() {
  const stored = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('moodEntries') 
    : null;
  
  const initial: MoodEntry[] = stored ? JSON.parse(stored) : [];
  
  const { subscribe, set, update } = writable<MoodEntry[]>(initial);
  
  return {
    subscribe,
    set: (value: MoodEntry[]) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('moodEntries', JSON.stringify(value));
      }
      set(value);
    },
    update: (fn: (entries: MoodEntry[]) => MoodEntry[]) => {
      update((entries) => {
        const newEntries = fn(entries);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('moodEntries', JSON.stringify(newEntries));
        }
        return newEntries;
      });
    }
  };
}

export const moodEntries = createMoodStore();

export function getTodaysMoods(entries: MoodEntry[]): MoodEntry[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  return entries.filter(entry => entry.timestamp >= todayTimestamp);
}
