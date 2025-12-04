<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
    import { tasksBreathingStore } from '$lib/stores/tasks.js';

    let number_input = 0;
    let b_isTriggerSet = false;
    let selectedTime: number | null = null;

    function setBreathingTime(minutes: number) 
    {
        number_input = minutes;
        b_isTriggerSet = true;
        selectedTime = minutes;

        tasksBreathingStore.set({
            timer_number: minutes,
            b_isTriggered: true
        });

        console.log(`Selected ${minutes} minutes`);
    }

    const OnClickAdd2Minutes = () => setBreathingTime(2);
    const OnClickAdd3Minutes = () => setBreathingTime(3);
    const OnClickAdd5Minutes = () => setBreathingTime(5);

    function OnClickNavigateToBreathExerciseScreen() 
    {
        if (b_isTriggerSet) 
        {
            goto(`${base}/BreathingExerciseScreen`, { noScroll: false });
        } else 
        {
            console.log("Please select a timer first");
        }
    }

</script>

<div class="container">

    <h1 class="title">Breathing Selection Screen</h1>

    <section class="breathing-screen-section">

<button 
    class="breathing-timer-btn"
    class:selected={selectedTime === 3}
    on:click={OnClickAdd3Minutes}>
    3 Minute Exercise (recommended)
</button>

<button 
    class="breathing-timer-btn"
    class:selected={selectedTime === 2}
    on:click={OnClickAdd2Minutes}>
    2 Minute Exercise
</button>

<button 
    class="breathing-timer-btn"
    class:selected={selectedTime === 5}
    on:click={OnClickAdd5Minutes}>
    5 Minute Exercise
</button>

    </section>

    <section class="breathing-screen-section">
        <button 
            class="breathing-start-btn" 
            on:click={OnClickNavigateToBreathExerciseScreen}>
            START EXERCISE 😮‍💨
        </button>
    </section>

    <p class="instruction-text">Please select the duration to start</p>

</div>

<style>
/* Breathing */


.breathing-screen-section 
{
    margin-top: 20px;
    padding: 20px;
    background: #f3f0ff; /* match other section bg */
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; /* space between buttons */
}

/* Timer Buttons */
.breathing-timer-btn 
{
    background: #BFDBFE;
    border: none;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    width: 100%;
    max-width: 300px;
    transition: 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

/* Hover Effect */
.breathing-timer-btn:hover 
{
    background-color: #7c3aed;
    color: white;
}

/* Selected / Highlighted Timer Button */
.breathing-timer-btn.selected 
{
    background-color: #7c3aed;
    color: white;
    transform: scale(1.03);
    box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
}

.instruction-text 
{
    text-align: center;
    font-size: 1.6rem;
    color: #220c0c;
    margin-top: 1.5rem;
}

/* Start Exercise Button */
.breathing-start-btn 
{
    background-color: #8B5CF6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-weight: 700;
    font-size: 1.1rem;
    border-radius: 8px;
    width: 100%;
    max-width: 300px;
    cursor: pointer;
    transition: 0.2s ease;
}

.breathing-start-btn:hover 
{
    background-color: #7c3aed;
}


</style>
