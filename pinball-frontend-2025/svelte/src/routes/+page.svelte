<h1 class="text-3d">Welcome! Choose a page:</h1>
<div class="pages">
	<div>
		<a href="prompt-input">
			<img src="/img/thumb-input.png" alt="Prompt input page" />
			<br />
			Prompt Input
		</a>
	</div>
	<div>
		<a href="prompt-echo">
			<img src="/img/thumb-echo.png" alt="Prompt input page" />
			<br />
			Prompt Echo
		</a>
	</div>
</div>

<style>
	.pages {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin: auto;
		width: fit-content;
		justify-items: center;
		align-items: center;
	}

	.pages div {
		text-align: center;
		width: fit-content;
		height: fit-content;
		vertical-align: middle;
	}

	.pages img {
		max-width: 20em;
		max-height: 20em;
	}
</style>
