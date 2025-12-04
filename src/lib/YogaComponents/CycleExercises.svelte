<script lang="ts">
    import { exerciseEnabled, timer } from "./store";
    import { createEventDispatcher, onDestroy } from "svelte";

    export let timeRemaining = $timer;
    let currentExercise: string = "";
    const interval = setInterval(updateCurrentExercise, 60000);
    const timeInterval = setInterval(updateTime, 1000);
    const dispatch = createEventDispatcher();

    /*
    Possible Choices:
    Meditate 🧘
    Deep Breaths 😮‍💨
    Cartwheel 🤸
    Loosen Up 🙆
    Downward Dog 🙇⬆️
    Bridge Pose 🌉
    Tree Pose 🧍🌿
    Plank 🧍➖
    Warrior I 🚶‍♂️✋
    Warrior II 🚶‍♂️👈👉
    */

    function updateCurrentExercise() {
        // Random Exercise
        let randI;
        do {
            randI = Math.floor(Math.random() * 10);
        } while ($exerciseEnabled[randI] == false);
        console.log("Ran " + randI);
        switch (randI) {
            case 0: currentExercise="Meditate 🧘"; break;
            case 1: currentExercise="Deep Breaths 😮‍💨"; break;
            case 2: currentExercise="Cartwheel 🤸"; break;
            case 3: currentExercise="Loosen Up 🙆"; break;
            case 4: currentExercise="Downward Dog 🙇⬆️"; break;
            case 5: currentExercise="Bridge Pose 🌉"; break;
            case 6: currentExercise="Tree Pose 🧍🌿"; break;
            case 7: currentExercise="Plank 🧍➖"; break;
            case 8: currentExercise="Warrior I 🚶‍♂️✋"; break;
            case 9: currentExercise="Warrior II 🚶‍♂️👈👉"; break;
        }
    }

    updateCurrentExercise();

    function updateTime() {
        if (timeRemaining > 0) {
            timeRemaining--;
        }
        dispatch("timerUpdate", timeRemaining);
    }

    function formatTime(seconds: number) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    }

    onDestroy(() => {
        clearInterval(interval);
        clearInterval(timeInterval);
        console.log("Timer Stopped");
    });
</script>

<h2>Current Exercise: {currentExercise}</h2>
<h2>Duration: {formatTime(timeRemaining)} of {formatTime($timer)}</h2>