<script lang="ts">
  import { goto } from "$app/navigation";
  import MoodGraph from "./MoodGraph.svelte";

  function navigateToAddMood() {
    goto("/add-mood");
  }
</script>

<div class="container">
  <header>
    <h1>Mood Tracker</h1>
  </header>

  <main>
    <MoodGraph />
    
    <button class="add-mood-btn" on:click={navigateToAddMood}>
      Add Mood Entry
    </button>
  </main>
</div>

<style>
  .container {
    min-height: 100vh;
    background: linear-gradient(180deg, #6366f1 0%, #818cf8 100%);
    padding-bottom: 2rem;
  }

  header {
    text-align: center;
    padding: 2rem 1rem;
    color: white;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
  }

  main {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .add-mood-btn {
    display: block;
    width: 100%;
    max-width: 400px;
    margin: 2rem auto 0;
    padding: 1rem 2rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  .add-mood-btn:hover {
    background: #45a049;
  }
</style>