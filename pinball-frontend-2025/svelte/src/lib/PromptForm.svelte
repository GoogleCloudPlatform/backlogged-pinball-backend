<script>
	import Prompts from './Prompts.svelte';

	let { userPrompt } = $props();

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function handlePrepopulatedPromptClick(data) {
		userPrompt = data;
		checkSafety(data);
	}

	function handleFormPromptClick() {
		checkSafety();
	}

	let checkSafety = async () => {
		console.log('Checking safety of prompt:', userPrompt);

		if (userPrompt === '') {
			return;
		}

		let promptForm = document.getElementById('promptForm');

    promptForm.classList.add('working');

		let response = await fetch(
			'https://armor-up-api-404073014646.us-central1.run.app/filterSuggestedPrompt',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					data: {
						prompt: userPrompt
					}
				})
			}
		);

		let responseJSON = await response.json();

		console.log('Prompt safety result:', responseJSON.result);

		// added a delay because the API is returning too fast(!)
		await sleep(500);

		if (responseJSON.result.passedFilter) {
			promptForm.classList.add('safe');
		} else {
			promptForm.classList.add('unsafe');
		}

		promptForm.classList.remove('working');

		// give a moment to see the result before resetting
		await sleep(5000);
		promptForm.classList.remove('safe');
		promptForm.classList.remove('unsafe');

		userPrompt = '';
	};
</script>

<form action="#" class="box-3d" id="promptForm">
	<input
		type="text"
		placeholder="What can I help you with?"
		id="prompt-input-field"
		bind:value={userPrompt}
	/>
	<button aria-label="prompt-input-field" onclick={handleFormPromptClick}></button>
</form>
<Prompts clickPrepopulatedPrompt={handlePrepopulatedPromptClick} />

<style>
	#promptForm {
		transition: all 0.25s;
	}

	form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28px;
		padding-left: 48px;
		background-color: var(--white);
		border-radius: 50vh;
	}
	input[type='text'] {
		width: 100%;
		border: none;
		text-overflow: ellipsis;
		font-size: 32px;
		font-weight: 600;
		font-family: inherit;
		outline: none;
		background-color: transparent;
		color: var(--black);
		transition: all 0.25s;
	}

	input[type='text']::placeholder {
		color: var(--light-grey);
	}

	button {
		width: 4em;
		height: 4em;
		background-color: transparent;
		background-image: url('../img/icon-arrow.svg');
		background-size: contain;
		background-position: center center;
		background-repeat: no-repeat;
		border: none !important;
		outline: none;
		cursor: pointer;
	}

	:global(#promptForm.safe) {
		background-color: var(--google-green);
	}

	:global(#promptForm.safe input[type='text'], #promptForm.unsafe input[type='text']) {
		color: var(--white);
	}

	:global(#promptForm.safe button) {
		background-image: url('../img/icon-check.svg');
	}

	:global(#promptForm.unsafe) {
		background-color: var(--google-red);
	}

	:global(#promptForm.unsafe button) {
		background-image: url('../img/icon-cancel.svg');
	}

  :global(#promptForm.working) {
		background-color: var(--inactive-grey);
	}
  :global(#promptForm.working input[type='text']) {
    color: var(--white);
	}

	:global(#promptForm.working button) {
		background-image: url('../img/spinner.svg');
	}
</style>
