<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>Mood Tracker</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

{@render children?.()}

<style global>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
</style>
