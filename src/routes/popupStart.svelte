<script lang="ts">
	import { goto } from "$app/navigation";
	import { acceptAgreement } from './consentAgreement';
	import { base } from '$app/paths';

    let showStartPopup = $state(false);

	function acceptedClicked() {
		goto(`${base}/Homescreen`, {noScroll:false});
		//acceptAgreement();
		//closeStartPopup();
	}

    function openStartPopup() {
		showStartPopup = true;
	}

	function closeStartPopup() {
		showStartPopup = false;
	}
</script>
    
    <!-- Exit Popup -->
	{#if showStartPopup}
		<div class="popup-overlay" role="dialog" aria-labelledby="exit-title">
			<div class="popup exit-popup">
				<h2>Hello, and welcome to our application called "Mood Tracker".</h2>
				<h5>
					In this app, you will be able to naviagte our different menus to access 
					different features we have implemented while developing this project.
					<p></p>
					In this application, you will be able to access and use the Task Screen, Mood Screen, Breathing Techniques, Yoga Exercises and the End Screen, 
					displaying all the data that we will have access to after you completed your testing.
				</h5>
				<p></p>
				<h3>User Tests</h3>
				<h5>
					When checking out our application, there are 5 tests that you can try and complete:
					<p></p>
					1. Edit the "Today's To-Do List" by removing a task, adding a task, updating a task name and ticking off a task.
					<p></p>
					2. Visit the "Mood Screen" and set your current mood to any of the 5 options.
					<p></p>
					3. Check out the mood graph and select more moods to see the graph update with your inputs.
					<p></p>
					4. Visit the "Breathing Exercise" menu, select a duration and start the timer to breath in sync with the anaimation.
					<p></p>
					5. Visit the "Yoga Exercises" menu, select what exercises you want enabled, set a duration and provide your current feeling before and after the exercises.
				</h5>
				<p></p>
				<h3>Consent:</h3>
				<h5>
					By agreeing, we will be able to access any feedback you provide and  your results and performance from 
					your time using our application. This data is used to improve and further develop this application.
					Not agreeing will result in you not being able to access the application.
				</h5>
				
				<div class="button-group">
					<button onclick={acceptedClicked} class="btn-primary">Accept Agreement</button>
					<button onclick={closeStartPopup} class="btn-secondary">Close</button>
				</div>
			</div>
		</div>
	{/if}

    	<!-- Exit Button -->
	<button onclick={openStartPopup} class="exit-btn">
		View Information
	</button>