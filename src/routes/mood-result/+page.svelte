<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { moodEntries } from "$lib/stores/moods";
  import { onMount } from "svelte";

  const moodData = [
    { 
      emoji: "😩",
      title: "Oh No!",
      message: "Remember to take care of yourself today."
    },
    { 
      emoji: "😔",
      title: "You might need a break.",
      message: "Let's ease things a bit."
    },
    { 
      emoji: "😐",
      title: "Good to Know!",
      message: "Keep maintaining that balance."
    },
    { 
      emoji: "😊",
      title: "Wonderful!",
      message: "Keep up the positive energy!"
    },
    { 
      emoji: "😀",
      title: "That's great to hear!",
      message: "You're doing amazing!"
    }
  ];

  let selectedMood = $state<number | null>(null);
  let moodInfo = $derived(
    selectedMood !== null ? moodData[selectedMood - 1] : null
  );

  onMount(() => {
    const moodParam = $page.url.searchParams.get("mood");
    const moodValue = Number(moodParam);
    
    if (!isNaN(moodValue) && moodValue >= 1 && moodValue <= 5) {
      selectedMood = moodValue;
    } else {
      goto("/add-mood");
    }
  });

  function saveMood() {
    if (selectedMood !== null) {
      moodEntries.update((entries) => [
        ...entries,
        {
          mood: selectedMood,
          timestamp: Date.now()
        }
      ]);
      goto("/home");
    }
  }
</script>

<div class="container">
  {#if moodInfo}
    <div class="content">
      <div class="mood-display">
        <span class="mood-emoji">{moodInfo.emoji}</span>
      </div>
      
      <h1 class="title">{moodInfo.title}</h1>
      <p class="message">{moodInfo.message}</p>
      
      <button class="save-btn" on:click={saveMood}>
        Save & Continue
      </button>
    </div>
  {:else}
    <p>Loading...</p>
  {/if}
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
    text-align: center;
    max-width: 500px;
  }

  .mood-display {
    margin-bottom: 2rem;
  }

  .mood-emoji {
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
    margin-bottom: 3rem;
    line-height: 1.5;
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
</style>