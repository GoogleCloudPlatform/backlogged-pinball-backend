<script>
	import Prompt from './Prompt.svelte';
	import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';
	import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
	import { onMount } from 'svelte';

	const firebaseConfig = {
		apiKey: 'AIzaSyAzyVzLvTex4t1EFAaOO3rL_IaYRyTzAbM',
		authDomain: 'backlogged-ai.firebaseapp.com',
		projectId: 'backlogged-ai',
		storageBucket: 'backlogged-ai.firebasestorage.app',
		messagingSenderId: '404073014646',
		appId: '1:404073014646:web:1c7fffe43bb8e21f338657',
		measurementId: 'G-DH2T6MKT27'
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);
	const promptsCollection = collection(db, 'ProcessedPrompts');
	const numPrompts = 10; // # of prompts to fetch on initial page load

	const q = query(promptsCollection, orderBy('timestamp', 'desc'), limit(numPrompts));

  const prompts = $state([]);

	onMount(async () => {
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			prompts.push(doc.data());
		});

    console.log(prompts);
	});
</script>

<main>
	<div class="prompts">
		{#each prompts as {originalPrompt, passedFilter, generatedText}}
			<Prompt {originalPrompt} {passedFilter} {generatedText}></Prompt>
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
