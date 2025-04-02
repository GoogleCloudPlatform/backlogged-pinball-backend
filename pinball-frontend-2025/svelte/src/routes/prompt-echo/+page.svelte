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

	const numPrompts = 10;

	const prompts = $state([]);

	onMount(async () => {
		// Initialize Firebase
		const app = initializeApp(firebaseConfig);
		const db = getFirestore(app);
		const promptsCollection = await collection(db, 'ProcessedPrompts');

		const q = await query(promptsCollection, orderBy('timestamp', 'desc'), limit(numPrompts));

		const subscribe = onSnapshot(q, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					prompts.unshift(change.doc.data());

					if (prompts.length > numPrompts) {
						prompts.pop();
					}
				}
			});
		});
	});
</script>

<main>
	<div class="prompts">
		{#each prompts as { originalPrompt, passedFilter, generatedText, modelArmorResponse }}
			<Prompt {originalPrompt} {passedFilter} {generatedText} {modelArmorResponse}></Prompt>
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
