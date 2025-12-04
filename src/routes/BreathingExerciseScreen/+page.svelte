<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { tasksBreathingStore } from '$lib/stores/tasks.js';
    import { get } from 'svelte/store';
    import { onDestroy } from 'svelte';
    import { onMount } from 'svelte';

    let timer = 0;
    let b_isTriggered = false;
    let b_isTimerRunning = false;
    let interval: ReturnType<typeof setInterval>;

    const unsubscribe = tasksBreathingStore.subscribe(value => {
        if (!b_isTimerRunning) 
        {
            timer = value.timer_number * 60;
            b_isTriggered = value.b_isTriggered;

            startTimer();
        }
        // Test if it's actually getting passed 
         console.log("Breathing store loaded:", value);
    });

    $: minutes = Math.floor(timer / 60);
    $: seconds = timer % 60;

    function startTimer() 
    {
        if (b_isTimerRunning || timer <= 0) return;

        b_isTimerRunning = true;
        interval = setInterval(() => {
            if (timer > 0) {
                timer -= 1;
            } else 
            {
                clearInterval(interval);
                b_isTimerRunning = false;
                console.log("Timer finished!");
                // Toggle a bool in the Task.JS for exercise completion
                NavigateToHomescreen();
            }
        }, 1000);
    }

    function pauseTimer() 
    {
        if (interval) 
        {
            clearInterval(interval);
            b_isTimerRunning = false;
        }
    }

    function resetTimer() 
    {
        pauseTimer();
        const value = get(tasksBreathingStore);
        timer = value.timer_number * 60;
    }

    function NavigateToHomescreen() 
    {
        goto(`${base}/Homescreen`, { noScroll: false });
    }

    onDestroy(() => {
        unsubscribe();
        if (interval) clearInterval(interval);
    });
</script>

<div class="container">

    <h1 class="title-breathing">Breathing Exercise Screen</h1>

    <!-- Timer Display -->
    <div class="timer-display">
        {minutes.toString().padStart(2,'0')}:{seconds.toString().padStart(2,'0')}
    </div>

    <!-- Breathing Animation -->
    <div class="breathing-circle-container">
        <div class="static-circle"></div>
        <div class="dynamic-circle"></div>
    </div>

    <p class="instruction-text">Match your breathing to the rhythm</p>

    <!-- Timer Controls -->
    <div class="timer-buttons">
        <button on:click={startTimer} disabled={b_isTimerRunning}>Start</button>
        <button on:click={pauseTimer} disabled={!b_isTimerRunning}>Pause</button>
        <button on:click={resetTimer}>Reset</button>
    </div>

    <!-- Exit Button -->
    <button class="exit-btn" on:click={NavigateToHomescreen}>Go Back to Home</button>

</div>

<style>
    .timer-display 
    {
        font-size: 3rem;
        font-weight: 700;
        text-align: center;
        margin: 2rem 0;
    }

    .breathing-circle-container 
    {
        position: relative;
        width: 250px;
        height: 250px;
        margin: 2rem auto;
    }

    .static-circle
     {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #5cb8f6;
        z-index: 2;
    }

    .dynamic-circle 
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.4);
        z-index: 1;
        animation: inhaleExhale 4s ease-in-out infinite;
    }

    @keyframes inhaleExhale 
    {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(2); }
    }

    .timer-buttons 
    {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .timer-buttons button 
    {
        padding: 0.75rem 1.5rem;
        font-size: 2rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: 600;
        transition: 0.2s ease;
    }

    .timer-buttons button:hover:not(:disabled) 
    {
        background-color: #bded3a;
        color: rgb(0, 0, 0);
    }

    .timer-buttons button:disabled 
    {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .exit-btn 
    {
        width: 100%;
        max-width: 300px;
        padding: 1rem 0;
        font-size: 1.2rem;
        font-weight: 700;
        border-radius: 8px;
        border: none;
        background-color: #FCA5A5;
        color: white;
        cursor: pointer;
        display: block;
        margin: 0 auto;
        margin-top: 1rem;
    }

    
    .instruction-text 
    {
        text-align: center;
        font-size: 2rem;
        color: black;
        margin-top: 9.0rem;
        margin-bottom: 8.0rem;
    }

    .exit-btn:hover 
    {
        opacity: 0.8;
    }
</style>
