<script>
	import prompts from '../data/predefined_prompts.json';
	import Prompt from './Prompt.svelte';

  let { userPrompt = $bindable('') } = $props();

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	for (const key in prompts) {
		shuffleArray(prompts[key]);
	}
</script>

<div class="prompts">
	{#each Object.keys(prompts) as key, index}
		<Prompt prompts={prompts[key]} rotationOffsetInSecs={(index+1) * 10} bind:userPrompt />
	{/each}
</div>

<style>
	.prompts {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 14px;
		margin-top: 40px;
	}
</style>
