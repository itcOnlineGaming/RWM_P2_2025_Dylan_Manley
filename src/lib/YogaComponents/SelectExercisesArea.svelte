<script lang="ts">
    import { exerciseEnabled } from "./store";
    import "./global.css";
    
    function updateToggle(index: number): void {
        exerciseEnabled.update(arr => {
            arr[index] = !arr[index];
            console.log(arr[index]);
            return arr;
        });
    }
</script>

<!-- 
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
-->

<div class="button-wrapper">
    <button class="btn" class:green-border={$exerciseEnabled[0]} class:red-border={!$exerciseEnabled[0]} on:click={() => updateToggle(0)}>🧘
        <div class="tooltip">Meditate</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[1]} class:red-border={!$exerciseEnabled[1]} on:click={() => updateToggle(1)}>😮‍💨
        <div class="tooltip">Deep Breaths</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[2]} class:red-border={!$exerciseEnabled[2]} on:click={() => updateToggle(2)}>🤸
        <div class="tooltip">Cartwheel</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[3]} class:red-border={!$exerciseEnabled[3]} on:click={() => updateToggle(3)}>🙆
        <div class="tooltip">Loosen Up</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[4]} class:red-border={!$exerciseEnabled[4]} on:click={() => updateToggle(4)}>🙇⬆️
        <div class="tooltip">Downward Dog</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[5]} class:red-border={!$exerciseEnabled[5]} on:click={() => updateToggle(5)}>🌉
        <div class="tooltip">Bridge Pose</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[6]} class:red-border={!$exerciseEnabled[6]} on:click={() => updateToggle(6)}>🧍🌿
        <div class="tooltip">Tree Pose</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[7]} class:red-border={!$exerciseEnabled[7]} on:click={() => updateToggle(7)}>🧍➖
        <div class="tooltip">Plank</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[8]} class:red-border={!$exerciseEnabled[8]} on:click={() => updateToggle(8)}>🚶‍♂️✋
        <div class="tooltip">Warrior I</div> </button>
    <button class="btn" class:green-border={$exerciseEnabled[9]} class:red-border={!$exerciseEnabled[9]} on:click={() => updateToggle(9)}>🚶‍♂️👈👉
        <div class="tooltip">Warrior II</div> </button>
</div>
