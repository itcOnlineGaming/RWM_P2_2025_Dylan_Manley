<script lang="ts">
  import { moodEntries, getTodaysMoods } from "$lib/stores/moods";
  import type { MoodEntry } from "$lib/stores/moods";
  import { derived } from "svelte/store";
  import red from "$lib/assets/RedMood.png";
  import orange from "$lib/assets/OrangeMood.png";
  import yellow from "$lib/assets/YellowMood.png";
  import lime from "$lib/assets/LimeMood.png";
  import green from "$lib/assets/GreenMood.png";

  const moodColors = [red, orange, yellow, lime, green];

  export let onEditClick: () => void = () => {};

  // Get only today's moods
  const todaysMoods = derived(moodEntries, ($entries) => {
    return getTodaysMoods($entries);
  });

  // Convert timestamp to hour of day (0-24)
  function getHourFromTimestamp(timestamp: number): number {
    const date = new Date(timestamp);
    return date.getHours() + date.getMinutes() / 60;
  }

  // Generate smooth SVG path using cubic Bezier curves
  function generateSmoothPath(moods: MoodEntry[]): string {
    if (moods.length === 0) return '';
    if (moods.length === 1) {
      const hour = getHourFromTimestamp(moods[0].timestamp);
      const x = (hour / 24) * 600;
      const y = 400 - ((moods[0].mood - 1) / 4) * 350 - 25;
      return `M ${x} ${y}`;
    }

    const sortedMoods = [...moods].sort((a, b) => a.timestamp - b.timestamp);
    const points = sortedMoods.map((entry) => {
      const hour = getHourFromTimestamp(entry.timestamp);
      const x = (hour / 24) * 600;
      const y = 400 - ((entry.mood - 1) / 4) * 350 - 25;
      return { x, y };
    });

    // Start path at first point
    let path = `M ${points[0].x} ${points[0].y}`;

    // Create smooth curves between points
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Calculate control points for smooth curve
      const xDiff = next.x - current.x;
      const yDiff = next.y - current.y;
      
      // Control point distance (adjust for smoothness)
      const smoothness = 0.3;
      
      const cp1x = current.x + xDiff * smoothness;
      const cp1y = current.y;
      
      const cp2x = next.x - xDiff * smoothness;
      const cp2y = next.y;
      
      // Add cubic Bezier curve
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return path;
  }
</script>

<section class="mood-graph-card">
  <div class="mood-header">
    <h2 class="mood-title">Today's Mood Tracker</h2>
  </div>

  <div class="graph-container">
    <div class="graph-main"> 
      <div class="mood-scale-left">
        {#each [5, 4, 3, 2, 1] as value}
          <div class="mood-emoji">
            <img src={moodColors[value - 1]} alt="Mood {value}" />
          </div>
        {/each}
      </div>

      <svg class="mood-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
        <!-- Dashed grid -->
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
          
          <!-- Gradient for the line -->
          <defs>
            <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#A78BFA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#C4B5FD;stop-opacity:1" />
            </linearGradient>
            
            <!-- Glow effect -->
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Smooth mood line -->
          <path
            d={generateSmoothPath(sortedMoods)}
            fill="none"
            stroke="url(#moodGradient)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
            filter="url(#glow)"
            class="mood-line"
          />

          <!-- Data points with time labels -->
          {#each sortedMoods as entry, index}
            {@const hour = getHourFromTimestamp(entry.timestamp)}
            {@const x = (hour / 24) * 600}
            {@const y = 400 - ((entry.mood - 1) / 4) * 350 - 25}
            
            <g>
              <!-- Larger background circle for better visibility -->
              <circle
                cx={x}
                cy={y}
                r="10"
                fill="white"
                opacity="0.9"
              />
              
              <!-- Point -->
              <circle
                cx={x}
                cy={y}
                r="7"
                fill="#A78BFA"
                stroke="white"
                stroke-width="2"
                class="mood-point"
              />
              
              
            </g>
          {/each}
        {:else}
          <!-- Message when no moods logged yet -->
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

    <!-- 24-hour time labels at bottom -->
    <div class="time-labels-bottom">
      {#each [0, 6, 12, 18, 24] as hour}
        <div class="time-label" style="left: {(hour / 24) * 100}%">
          {hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour > 12 ? `${hour-12}PM` : `${hour}AM`}
        </div>
      {/each}
    </div>
  </div>

  <button on:click={onEditClick} class="edit-btn">ADD MOOD</button>
</section>

<style>
  .mood-graph-card {
    background: white;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    max-width: 750px;
    margin: 0 auto 2rem auto;
  }

  .mood-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .mood-title {
    font-size: 22px;
    font-weight: 700;
    color: #000000;
  }

  .edit-btn {
    background: #0ea5e9;
    color: white;
    font-size: 16px;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 12px;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }

  .edit-btn:hover {
    background: #38bdf8;
  }

  .graph-container {
    position: relative;
    min-height: 320px;
    background: #fafafa;
    border-radius: 12px;
    padding: 8px;
  }

  .mood-svg {
    flex: 1;
    width: 100%;
    height: 100%;
  }

  .mood-scale-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 60px;
    height: 100%;
    padding: 8px 0;
  }

  .mood-emoji {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
  }

  .mood-emoji img {
    width: 44px;
    height: 44px;
    object-fit: contain;
  }

  .graph-main {
    display: flex;
    gap: 12px;
    height: 320px;
  }

  .time-labels-bottom {
    position: relative;
    margin-top: 12px;
    height: 24px;
    width: 85%;
  }

  .time-label {
    position: absolute;
    margin-left: 11%;
    font-size: 13px;
    font-weight: 600;
    color: #8b5cf6;
    white-space: nowrap;
    transform: translateX(-50%);
  }

  /* Animations */
  .mood-line {
    animation: drawLine 1s ease-out;
  }

  @keyframes drawLine {
    from {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
    }
    to {
      stroke-dasharray: 1000;
      stroke-dashoffset: 0;
    }
  }

  .mood-point {
    transition: r 0.2s, fill 0.2s;
    cursor: pointer;
  }

  .mood-point:hover {
    r: 9;
    fill: #8b5cf6;
  }

  .time-label {
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -5px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
</style>