export interface MoodEntry {
  mood: number; // 1-5
  timestamp: number;
}

export interface MoodTrackerProps {
  entries?: MoodEntry[];
  onMoodSave?: (entry: MoodEntry) => void;
}