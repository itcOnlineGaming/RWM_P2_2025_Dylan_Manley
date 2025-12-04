<!--- Exit Sceen -->
<script lang="ts">
	import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { tasksSubmissionStore } from '$lib/stores/tasks.js';
  import { derived } from 'svelte/store';
  // Timer import
  import { onMount } from 'svelte';
  import html2pdf from "html2pdf.js";
    
  // Grab the data from the .JS file
  const submission = derived(tasksSubmissionStore, $store => $store);
  
  function NavigateToHomescreen() 
  {
      goto(`${base}/Homescreen`, { noScroll: false });
  }
    // Test results:
   // let session_results = 
   // [
   // { number: 1, description: 'Total Session Time', result: "1000" + " seconds" },
   // { number: 2, description: 'Total Button Clicks', result: "100" + " clicks" },
   // { number: 3, description: 'Mood Inputted', result: "2" },
   // { number: 4, description: 'Incorrect input', result: "5" + " wrong clicks" },
    //{ number: 5, description: 'Mood Inputted', result: "2" }
    //];

    let session_results = 
    [
    { number: 1, description: $submission.feedback_text, result: $submission.rating_number }//,
    //{ number: 2, description: "Mood Screen" + "enter description", result: "1" }
    ];

    // Timer
    let elapsed_time = $state(0);
    let duration = $state(50000); // amount of time until it takes then it shows the table

    onMount(() => 
    {
        let last_time = performance.now();

        let frame;
        (function update() 
        {
        frame = requestAnimationFrame(update);
        const time = window.performance.now();
        elapsed_time += Math.min(time - last_time, duration -
        elapsed_time);
        last_time = time;
        })();

         console.log("Time is : " + frame)
        
        //elapsed_time += Math.min(time - last_time, duration - elapsed_time);
        //last_time = time;
    });

    
function downloadPage() 
{
    const element = document.body; // or your specific div

    // Tell TypeScript to ignore type checking for options
    const options: any = 
    {
        margin: 0.5,
        filename: "result.jpeg",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    // Pass the element first, options second
    html2pdf(element as HTMLElement, options);
  }
   
</script>


<div class="container">
    <h1 class="title-Exit"> Result Table</h1>
</div>


<table>
  <thead>
    <tr>
      <th>NO.</th>
      <th>DESCRIPTION</th>
      <th>RESULT</th>
    </tr>
  </thead>
  <tbody>
    {#each session_results as session_result}
      <tr>
        <td>{session_result.number}</td>
        <td>{session_result.description}</td>
        <td>{session_result.result}</td>
      </tr>
    {/each}
  </tbody>
</table>


<div class="container">
   <h1 class="title">Thank you for testing</h1>
    <h1 class="title">Goodbye!</h1>
</div>

<button class="exit-btn" on:click={NavigateToHomescreen}>Go Back to Home</button>
<button class="exit-btn" on:click={downloadPage}>Download Page</button>


<style>
  /* Table CSS */
  table 
  {
    width: 50%;
    border-collapse: collapse;
    margin: 0 auto; 
  }
  th, td 
  {
    border: 1px solid #181231;
    padding: 0.5rem;
    text-align: left;
  }

  th 
  {
    background-color: #aaaaaa;
    border-bottom: 2px solid #000531;
  }
  tr
  {
    background-color: #d4d4d4;
  }
  tr:nth-child(even) 
  {
    background-color: #d4d4d4;
    border-bottom: 2px solid #000531;
  }
  tr:hover 
  {
    background-color: rgb(134, 143, 137);
  }
  body
  {
    background-color: rgb(170, 65, 65);
  }

  /* Goodbye text */
  .instruction-text 
  {
      text-align: center;
      font-size: 1.5rem;
      color: #555;
      margin-top: 1.5rem;
  }

</style>

