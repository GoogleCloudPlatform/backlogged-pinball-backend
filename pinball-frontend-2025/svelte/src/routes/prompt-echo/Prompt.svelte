<script>
	let { originalPrompt, passedFilter, generatedText, modelArmorResponse } = $props();
</script>

<div class="prompt box-3d {passedFilter ? 'green' : 'red'}">
	<div class="originalPrompt">
		<div class="text">
			{originalPrompt}
		</div>
	</div>
	<div class="responseData box-3d">
		<div class="modelArmorResponse">
			<h2><img src="/img/icon-shield-black.svg" /> Response from Model Armor</h2>
			<div class="text">
				{JSON.stringify(modelArmorResponse.sanitizationResult, null, 1)}
			</div>
		</div>
		<div class="generatedText">
			<div class="text">
				{generatedText}
			</div>
		</div>
	</div>
</div>

<style>
	.prompt {
		padding: 36px;
		border-radius: 60px;
		font-size: 32px;
		font-weight: 600;
		background-position: top 24px right 24px;
		background-repeat: no-repeat;
		background-size: 60px;
	}

	.prompt .text {
		text-overflow: ellipsis;
		text-wrap: nowrap;
		overflow: hidden;
		margin-right: 48px;
	}

	.responseData {
		opacity: 0;
		height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		border-radius: 30px;
	}

	.prompt:first-child .responseData {
		opacity: 1;
		height: auto;
		margin-top: 24px;
	}

	.modelArmorResponse {
		width: 40%;
		flex-grow: 1;
		padding: 24px;
		background-color: var(--off-white);
		color: var(--black);
	}

	.modelArmorResponse h2 {
		font-size: 24px;
		font-weight: 600;
		margin: 0;
		line-height: 36px;
		padding-bottom: 8px;
		margin-bottom: 24px;
		border-bottom: 2px solid var(--black);
	}

	.modelArmorResponse h2 img {
		width: 36px;
		height: 36px;
		vertical-align: middle;
	}

	.modelArmorResponse .text {
		font-family: 'Geist Mono', monospace;
		font-size: 15px;
		font-weight: 400;
		margin-left: 18px;
		white-space: pre-wrap;
	}

	.generatedText {
		width: 60%;
		background-color: var(--white);
		padding: 48px;
	}

	.generatedText .text {
		text-wrap: wrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 22px;
		font-weight: 500;
		line-height: 1.5;
		text-wrap: wrap;
		color: var(--black);
		display: -webkit-box;
		-webkit-line-clamp: 22;
		white-space: pre-line;
		-webkit-box-orient: vertical;
	}

	.red .generatedText {
		display: none;
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
