<script lang="ts">
  import { moodEntries, getTodaysMoods } from "$lib/stores/moods";
  import { tasksStore } from "$lib/stores/tasks";
  import { derived } from "svelte/store";

  // Combine both stores into a single derived store
  const journeyData = derived([moodEntries, tasksStore], ([$moods, $tasks]) => {
    // Get today's moods
    const todaysMoods = getTodaysMoods($moods);

    // Calculate average mood (1-5 scale)
    // If no moods logged, default to 1 (bottom) so user starts at the beginning
    const avgMood =
      todaysMoods.length > 0
        ? todaysMoods.reduce((sum, entry) => sum + entry.mood, 0) /
          todaysMoods.length
        : 1; // Default to mood 1 (0%) if no moods

    // Calculate task completion percentage
    const taskProgress =
      $tasks.length > 0
        ? ($tasks.filter((t) => t.completed).length / $tasks.length) * 100
        : 0;

    // Normalize mood to 0-100 scale for easier calculation
    // Mood 1 = 0%, Mood 5 = 100%
    const moodScore = ((avgMood - 1) / 4) * 100;

    return {
      taskProgress,
      avgMood,
      moodScore,
      moodCount: todaysMoods.length,
      taskCount: $tasks.length,
      completedTasks: $tasks.filter((t) => t.completed).length,
    };
  });

  // Generate SVG path points for the journey line
  function generateJourneyPath(
    taskProgress: number,
    moodScore: number,
  ): string {
    // Start point (bottom left)
    const startX = 20;
    const startY = 180;

    // End X position based on task progress (20 to 570)
    const endX = 20 + (taskProgress / 100) * 550;

    // End Y position based on mood score
    // High mood = low Y (top), Low mood = high Y (bottom)
    // Range: 180 (bottom) to 40 (top)
    const endY = 180 - (moodScore / 100) * 140;

    // If we're still at the start (0 progress), just draw a point at the start
    if (taskProgress === 0 && moodScore === 0) {
      return `M ${startX} ${startY} L ${startX} ${startY}`;
    }

    // Create a smooth curved path with control points
    const midX1 = startX + (endX - startX) * 0.33;
    const midY1 = startY - (startY - endY) * 0.2;

    const midX2 = startX + (endX - startX) * 0.66;
    const midY2 = startY - (startY - endY) * 0.7;

    // SVG path with cubic bezier curve
    return `M ${startX} ${startY} C ${midX1} ${midY1}, ${midX2} ${midY2}, ${endX} ${endY}`;
  }

  // Determine the color gradient based on combined score
  function getJourneyColor(taskProgress: number, moodScore: number): string {
    const combined = (taskProgress + moodScore) / 2;

    if (combined >= 70) return "#10b981"; // Green - Excellent
    if (combined >= 50) return "#3b82f6"; // Blue - Good
    if (combined >= 30) return "#f59e0b"; // Orange - Fair
    return "#ef4444"; // Red - Needs attention
  }

  // Get encouragement message based on progress
  function getEncouragementMessage(
    taskProgress: number,
    moodScore: number,
  ): string {
    const combined = (taskProgress + moodScore) / 2;

    if (combined >= 80) return "Amazing progress!";
    if (combined >= 60) return "Great momentum!";
    if (combined >= 40) return "Keep going!";
    if (combined >= 20) return "Small steps count!";
    return "New day, fresh start!";
  }
</script>

<section class="journey-card">
  <div class="journey-header">
    <h2 class="journey-title">Your Progress Journey</h2>
  </div>

  <div class="journey-container">
    <svg viewBox="0 0 600 200" class="journey-svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#e0e7ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f0f9ff;stop-opacity:1" />
        </linearGradient>

        <!-- Glow filter for the path -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="600" height="200" fill="url(#bgGradient)" rx="12" />

      <!-- Horizontal reference lines -->
      <line
        x1="20"
        y1="180"
        x2="580"
        y2="180"
        stroke="#cbd5e1"
        stroke-width="2"
        stroke-dasharray="5,5"
      />
      <line
        x1="20"
        y1="110"
        x2="580"
        y2="110"
        stroke="#cbd5e1"
        stroke-width="1"
        stroke-dasharray="5,5"
        opacity="0.5"
      />
      <line
        x1="20"
        y1="40"
        x2="580"
        y2="40"
        stroke="#cbd5e1"
        stroke-width="2"
        stroke-dasharray="5,5"
      />

      <!-- Journey path -->
      <path
        d={generateJourneyPath(
          $journeyData.taskProgress,
          $journeyData.moodScore,
        )}
        fill="none"
        stroke={getJourneyColor(
          $journeyData.taskProgress,
          $journeyData.moodScore,
        )}
        stroke-width="8"
        stroke-linecap="round"
        filter="url(#glow)"
      />

      <!-- Start point (You started here) -->
      <circle
        cx="20"
        cy="180"
        r="10"
        fill="#94a3b8"
        stroke="white"
        stroke-width="3"
      />
      <text
        x="20"
        y="198"
        text-anchor="middle"
        font-size="11"
        font-weight="600"
        fill="#64748b"
      >
        Start
      </text>

      <!-- Goal/Flag at the end -->
      <g transform="translate(570, 35)">
        <!-- Flag pole -->
        <line x1="0" y1="0" x2="0" y2="25" stroke="#dc2626" stroke-width="2" />
        <!-- Flag -->
        <path d="M 0 0 L 15 5 L 0 10 Z" fill="#dc2626" />
      </g>
      <text
        x="570"
        y="65"
        text-anchor="middle"
        font-size="11"
        font-weight="600"
        fill="#dc2626"
      >
        Goal
      </text>

      <!-- Current position (You are here) - MOVED TO END FOR Z-INDEX -->
      {#if true}
        {@const currentX = 20 + ($journeyData.taskProgress / 100) * 550}
        {@const currentY = 180 - ($journeyData.moodScore / 100) * 140}

        <!-- Pulsing animation circle -->
        <circle
          cx={currentX}
          cy={currentY}
          r="12"
          fill={getJourneyColor(
            $journeyData.taskProgress,
            $journeyData.moodScore,
          )}
          opacity="0.3"
        >
          <animate
            attributeName="r"
            values="12;18;12"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx={currentX}
          cy={currentY}
          r="8"
          fill={getJourneyColor(
            $journeyData.taskProgress,
            $journeyData.moodScore,
          )}
          stroke="white"
          stroke-width="3"
        />

        <!-- "You are here" label with background for visibility -->
        <g>
          <!-- Background rectangle -->
          <rect
            x={currentX - 45}
            y={currentY - 35}
            width="90"
            height="20"
            rx="4"
            fill="white"
            opacity="0.95"
            stroke={getJourneyColor(
              $journeyData.taskProgress,
              $journeyData.moodScore,
            )}
            stroke-width="1.5"
          />
          <!-- Text -->
          <text
            x={currentX}
            y={currentY - 20}
            text-anchor="middle"
            font-size="12"
            font-weight="700"
            fill={getJourneyColor(
              $journeyData.taskProgress,
              $journeyData.moodScore,
            )}
          >
            You Are Here
          </text>
        </g>
      {/if}
    </svg>
  </div>

  <!-- Encouragement Message -->
  <div
    class="encouragement"
    style="color: 3924fb
    )}"
  >
    {getEncouragementMessage($journeyData.taskProgress, $journeyData.moodScore)}
  </div>
</section>

<style>
  .journey-card {
    background: white;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    max-width: 750px;
    margin: 0 auto 2rem auto;
  }

  .journey-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .journey-title {
    font-size: 22px;
    font-weight: 700;
    color: #000000;
    margin: 0 0 4px 0;
  }

  .journey-container {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .journey-svg {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }

  .encouragement {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    padding: 12px;
    background: linear-gradient(135deg, #DFD7FF 0%, #BDAAFF 100%);
    border-radius: 12px;
    border: 2px solid #3924fb;
  }

  @media (max-width: 640px) {
    .journey-title {
      font-size: 18px;
    }
  }
</style>
