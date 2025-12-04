    import  MoodTracker  from '$lib/MoodTracker/MoodTracker.svelte';
  import type { MoodEntry } from '$lib/MoodTracker/types';

  let entries = $state<MoodEntry[]>([]);

  function handleMoodSave(entry: MoodEntry) {
    console.log('New mood saved:', entry);
  }
</script>

<MoodTracker bind:entries onMoodSave={handleMoodSave} />