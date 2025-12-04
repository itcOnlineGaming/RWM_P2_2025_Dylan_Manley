<script lang="ts">
    import { get } from 'svelte/store';
    import { pastFeelingReported, currentFeelingReported, statusMessage } from "./store.ts";
    import { createEventDispatcher } from 'svelte';
    import "./global.css";

    export let question = "How do you feel currently?";
    export let show = false;

    const dispatch = createEventDispatcher();
    let modalEl: HTMLDivElement;

    function open() {
        show = true;
    }

    function close() {
        show = false;
        dispatch('close');
    }

    function selectRating(rating: number) {
        dispatch('ratingSelected', { rating });
        console.log(get(pastFeelingReported));
        if (get(pastFeelingReported) === -1) {
            pastFeelingReported.set(rating);
        }
        else {
            currentFeelingReported.set(rating);
            if (get(currentFeelingReported) > get(pastFeelingReported))
                statusMessage.set("Yoga has improved your mood!");
            else if (get(currentFeelingReported) < get(pastFeelingReported))
                statusMessage.set("You dont feel as great, maybe try something else.");
            else statusMessage.set("You feel the same as you did before trying yoga.");
        }
        console.log("Feeling Reported");
        close();
    }

    $: if (show && modalEl) {
        modalEl.focus();
    }
</script>

<!-- Button to Open Popup -->
<button type="button" class="btn" data-tooltip="Open Rating Popup" on:click={open}>
    Open Current Feeling Popup
</button>

{#if show}
    <div class="overlay" role="button" tabindex="0" on:click={close}
        on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") close();
        }}>
        <div class="modal" role="dialog" aria-modal="true"
            tabindex="-1" bind:this={modalEl} on:click|stopPropagation>
            <h2>{question}</h2>
            <div class="buttons">
                {#each Array(10) as _, i}
                    <button type="button" class="btn" on:click={() => selectRating(i + 1)}>
                        {i + 1}
                    </button>
                {/each}
            </div>
            <button type="button" class="close-btn" on:click={close}>✖</button>
        </div>
    </div>
{/if}
