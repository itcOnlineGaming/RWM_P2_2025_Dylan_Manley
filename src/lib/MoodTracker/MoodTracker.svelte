<script lang="ts">
  import type { MoodEntry } from './types';
  import { onMount } from 'svelte';

  onMount(() => {
    const saved = localStorage.getItem('moodEntries');
    if (saved) {
      entries = JSON.parse(saved);
    }
  });
  
  // Props with bindable entries
  let {
    entries = $bindable([]),
    onMoodSave = () => {}
  }: {
    entries?: MoodEntry[];
    onMoodSave?: (entry: MoodEntry) => void;
  } = $props();

  // State
  let view = $state<'graph' | 'select' | 'journal' | 'result'>('graph');
  let selectedMood = $state<number | null>(null);
  let sliderValue = $state(50);
  let note = $state('');
  let tags = $state<string[]>([]);
  let currentTag = $state('');
  let hoveredEntry = $state<MoodEntry | null>(null);
  let tooltipPosition = $state({ x: 0, y: 0 });

  const moodData = [
    { emoji: "😩", label: "I'm feeling overwhelmed", title: "Oh No!", message: "Remember to take care of yourself today.", value: 1 },
    { emoji: "😔", label: "Might need a break", title: "You might need a break.", message: "Let's ease things a bit.", value: 2 },
    { emoji: "😐", label: "I'm indifferent", title: "Good to Know!", message: "Keep maintaining that balance.", value: 3 },
    { emoji: "😊", label: "I'm feeling good", title: "Wonderful!", message: "Keep up the positive energy!", value: 4 },
    { emoji: "😄", label: "I'm very confident", title: "That's great!", message: "You're doing amazing!", value: 5 }
  ];

  const suggestedTags = ['work', 'family', 'exercise', 'social', 'health', 'sleep', 'stress', 'relaxation'];

  // Graph functions
  function getTodaysMoods(): MoodEntry[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entries.filter(e => e.timestamp >= today.getTime());
  }

  function getHourFromTimestamp(ts: number): number {
    const d = new Date(ts);
    return d.getHours() + d.getMinutes() / 60;
  }

  function formatTime(ts: number): string {
    const d = new Date(ts);
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  function handleMoodHover(entry: MoodEntry, event: MouseEvent) {
    hoveredEntry = entry;
    const rect = (event.target as SVGElement).getBoundingClientRect();
    tooltipPosition = { x: rect.left + rect.width / 2, y: rect.top };
  }

  function handleMoodLeave() {
    hoveredEntry = null;
  }

  // Selection functions
  function handleMoodClick(value: number) {
    selectedMood = value;
    sliderValue = ((value - 1) / 4) * 100;
  }

  function handleSlider(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    const moodIndex = Math.min(Math.floor((value / 100) * 5), 4);
    selectedMood = moodIndex + 1;
    sliderValue = value;
  }

  function continueToJournal() {
    if (selectedMood !== null) {
      view = 'journal';
    }
  }

  // Journal functions
  function addTag(tag: string) {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      tags = [...tags, trimmedTag];
      currentTag = '';
    }
  }

  function removeTag(tag: string) {
    tags = tags.filter(t => t !== tag);
  }

  function handleTagInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag(currentTag);
    }
  }

  function continueToResult() {
    view = 'result';
  }

  function skipJournal() {
    note = '';
    tags = [];
    view = 'result';
  }

  function saveMood() {
    if (selectedMood !== null) {
      const newEntry: MoodEntry = {
        mood: selectedMood,
        timestamp: Date.now(),
        note: note.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined
      };
      entries = [...entries, newEntry];
      
      // Save to localStorage
      localStorage.setItem('moodEntries', JSON.stringify(entries));
      
      onMoodSave(newEntry);
      
      // Reset state
      selectedMood = null;
      note = '';
      tags = [];
      view = 'graph';
    }
  }

  const todaysMoods = $derived(getTodaysMoods());
  const moodInfo = $derived(selectedMood !== null ? moodData[selectedMood - 1] : null);
</script>

<div class="mood-tracker">
  {#if view === 'graph'}
    <!-- GRAPH VIEW -->
    <div class="mood-card">
      <h2>Today's Mood Tracker</h2>
      <div class="graph-container">
        <div class="graph-wrapper">
          <div class="mood-scale">
            {#each [5, 4, 3, 2, 1] as value}
              <div class="mood-icon">
                <span>{moodData[value - 1].emoji}</span>
              </div>
            {/each}
          </div>

          <svg class="graph-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
            {#each [0, 1, 2, 3, 4] as i}
              <line x1="0" y1={i * 100 + 50} x2="600" y2={i * 100 + 50} 
                    stroke="#E5E7EB" stroke-width="1" stroke-dasharray="8,8" />
            {/each}

            <line x1="0" y1="0" x2="0" y2="400" stroke="#9CA3AF" stroke-width="2" />
            <line x1="0" y1="400" x2="600" y2="400" stroke="#9CA3AF" stroke-width="2" />

            {#if todaysMoods.length > 0}
              {@const sorted = [...todaysMoods].sort((a, b) => a.timestamp - b.timestamp)}
              
              <polyline fill="none" stroke="#A78BFA" stroke-width="6"
                stroke-linecap="round" stroke-linejoin="round"
                points={sorted.map((e) => {
                  const x = (getHourFromTimestamp(e.timestamp) / 24) * 600;
                  const y = 400 - ((e.mood - 1) / 4) * 350 - 25;
                  return `${x},${y}`;
                }).join(" ")} />

              {#each sorted as entry}
                {@const x = (getHourFromTimestamp(entry.timestamp) / 24) * 600}
                {@const y = 400 - ((entry.mood - 1) / 4) * 350 - 25}
                
                <circle cx={x} cy={y} r="8" fill="#A78BFA" stroke="white" stroke-width="3" 
                        style="cursor: pointer;"
                        onmouseenter={(e) => handleMoodHover(entry, e)}
                        onmouseleave={handleMoodLeave} />
                <text x={x} y={y - 15} text-anchor="middle" font-size="12" 
                      font-weight="600" fill="#8b5cf6">
                  {formatTime(entry.timestamp)}
                </text>
              {/each}
            {:else}
              <text x="300" y="200" text-anchor="middle" font-size="18" 
                    font-weight="600" fill="#9CA3AF">
                No moods logged today
              </text>
            {/if}
          </svg>
        </div>

        <div class="time-labels">
          {#each [0, 6, 12, 18, 24] as hour}
            <div class="time-label" style="left: {(hour / 24) * 100}%">
              {hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour > 12 ? `${hour-12}PM` : `${hour}AM`}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <button class="add-mood-btn" onclick={() => view = 'select'}>
      Add Mood Entry
    </button>

    {#if hoveredEntry}
      <div class="mood-tooltip" style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px;">
        <div class="tooltip-content">
          <div class="tooltip-mood">
            <span class="tooltip-emoji">{moodData[hoveredEntry.mood - 1].emoji}</span>
            <span class="tooltip-label">{moodData[hoveredEntry.mood - 1].label}</span>
          </div>
          <div class="tooltip-time">{formatTime(hoveredEntry.timestamp)}</div>
          {#if hoveredEntry.note}
            <div class="tooltip-note">
              <strong>Note:</strong> {hoveredEntry.note}
            </div>
          {/if}
          {#if hoveredEntry.tags && hoveredEntry.tags.length > 0}
            <div class="tooltip-tags">
              {#each hoveredEntry.tags as tag}
                <span class="tooltip-tag">{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}

  {:else if view === 'select'}
    <!-- SELECTION VIEW -->
    <div class="select-container">
      <h1>How are you feeling today?</h1>

      <div class="moods-container">
        {#each moodData as mood}
          <div class="mood-wrapper">
            <button class="mood-btn" class:selected={selectedMood === mood.value}
                    onclick={() => handleMoodClick(mood.value)}>
              <span class="mood-emoji">{mood.emoji}</span>
            </button>

            {#if selectedMood === mood.value}
              <div class="speech-bubble">
                <div class="bubble-content">{mood.label}</div>
                <div class="bubble-arrow"></div>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <div class="slider-container">
        <input type="range" min="0" max="100" value={sliderValue}
               oninput={handleSlider} class="slider" />
      </div>

      <button class="continue-btn" disabled={selectedMood === null}
              onclick={continueToJournal}>
        Continue
      </button>
    </div>

  {:else if view === 'journal'}
    <!-- JOURNAL VIEW -->
    <div class="journal-container">
      <h1>📝 Add a note (optional)</h1>
      
      <div class="journal-card">
        <div class="selected-mood-display">
          <span class="mood-emoji-med">{moodInfo?.emoji}</span>
          <span class="mood-label">{moodInfo?.label}</span>
        </div>

        <div class="note-section">
          <textarea
            bind:value={note}
            placeholder="What's on your mind? What contributed to this mood?"
            maxlength="500"
            rows="6"
          ></textarea>
          <div class="char-count">{note.length}/500</div>
        </div>

        <div class="tags-section">
          <h3>🏷️ Add tags</h3>
          
          <div class="tags-input-container">
            <input
              type="text"
              bind:value={currentTag}
              onkeydown={handleTagInput}
              placeholder="Type a tag and press Enter"
              class="tag-input"
            />
            <button 
              type="button"
              onclick={() => addTag(currentTag)}
              class="add-tag-btn"
              disabled={!currentTag.trim()}
            >
              Add
            </button>
          </div>

          <div class="suggested-tags">
            {#each suggestedTags as tag}
              {#if !tags.includes(tag)}
                <button
                  type="button"
                  class="suggested-tag"
                  onclick={() => addTag(tag)}
                >
                  {tag}
                </button>
              {/if}
            {/each}
          </div>

          {#if tags.length > 0}
            <div class="selected-tags">
              {#each tags as tag}
                <span class="tag">
                  {tag}
                  <button
                    type="button"
                    onclick={() => removeTag(tag)}
                    class="remove-tag"
                    aria-label="Remove tag"
                  >
                    ×
                  </button>
                </span>
              {/each}
            </div>
          {/if}
        </div>

        <div class="journal-buttons">
          <button class="skip-btn" onclick={skipJournal}>
            Skip
          </button>
          <button class="continue-btn" onclick={continueToResult}>
            Continue
          </button>
        </div>
      </div>
    </div>

  {:else if view === 'result'}
    <!-- RESULT VIEW -->
    <div class="result-container">
      {#if moodInfo}
        <div class="mood-display">
          <span class="mood-emoji-large">{moodInfo.emoji}</span>
        </div>
        
        <h1 class="title">{moodInfo.title}</h1>
        <p class="message">{moodInfo.message}</p>

        {#if note || tags.length > 0}
          <div class="summary-card">
            {#if note}
              <div class="summary-note">
                <strong>Note:</strong> {note}
              </div>
            {/if}
            {#if tags.length > 0}
              <div class="summary-tags">
                <strong>Tags:</strong>
                {#each tags as tag}
                  <span class="summary-tag">{tag}</span>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
        
        <button class="save-btn" onclick={saveMood}>
          Save & Continue
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .mood-tracker {
    min-height: 100vh;
    background: linear-gradient(180deg, #6366f1 0%, #818cf8 100%);
    padding: 2rem 1rem;
  }

  /* GRAPH STYLES */
  .mood-card {
    background: white;
    border-radius: 24px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    max-width: 900px;
    margin: 0 auto;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #6366f1;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .graph-container {
    background: #fafafa;
    border-radius: 12px;
    padding: 1rem;
    min-height: 350px;
  }

  .graph-wrapper {
    display: flex;
    gap: 1rem;
    height: 320px;
  }

  .mood-scale {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 60px;
    padding: 0.5rem 0;
  }

  .mood-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    font-size: 2rem;
  }

  .graph-svg {
    flex: 1;
    width: 100%;
    height: 100%;
  }

  .time-labels {
    position: relative;
    margin-top: 1rem;
    margin-left: 76px;
    height: 24px;
  }

  .time-label {
    position: absolute;
    font-size: 0.875rem;
    font-weight: 600;
    color: #8b5cf6;
    transform: translateX(-50%);
  }

  .add-mood-btn {
    display: block;
    width: 100%;
    max-width: 400px;
    margin: 2rem auto 0;
    padding: 1rem 2rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  .add-mood-btn:hover {
    background: #45a049;
  }

  .mood-tooltip {
    position: fixed;
    transform: translate(-50%, calc(-100% - 10px));
    z-index: 1000;
    pointer-events: none;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, calc(-100% - 5px));
    }
    to {
      opacity: 1;
      transform: translate(-50%, calc(-100% - 10px));
    }
  }

  .tooltip-content {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 2px solid #6366f1;
    min-width: 200px;
    max-width: 300px;
  }

  .tooltip-mood {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .tooltip-emoji {
    font-size: 1.5rem;
  }

  .tooltip-label {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }

  .tooltip-time {
    font-size: 0.875rem;
    color: #6366f1;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .tooltip-note {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.4;
    margin-bottom: 0.75rem;
  }

  .tooltip-note strong {
    color: #6366f1;
    display: block;
    margin-bottom: 0.25rem;
  }

  .tooltip-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .tooltip-tag {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    background: #eff6ff;
    color: #6366f1;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  /* SELECTION STYLES */
  .select-container {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }

  h1 {
    color: white;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    margin-bottom: 3rem;
  }

  .moods-container {
    display: flex;
    justify-content: center;
    gap: clamp(0.5rem, 2vw, 1.5rem);
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .mood-wrapper {
    position: relative;
  }

  .mood-btn {
    width: clamp(50px, 10vw, 80px);
    height: clamp(50px, 10vw, 80px);
    border-radius: 50%;
    border: 3px solid transparent;
    background: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mood-btn:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.3);
  }

  .mood-btn.selected {
    border-color: white;
    transform: scale(1.15);
    background: rgba(255, 255, 255, 0.4);
  }

  .mood-emoji {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }

  .speech-bubble {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    z-index: 10;
  }

  .bubble-content {
    background: rgba(50, 50, 250, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bubble-arrow {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(50, 50, 250, 0.9);
  }

  .slider-container {
    margin: 2rem auto;
    max-width: 400px;
  }

  .slider {
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(
      to right,
      #ef4444 0%,
      #f97316 25%,
      #eab308 50%,
      #84cc16 75%,
      #22c55e 100%
    );
    outline: none;
    -webkit-appearance: none;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: white;
    border: 3px solid #6366f1;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: white;
    border: 3px solid #6366f1;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .continue-btn {
    padding: 1rem 3rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 1rem;
  }

  .continue-btn:hover:not(:disabled) {
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .continue-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  /* JOURNAL STYLES */
  .journal-container {
    max-width: 700px;
    margin: 0 auto;
  }

  .journal-card {
    background: white;
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .selected-mood-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 12px;
  }

  .mood-emoji-med {
    font-size: 3rem;
  }

  .mood-label {
    font-size: 1.2rem;
    font-weight: 600;
    color: #374151;
  }

  .note-section {
    margin-bottom: 2rem;
  }

  textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    transition: border-color 0.2s;
  }

  textarea:focus {
    outline: none;
    border-color: #6366f1;
  }

  .char-count {
    text-align: right;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .tags-section h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  .tags-input-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tag-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .tag-input:focus {
    outline: none;
    border-color: #6366f1;
  }

  .add-tag-btn {
    padding: 0.75rem 1.5rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .add-tag-btn:hover:not(:disabled) {
    background: #4f46e5;
  }

  .add-tag-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }

  .suggested-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .suggested-tag {
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .suggested-tag:hover {
    border-color: #6366f1;
    background: #eff6ff;
    color: #6366f1;
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #6366f1;
    color: white;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .remove-tag {
    background: none;
    border: none;
    color: white;
    font-size: 1.3rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .remove-tag:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .journal-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .skip-btn {
    flex: 1;
    padding: 1rem;
    background: #e5e7eb;
    color: #374151;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .skip-btn:hover {
    background: #d1d5db;
  }

  /* RESULT STYLES */
  .result-container {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
  }

  .mood-display {
    margin-bottom: 2rem;
  }

  .mood-emoji-large {
    font-size: clamp(5rem, 15vw, 8rem);
    display: inline-block;
    animation: bounceIn 0.6s ease-out;
  }

  @keyframes bounceIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .title {
    color: rgba(50, 50, 250, 0.9);
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .message {
    color: white;
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 600;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .summary-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: left;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .summary-note {
    color: #374151;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .summary-note strong {
    color: #6366f1;
    display: block;
    margin-bottom: 0.5rem;
  }

  .summary-tags {
    color: #374151;
  }

  .summary-tags strong {
    color: #6366f1;
    display: block;
    margin-bottom: 0.5rem;
  }

  .summary-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #eff6ff;
    color: #6366f1;
    border-radius: 12px;
    font-size: 0.875rem;
    margin-right: 0.5rem;
    margin-top: 0.25rem;
  }

  .save-btn {
    padding: 1rem 3rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .save-btn:hover {
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 640px) {
    .journal-card {
      padding: 1.5rem;
    }

    .mood-emoji-med {
      font-size: 2.5rem;
    }

    .mood-label {
      font-size: 1rem;
    }
  }
</style>