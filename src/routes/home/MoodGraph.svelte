<script lang="ts">
  import { moodEntries, getTodaysMoods } from "$lib/stores/moods";
  import { derived } from "svelte/store";

  const moodEmojis = [
    "😩", // Mood 1 - Very Bad
    "😔", // Mood 2 - Bad
    "😐", // Mood 3 - Neutral
    "😊", // Mood 4 - Good
    "😀"  // Mood 5 - Very Good
  ];

  const todaysMoods = derived(moodEntries, ($entries) => {
    return getTodaysMoods($entries);
  });

  function getHourFromTimestamp(timestamp: number): number {
    const date = new Date(timestamp);
    return date.getHours() + date.getMinutes() / 60;
  }

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }
</script>

<section class="mood-card">
  <div class="header">
    <h2>Today's Mood Tracker</h2>
  </div>

  <div class="graph-container">
    <div class="graph-wrapper">
      <!-- Y-axis mood scale -->
      <div class="mood-scale">
        {#each [5, 4, 3, 2, 1] as value}
          <div class="mood-icon">
            <span>{moodEmojis[value - 1]}</span>
          </div>
        {/each}
      </div>

      <!-- Graph SVG -->
      <svg class="graph-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
        <!-- Grid lines -->
        {#each [0, 1, 2, 3, 4] as i}
          <line 
            x1="0" 
            y1={i * 100 + 50} 
            x2="600" 
            y2={i * 100 + 50} 
            stroke="#E5E7EB" 
            stroke-width="1" 
            stroke-dasharray="8,8"
          />
        {/each}

        <!-- Axes -->
        <line x1="0" y1="0" x2="0" y2="400" stroke="#9CA3AF" stroke-width="2" />
        <line x1="0" y1="400" x2="600" y2="400" stroke="#9CA3AF" stroke-width="2" />

        {#if $todaysMoods.length > 0}
          {@const sortedMoods = [...$todaysMoods].sort((a, b) => a.timestamp - b.timestamp)}
          
          <!-- Mood line -->
          <polyline
            fill="none"
            stroke="#A78BFA"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
            points={sortedMoods
              .map((entry) => {
                const hour = getHourFromTimestamp(entry.timestamp);
                const x = (hour / 24) * 600;
                const y = 400 - ((entry.mood - 1) / 4) * 350 - 25;
                return `${x},${y}`;
              })
              .join(" ")
            }
          />

          <!-- Data points -->
          {#each sortedMoods as entry}
            {@const hour = getHourFromTimestamp(entry.timestamp)}
            {@const x = (hour / 24) * 600}
            {@const y = 400 - ((entry.mood - 1) / 4) * 350 - 25}
            
            <g>
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="#A78BFA"
                stroke="white"
                stroke-width="3"
              />
              
              <text
                x={x}
                y={y - 15}
                text-anchor="middle"
                font-size="12"
                font-weight="600"
                fill="#8b5cf6"
              >
                {formatTime(entry.timestamp)}
              </text>
            </g>
          {/each}
        {:else}
          <text
            x="300"
            y="200"
            text-anchor="middle"
            font-size="18"
            font-weight="600"
            fill="#9CA3AF"
          >
            No moods logged today
          </text>
        {/if}
      </svg>
    </div>

    <!-- Time labels -->
    <div class="time-labels">
      {#each [0, 6, 12, 18, 24] as hour}
        <div class="time-label" style="left: {(hour / 24) * 100}%">
          {hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour > 12 ? `${hour-12}PM` : `${hour}AM`}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .mood-card {
    background: white;
    border-radius: 24px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .header {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #6366f1;
    text-align: center;
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

  @media (max-width: 640px) {
    .mood-card {
      padding: 1rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    .mood-icon {
      font-size: 1.5rem;
    }
  }
</style>