<script lang="ts">
	import PopupEnd from "../popupEnd.svelte";
	import MoodTracker from "./MoodTracker.svelte";
	import TasksModal from "./TasksModal.svelte";
	import ProgressJourney from "./ProgressJourney.svelte";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { tasksStore } from "$lib/stores/tasks.js";

	// temporary component for testing visual data in the mood graph:
	import MoodTestControls from "./MoodTestControls.svelte";

	type Todo = {
		id: number;
		text: string;
		completed: boolean;
	};

	let isTasksModalOpen = $state(false);

	function OnClickNavigateMoodScreen() {
		goto(`${base}/MoodScreen`, { noScroll: false });
	}

	function OnClickOpenTasksModal() {
		isTasksModalOpen = true; // Open modal instead of navigating
	}

	function OnClickNavigateBreathingScreen() {
		goto(`${base}/Breathingscreen`, { noScroll: false });
	}

	function OnClickNavigateYogaScreen() {
		goto(`${base}/YogaScreen`, { noScroll: false });
	}

	let tasks = $state<Array<{ id: number; text: string; completed: boolean }>>(
		[],
	);

	tasksStore.subscribe((value) => {
		tasks = value;
	});

	// Calculate progress percentage
	let progressPercentage = $derived(() => {
		if (tasks.length === 0) return 0;
		const completedTasks = tasks.filter((task) => task.completed).length;
		return Math.round((completedTasks / tasks.length) * 100);
	});

	function toggleTask(id: number) {
		const updatedTasks = tasks.map((task) =>
			task.id === id ? { ...task, completed: !task.completed } : task,
		);
		tasksStore.set(updatedTasks);
	}
</script>

<div class="page-container">
	<header class="page-header">
		<h1 class="page-title">Current Goals:</h1>
	</header>

	<div class="content">
		<!-- Progress Bar Section -->
		<section class="progress-section">
			<div class="progress-header">
				<span class="progress-label">Total Progress</span>
				<span class="progress-percentage">{progressPercentage()}%</span>
			</div>
			<div class="progress-bar-wrapper">
				<div
					class="progress-bar"
					style="width: {progressPercentage()}%"
				></div>
			</div>
		</section>

		<ProgressJourney />

		<!-- Todo List Section -->
		<section class="todo-section">
			<h2 class="section-title">Today's To-Do List</h2>
			<div class="todo-card">
				<ul class="todo-list">
					{#each tasks as task (task.id)}
						<li class="todo-item">
							<span class:completed={task.completed}
								>{task.text}</span
							>
							<input
								type="checkbox"
								checked={task.completed}
								onchange={() => toggleTask(task.id)}
								aria-label={`Mark ${task.text} as ${task.completed ? "incomplete" : "complete"}`}
							/>
						</li>
					{/each}
				</ul>
				<button
					onclick={OnClickOpenTasksModal}
					class="edit-btn"
					style="margin-top: 1.5rem;"
				>
					EDIT TASKS
				</button>
			</div>
		</section>

		<MoodTestControls />
		<!-- Simplified Daily Mood Tracker Component -->
		<MoodTracker onEditClick={OnClickNavigateMoodScreen} />

		<!-- Mindfulness Exercises Section -->
		<section class="mindfulness-section">
			<h2 class="section-title">Mindfulness Exercises</h2>

			<button
				onclick={OnClickNavigateBreathingScreen}
				class="exercise-card breathing-card"
			>
				<div class="exercise-icon cloud-icon">
					<svg
						width="233"
						height="76"
						viewBox="0 0 233 76"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M105.11 40.0589C101.558 27.6296 112.286 15.7901 125.004 18.1025L129.385 18.899L133.039 15.9305C144.284 6.7937 160.541 7.33086 171.158 17.1901L172.999 18.899L177.716 17.9556C189.569 15.5849 200.182 25.6955 198.389 37.6498L197.713 42.1594L202.931 46.725C212.614 55.1981 206.088 71.1288 193.243 70.3733L190.061 70.186C185.536 69.9199 181.014 70.7416 176.872 72.5822C172.51 74.5211 167.58 74.7591 163.051 73.2494L152.646 69.781L140.845 73.1528C135.32 74.7312 129.416 74.3175 124.166 71.984C120.907 70.5355 117.353 69.8715 113.791 70.0453L107.158 70.3689C91.6585 71.1249 87.8642 49.1164 102.722 44.6386L106.125 43.6131L105.11 40.0589Z"
							fill="white"
						/>
						<path
							d="M130.084 37.8213C132.498 39.9942 136.164 39.9942 138.578 37.8213"
							stroke="#2D2A8C"
							stroke-width="4.24697"
							stroke-linecap="round"
						/>
						<path
							d="M162.361 37.8213C164.776 39.9942 168.441 39.9942 170.855 37.8213"
							stroke="#2D2A8C"
							stroke-width="4.24697"
							stroke-linecap="round"
						/>
						<path
							d="M149.561 46.9112C149.06 46.3701 148.191 46.4177 147.752 47.0103C147.177 47.787 147.731 48.8877 148.698 48.8877C149.725 48.8877 150.259 47.6647 149.561 46.9112Z"
							stroke="#2D2A8C"
							stroke-width="4.24697"
							stroke-linecap="round"
						/>
						<ellipse
							cx="123.288"
							cy="41.643"
							rx="5.09637"
							ry="2.12349"
							fill="#FFC4D1"
						/>
						<ellipse
							cx="178.501"
							cy="41.643"
							rx="5.09637"
							ry="2.12349"
							fill="#FFC4D1"
						/>
					</svg>
				</div>
				<span class="exercise-text">BREATHING TECHNIQUES</span>
				<div class="exercise-arrow">➜</div>
			</button>

			<button
				onclick={OnClickNavigateYogaScreen}
				class="exercise-card yoga-card"
			>
				<div class="exercise-icon lotus-icon">
					<svg
						width="161"
						height="76"
						viewBox="0 0 161 76"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M80.8472 -6.17032e-05C80.8472 -6.17032e-05 20.3133 64.295 47.0286 91.4036C57.2666 101.792 80.8468 107.256 80.8468 107.256C80.8468 107.256 105.594 102.17 116.25 91.4035C143.179 64.1975 80.8472 -6.17032e-05 80.8472 -6.17032e-05Z"
							fill="#F2F2F2"
						/>
						<path
							d="M0 21.125L29.6218 40.1935C49.7318 53.139 63.5977 73.82 67.9364 97.3397L68.6934 101.443L55.0299 95.8866C28.9246 85.2699 9.61214 62.6221 3.2527 35.1674L0 21.125Z"
							fill="white"
						/>
						<path
							d="M160.637 22.1816L131.015 41.2502C110.905 54.1957 97.039 74.8767 92.7004 98.3964L91.9434 102.5L105.607 96.9433C131.712 86.3265 151.025 63.6788 157.384 36.2241L160.637 22.1816Z"
							fill="white"
						/>
						<path
							d="M41.4512 13.5C41.4512 13.5 72.2149 35.1427 77.6114 50.1452C84.7188 69.9043 77.6114 104.085 77.6114 104.085C77.6114 104.085 62.6609 101.535 54.4512 98C17.4595 82.0737 41.4512 13.5 41.4512 13.5Z"
							fill="white"
						/>
						<path
							d="M110.967 15.312C110.967 15.312 91.3711 33.6595 85.1742 48.4188C76.4955 69.0891 84.0179 106.727 84.0179 106.727L117.308 91.4031C117.308 91.4031 128.418 64.5291 123.453 45.5C120.228 33.1377 110.967 15.312 110.967 15.312Z"
							fill="white"
						/>
						<path
							d="M81.4531 18L66.0841 59.6612C59.54 77.4007 65.6722 97.3257 81.0583 108.316C96.169 97.2592 102.276 77.6242 96.1028 59.9475L81.4531 18Z"
							fill="white"
						/>
					</svg>
				</div>
				<span class="exercise-text">YOGA EXERCISES</span>
				<div class="exercise-arrow">➜</div>
			</button>
		</section>
	</div>

	<PopupEnd></PopupEnd>

	<TasksModal bind:isOpen={isTasksModalOpen} />
</div>

<style>
	.page-container {
		background: linear-gradient(180deg, #6366f1 0%, #818cf8 100%);
		padding-bottom: var(--spacing-xl);
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-md);
		color: white;
	}

	.page-title {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		color: white;
		margin: 0;
	}

	.content {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 var(--spacing-md);
	}

	/* Progress Section */
	.progress-section {
		margin-bottom: var(--spacing-lg);
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-sm);
		color: white;
	}

	.progress-label {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
	}

	.progress-percentage {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
	}

	.progress-bar-wrapper {
		background: rgba(255, 255, 255, 0.3);
		height: 60px;
		border-radius: var(--radius-sm);
		position: relative;
		overflow: hidden;
		clip-path: polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%);
	}

	.progress-bar {
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.5) 0%,
			rgba(255, 255, 255, 0.8) 100%
		);
		height: 100%;
		transition: width 0.3s ease;
	}

	/* Todo Section */
	.todo-section {
		background: white;
		border-radius: var(--radius-xl);
		padding: var(--spacing-lg);
		box-shadow: var(--shadow-lg);
		margin-bottom: var(--spacing-lg);
	}

	.section-title {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		text-align: center;
		margin-bottom: var(--spacing-md);
		color: var(--color-text);
	}

	.todo-card {
		background: var(--color-card-bg);
		border-radius: var(--radius-lg);
		padding: var(--spacing-md);
	}

	.todo-list {
		list-style: none;
		margin-bottom: var(--spacing-md);
	}

	.todo-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-md) 0;
		border-bottom: 2px dotted var(--color-border);
		font-size: var(--font-size-lg);
	}

	.todo-item:last-child {
		border-bottom: none;
	}

	.todo-item span {
		flex: 1;
		color: var(--color-text);
	}

	.todo-item span.completed {
		text-decoration: line-through;
		color: var(--color-text-muted);
	}

	.todo-item input[type="checkbox"] {
		width: 24px;
		height: 24px;
		cursor: pointer;
	}

	.edit-btn {
		background: var(--color-edit-btn);
		color: white;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-bold);
		padding: var(--spacing-md) var(--spacing-xl);
		border-radius: var(--radius-md);
		width: 100%;
		box-shadow: var(--shadow-md);
		border: none;
		cursor: pointer;
	}

	.edit-btn:hover {
		background: #38bdf8;
	}

	/* Mindfulness Section */
	.mindfulness-section {
		background: white;
		border-radius: var(--radius-xl);
		padding: var(--spacing-lg);
		box-shadow: var(--shadow-lg);
	}

	.exercise-card {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-lg);
		border-radius: var(--radius-lg);
		margin-bottom: var(--spacing-md);
		color: white;
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-base);
		border: none;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.exercise-card:last-child {
		margin-bottom: 0;
	}

	.breathing-card {
		background: linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%);
	}

	.breathing-card:hover {
		background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
	}

	.yoga-card {
		background: linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%);
	}

	.yoga-card:hover {
		background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
	}

	.exercise-icon {
		font-size: 2.5rem;
	}

	.lotus-icon {
		position: absolute;
		left: 20px; /* Adjust to move it left/right */
		bottom: -0.85px; /* Anchors to bottom, adjust to move up/down */
		width: 170px; /* Adjust size as needed */
		height: auto;
	}

	.lotus-icon svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.cloud-icon {
		position: absolute;
		left: -85px; /* Adjust to move it left/right */
		bottom: -15px; /* Anchors to bottom, adjust to move up/down */
		width: 300px; /* Adjust size as needed */
		height: auto;
	}

	.cloud-icon svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.exercise-text {
		flex: 1;
		text-align: center;
		letter-spacing: 1px;
	}

	.exercise-arrow {
		font-size: 1.5rem;
	}
</style>
