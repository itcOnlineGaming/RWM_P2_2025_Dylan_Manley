
export interface MoodEntry {
  mood: number; // 1-5
  timestamp: number;
  note?: string; // Journal note
  tags?: string[]; // Category tags
}

export interface MoodTrackerProps {
  entries?: MoodEntry[];
  onMoodSave?: (entry: MoodEntry) =>
  }