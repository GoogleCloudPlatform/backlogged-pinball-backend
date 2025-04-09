<script>
  import { clickOutside } from '$lib/utils/clickOutside.ts';

	let popoverVisible = $state(false);

	function handleEscape({ key }) {
		if (key === 'Escape') {
			popoverVisible = false;
		}
	}

</script>

<svelte:window on:keyup={handleEscape} />
<a class="how-it-works text-3d box-3d" alt="how it works" onclick={() => (popoverVisible = true)}
	>How it works</a
>

<div class="popover" class:visible={popoverVisible}>
	<div class="popover-content box-3d" use:clickOutside onoutclick={() => { popoverVisible ? popoverVisible = false : null; }}  >
		<div class="popover-header">
			<h1 class="text-3d">How it works</h1>
			<div class="button-container">
				<button onclick={() => (popoverVisible = false)} class="close"></button>
			</div>
		</div>
		<div class="popover-body">
			<img src="/img/diagram.png" alt="Architecture Diagram" />
			<div class="popover-text">
				<div class="key-points">
					<h2>Key Points:</h2>
					<ol>
						<li>
							A player hits a prompt on the pinball machine and sends it to the Cloud Run service
						</li>
						<li>
							The custom API checks the prompt with Model Armor to make sure it doesn't contain any
							of the banned categories
						</li>
						<li>If the prompt is ok, it is forwarded on to Gemini and Vertex AI</li>
						<li>
							The results of the Model Armor (and Gemini / Vertex AI) are stored in Firestore for
							further analysis and live display
						</li>
						<li>
							Submit your own prompts to see them on the pinball machine! (Some prompts will pass
							this step, but get rejected by Model Armor on the pinball machine! Try prompt
							injection, PII, or scammy prompts!)
						</li>
					</ol>
				</div>
				<div class="more-information">
					<ul>
						<lh> More Information </lh>
						<li>
							<a
								href="https://cloud.google.com/security-command-center/docs/model-armor-overview"
								target="_blank">Model Armor Overview</a
							>
						</li>
						<li>
							<a
								href="https://cloud.google.com/security-command-center/docs/manage-model-armor-templates"
								target="_blank">Model Armor Templates</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.how-it-works {
		display: block;
		background-color: var(--google-blue);
		color: var(--white);
		font-size: 18px;
		font-weight: 700;
		border-radius: 50vh;
		padding: 16px 32px;
		cursor: pointer;
	}

	.popover {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		background-color: color-mix(in srgb, var(--black), transparent 20%);
		display: none;
	}

	.popover.visible {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popover-content {
		box-sizing: border-box;
		border-radius: 24px;
		background-color: var(--off-white);
		width: calc(100% - 72px);
		height: calc(100% - 72px);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.popover-header {
		display: flex;
		position: sticky;
		justify-content: space-between;
		align-items: center;
		background-color: var(--google-green);
	}

	.popover-header div {
		padding: 18px;
	}

	.popover-header h1 {
		padding: 0;
		padding-left: 18px;
		margin: 0;
		font-size: clamp(2rem, 3vw, 3rem);
	}

	.popover-header button {
		width: 48px;
		height: 48px;
		background-image: url('/img/icon-close.svg');
		background-size: contain;
		background-color: transparent;
		border: none;
		outline: none;
    cursor: pointer;
	}

	.popover-body {
		overflow: scroll;
		color: var(--black);
		padding: 12px;
	}

	.popover-body a {
		color: var(--google-blue);
	}

	.popover-body img {
		display: block;
		width: 960px;
		max-width: 100%;
		margin: auto;
	}

	.popover-body .popover-text {
		display: flex;
		flex-direction: row;
		max-width: 1200px;
		margin: auto;
	}

	.popover-body .popover-text .more-information {
		white-space: nowrap;
		border-left: 1px solid color-mix(in srgb, var(--dark-grey), transparent 60%);
		margin-left: 18px;
	}

	.popover-body .popover-text .more-information lh {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-size: clamp(1.25rem, 1.5vw, 1.5rem);
	}
	.popover-body .popover-text .more-information li {
		line-height: 1.5;
	}

	.popover-body .popover-text h2 {
		font-size: clamp(1.5rem, 2vw, 2rem);
	}
	.popover-body .popover-text li {
		font-size: clamp(1rem, 1.25vw, 1.25rem);
	}
</style>
