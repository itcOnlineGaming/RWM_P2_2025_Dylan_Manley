<script lang="ts">
    import { base } from "$app/paths";
    import { get } from 'svelte/store';
    import { goto } from "$app/navigation";
    import NextPageButton from "$lib/YogaComponents/NextPageButton.svelte";
    import Popup from "$lib/YogaComponents/Popup.svelte";
    import "../page.css";
    import { pastFeelingReported, completedTime, statusMessage } from "$lib/YogaComponents/store";

    const navigateMainMenu = (path: string) => goto(path);
    const navigateRunning = (path: string) => goto(path);
</script>

<div class="yoga-container">
    <h1 class="text-bubble">Yoga Exercise Results</h1>

    <h2>Duration Completed: {$completedTime.toFixed(2)}%</h2>    

    <h2>Current Feeling Status: {$statusMessage}</h2>

    <!-- Retake Current Feeling Form -->
    <Popup/>

    <!-- Navigation Buttons -->
    <NextPageButton to={`${base}/YogaScreen/running`} label="Try Again" navigate={navigateMainMenu}/>
    <NextPageButton to={`${base}/YogaScreen`} label="Return to Exercise Selection" navigate={navigateRunning}/>
</div>