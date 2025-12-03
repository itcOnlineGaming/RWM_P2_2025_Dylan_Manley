<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(() => {
    goto("/home");
  });
</script>

<div class="loading">
  <p>Loading...</p>
</div>

<style>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(180deg, #6366f1 0%, #818cf8 100%);
    color: white;
    font-size: 1.5rem;
  }
</style>