<script>
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	let { prompts, rotationOffsetInSecs = 0, userPrompt = $bindable('') } = $props();

	let promptIndex = $state(0);
	let promptCharacterIndex = $state(0);
	let linkActive = $state(true);

	const formatPrompt = (prompt) => {
		// words over ~20 chars break the layout so modify them
		const websitePattern = /(https?:\/\/|www\.)([a-zA-Z0-9.-]+)(\.[a-zA-Z]{2,})+(\/\S*)?/g;
		prompt = prompt.replace(websitePattern, '[malicious_site]');

		prompt.split(' ').forEach((word, index) => {
			if (word.length > 20) {
				prompt = prompt.replace(word, word.slice(0, 10) + '…' + word.slice(10, 20));
			}
		});

		return prompt;
	};

	const eatCharacters = (cb) => {
		return new Promise((resolve) => {
			setTimeout(resolve, 20 + Math.random() * 5);
		}).then(() => {
			if (promptCharacterIndex > 0) {
				promptCharacterIndex--;
				eatCharacters(cb);
			} else {
				cb();
			}
		});
	};

	const buildCharacters = (cb) => {
		return new Promise((resolve) => {
			setTimeout(resolve, 25 + Math.random() * 10);
		}).then(() => {
			if (promptCharacterIndex <= prompts[promptIndex].length) {
				promptCharacterIndex++;
				buildCharacters(cb);
			} else {
				cb();
			}
		});
	};

	const rotator = () => {
		setTimeout(async () => {
			linkActive = false;
			await eatCharacters(() => {
				promptIndex = (promptIndex + 1) % prompts.length;
				buildCharacters(() => {
					linkActive = true;
				});
			});
		}, rotationOffsetInSecs * 1000);
	};

	onMount(() => {
		promptCharacterIndex = prompts[promptIndex].length;
		rotator();
		const interval = setInterval(rotator, 40000);
		return () => clearInterval(interval);
	});
</script>

<a alt="setPrompt" onclick={e => {e.preventDefault(); userPrompt = prompts[promptIndex]; console.log(userPrompt);}}>
<div class="prompt box-3d">
	{formatPrompt(prompts[promptIndex]).slice(0, promptCharacterIndex)}
	<div class="arrow" class:inactive={!linkActive}></div>
</div>
</a>

<style>
	div.prompt {
		min-height: 260px;
		background-color: var(--off-white);
		color: var(--background);
		font-size: 28px;
		font-weight: 600;
		padding: 24px;
		padding-bottom: 60px;
		border-radius: 20px;
		position: relative;
    cursor:pointer;
	}

	div.arrow {
		background-image: url('img/icon-arrow.svg');
		background-size: 36px;
		background-repeat: no-repeat;
		position: absolute;
		bottom: 18px;
		right: 18px;
		width: 36px;
		height: 36px;
		opacity: 1;
		transition: opacity 0.25s;
	}

	div.arrow.inactive {
		opacity: 0;
	}
</style>
