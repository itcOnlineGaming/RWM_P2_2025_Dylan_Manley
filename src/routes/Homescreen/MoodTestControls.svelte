<script lang="ts">
  import { moodEntries } from "$lib/stores/moods";

  function addFakeMoods() {
    const today = new Date();
    
    const fakeMoods = [
      { mood: 3, timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30).getTime() },
      { mood: 4, timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 15).getTime() },
      { mood: 5, timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0).getTime() },
      { mood: 4, timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30).getTime() },
      { mood: 3, timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 45).getTime() },
      { mood: 2, timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 20).getTime() },
      { mood: 3, timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0).getTime() },
      { mood: 4, timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 30).getTime() },
    ];

    moodEntries.update(entries => [...entries, ...fakeMoods]);
    alert('Added 8 fake mood entries throughout the day!');
  }

  function clearAllMoods() {
    if (confirm('Are you sure you want to clear all mood entries?')) {
      moodEntries.set([]);
      alert('All mood entries cleared!');
    }
  }

  function addRandomMoodPattern() {
    const today = new Date();
    const patterns = {
      'Great Day': [
        { hour: 7, minute: 0, mood: 3 },
        { hour: 9, minute: 30, mood: 4 },
        { hour: 12, minute: 0, mood: 5 },
        { hour: 15, minute: 0, mood: 5 },
        { hour: 18, minute: 0, mood: 4 },
        { hour: 21, minute: 0, mood: 5 },
      ],
      'Rough Day': [
        { hour: 7, minute: 0, mood: 2 },
        { hour: 10, minute: 0, mood: 1 },
        { hour: 13, minute: 0, mood: 2 },
        { hour: 16, minute: 0, mood: 3 },
        { hour: 19, minute: 0, mood: 3 },
        { hour: 22, minute: 0, mood: 4 },
      ],
      'Rollercoaster': [
        { hour: 8, minute: 0, mood: 4 },
        { hour: 9, minute: 30, mood: 2 },
        { hour: 11, minute: 0, mood: 5 },
        { hour: 13, minute: 30, mood: 1 },
        { hour: 15, minute: 0, mood: 4 },
        { hour: 17, minute: 0, mood: 2 },
        { hour: 19, minute: 30, mood: 5 },
        { hour: 21, minute: 0, mood: 3 },
      ],
      'Steady Improvement': [
        { hour: 8, minute: 0, mood: 2 },
        { hour: 10, minute: 0, mood: 2 },
        { hour: 12, minute: 0, mood: 3 },
        { hour: 14, minute: 0, mood: 3 },
        { hour: 16, minute: 0, mood: 4 },
        { hour: 18, minute: 30, mood: 4 },
        { hour: 20, minute: 0, mood: 5 },
      ],
    };

    const patternName = prompt('Choose a pattern:\n- Great Day\n- Rough Day\n- Rollercoaster\n- Steady Improvement', 'Great Day');
    
    if (patternName && patterns[patternName as keyof typeof patterns]) {
      const pattern = patterns[patternName as keyof typeof patterns];
      const fakeMoods = pattern.map(entry => ({
        mood: entry.mood,
        timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), entry.hour, entry.minute).getTime()
      }));

      moodEntries.update(entries => [...entries, ...fakeMoods]);
      alert(`Added "${patternName}" mood pattern!`);
    }
  }
</script>

<div class="test-controls">
  <h3>Test Controls (Remove in Production)</h3>
  <div class="button-group">
    <button on:click={addFakeMoods} class="test-btn add-btn">
      ➕ Add Sample Moods
    </button>
    <button on:click={addRandomMoodPattern} class="test-btn pattern-btn">
      🎭 Add Mood Pattern
    </button>
    <button on:click={clearAllMoods} class="test-btn clear-btn">
      🗑️ Clear All Moods
    </button>
  </div>
</div>

<style>
  .test-controls {
    background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
    border: 2px dashed #f97316;
    border-radius: 12px;
    padding: 16px;
    margin: 16px auto;
    max-width: 750px;
  }

  h3 {
    margin: 0 0 12px 0;
    color: #ea580c;
    font-size: 16px;
    font-weight: 700;
  }

  .button-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .test-btn {
    flex: 1;
    min-width: 150px;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .test-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .test-btn:active {
    transform: translateY(0);
  }

  .add-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .pattern-btn {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
  }

  .clear-btn {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }

  @media (max-width: 640px) {
    .button-group {
      flex-direction: column;
    }

    .test-btn {
      width: 100%;
    }
  }
</style>