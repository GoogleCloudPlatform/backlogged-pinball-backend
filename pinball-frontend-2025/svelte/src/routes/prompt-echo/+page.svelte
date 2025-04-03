<script>
	import Prompt from './Prompt.svelte';
	import { initializeApp } from 'firebase/app';
	import { getFirestore, onSnapshot } from 'firebase/firestore';
	import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
	import { onMount } from 'svelte';

	const firebaseConfig = {
		apiKey: 'AIzaSyAzyVzLvTex4t1EFAaOO3rL_IaYRyTzAbM', // Firebase Browser key
		authDomain: 'backlogged-ai.firebaseapp.com',
		projectId: 'backlogged-ai',
		storageBucket: 'backlogged-ai.firebasestorage.app',
		messagingSenderId: '404073014646',
		appId: '1:404073014646:web:1c7fffe43bb8e21f338657',
		measurementId: 'G-DH2T6MKT27'
	};

	const numPrompts = 20;

	const prompts = $state([]);

	onMount(async () => {
		// Initialize Firebase
		const app = initializeApp(firebaseConfig);
		const db = getFirestore(app);
		const promptsCollection = collection(db, 'ProcessedPrompts');

		const q = query(promptsCollection, orderBy('timestamp', 'desc'), limit(numPrompts));

		const unsubscribe = onSnapshot(q, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					const newPromptData = {
						id: change.doc.id,
						...change.doc.data()
					};
					prompts.unshift(newPromptData);

					if (prompts.length > numPrompts) {
						prompts.pop();
					}
				}
			});
		});

		return () => {
			unsubscribe();
		};
	});

	function promotePrompt(promptToMove) {
		const index = prompts.findIndex((p) => p.id === promptToMove.id);
		if (index > 0) {
			const [movedPrompt] = prompts.splice(index, 1);
			prompts.unshift(movedPrompt);
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		}
	}
</script>

<main>
	<div class="prompts">
		{#each prompts as prompt (prompt.id)}
			<Prompt
				originalPrompt={prompt.originalPrompt}
				passedFilter={prompt.passedFilter}
				generatedText={prompt.generatedText}
				modelArmorResponse={prompt.modelArmorResponse}
				on:promote={() => promotePrompt(prompt)}
			/>
		{/each}
	</div>
</main>

<style>
	.prompts {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 24px;
	}
</style>
