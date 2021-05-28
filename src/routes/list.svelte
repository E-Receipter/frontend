<script>
	import BillCard from '$lib/BillCard.svelte';
	import { fade } from 'svelte/transition';
	import { pageTransitionDelay, pageTransitionDuration } from '$lib/uiSettings.js';
	import { onMount } from 'svelte';
	let billList = [];

	onMount(async () => {
		const res = await fetch('/db');
		if (res.ok) {
			billList = await res.json();
		}
	});
</script>

<div
	in:fade={{ duration: pageTransitionDuration, delay: pageTransitionDelay }}
	out:fade={{ duration: pageTransitionDelay }}
	class="flex flex-col mx-2">
	{#if billList.length > 0}
		{#each billList as bill}
			<BillCard {bill} />
		{/each}
	{:else}
		<div class="w-full">Loading...</div>
	{/if}
</div>
