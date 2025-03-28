<script>
  let { originalPrompt, passedFilter, generatedText } = $props();
</script>

<div class="prompt box-3d {passedFilter ? 'green' : 'red'}">
	{originalPrompt}
</div>

<style>
	.prompt {
		padding: 36px;
	}

	.prompt:first-child {
		border-radius: 24px;
	}

	.prompt:not(:first-child) {
		text-overflow: ellipsis;
		border-radius: 50vh;
		font-size: 32px;
		font-weight: 600;
		background-position: right 48px center;
		background-repeat: no-repeat;
		padding-right: 108px;
		text-wrap: nowrap;
		overflow: hidden;
    background-size: 60px;
	}

	.red {
		background-color: var(--google-red);
		background-image: url('/img/icon-cancel.svg');
	}

	.green {
		background-color: var(--google-green);
    background-image: url('/img/icon-check.svg');
	}
</style>
