<script lang="ts">
    import { base } from "$app/paths";
    import { goto } from "$app/navigation";
    import SelectExercisesArea from "$lib/YogaComponents/SelectExercisesArea.svelte";
    import NextPageButton from "$lib/YogaComponents/NextPageButton.svelte";
    import SetTimer from "$lib/YogaComponents/SetTimer.svelte";
    import Popup from "$lib/YogaComponents/Popup.svelte";
    import "./page.css";

    const navigate = (path: string) => goto(path);
</script>

<div class="yoga-container">
    <h1 class="text-bubble">Yoga Exercises</h1>

    <h2>Enable / Disable Exercises</h2>

    <!-- Selecting Exercises -->
    <SelectExercisesArea/>

    <!--Select Duration -->
    <SetTimer/>


    <!-- Page Navigation -->
    <NextPageButton to={`${base}/YogaScreen/running`} label="Start" navigate={navigate}/>

    <!-- Return to Homescreen -->
    <NextPageButton to={`${base}/Homescreen`} label="Exit" navigate={navigate}/>

    <!-- Popup for Current State of Mind -->
    <Popup/>

</div>