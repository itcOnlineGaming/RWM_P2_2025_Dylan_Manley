<script lang="ts">
  import { goto } from "$app/navigation";

  // Mood data - replace emoji with your image paths
  const moods = [
    { emoji: "😩", label: "I'm feeling overwhelmed", value: 1 },
    { emoji: "😔", label: "Might need a break", value: 2 },
    { emoji: "😐", label: "I'm indifferent", value: 3 },
    { emoji: "😊", label: "I'm feeling good", value: 4 },
    { emoji: "😀", label: "I'm very confident in making progress", value: 5 }
  ];

  let selectedMood = $state<number | null>(null);
  let sliderValue = $state(50);

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

  function continueToResult() {
    if (selectedMood !== null) {
      goto(`/mood-result?mood=${selectedMood}`);
    }
  }
</script>

<div class="container">
  <div class="content">
    <h1>How are you feeling today?</h1>

    <div class="moods-container">
      {#each moods as mood}
        <div class="mood-wrapper">
          <button
            class="mood-btn"
            class:selected={selectedMood === mood.value}
            on:click={() => handleMoodClick(mood.value)}
          >
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
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        on:input={handleSlider}
        class="slider"
      />
    </div>

    <button
      class="continue-btn"
      disabled={selectedMood === null}
      on:click={continueToResult}
    >
      Continue
    </button>
  </div>
</div>

<style>
  .container {
    min-height: 100vh;
    background: linear-gradient(180deg, #6366f1 0%, #818cf8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .content {
    width: 100%;
    max-width: 600px;
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

  @media (max-width: 640px) {
    .bubble-content {
      font-size: 0.75rem;
      max-width: 150px;
    }
  }
</style>