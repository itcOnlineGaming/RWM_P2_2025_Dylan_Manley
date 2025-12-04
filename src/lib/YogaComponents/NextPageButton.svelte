<script lang="ts">
    import "./global.css";
    
    export let to = "/";
    export let label = "Go";

    export let navigate: (path: string) => void = () => {};
</script>

<button type="button" class="btn" on:click={() => navigate(to)}>
    {label}
</button>
