import { writable } from 'svelte/store';

export interface MoodEntry {
  mood: number;      // 1-5
  timestamp: number; // Unix timestamp in milliseconds
}

// Initialize from localStorage if available
const storedMoods = typeof window !== 'undefined' 
  ? localStorage.getItem('moodEntries') 
  : null;

const initialMoods: MoodEntry[] = storedMoods 
  ? JSON.parse(storedMoods) 
  : [];

export const moodEntries = writable<MoodEntry[]>(initialMoods);

// Subscribe to save to localStorage whenever it changes
if (typeof window !== 'undefined') {
  moodEntries.subscribe(value => {
    localStorage.setItem('moodEntries', JSON.stringify(value));
  });
}

// Helper function to get today's moods
export function getTodaysMoods(entries: MoodEntry[]): MoodEntry[] {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
  
  return entries.filter(entry => 
    entry.timestamp >= startOfDay && entry.timestamp <= endOfDay
  );
}