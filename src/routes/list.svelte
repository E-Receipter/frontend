<script>
	import BillCard from '$lib/BillCard.svelte';
	import { fade } from 'svelte/transition';
	import { pageTransitionDelay, pageTransitionDuration } from '$lib/uiSettings.js';
	import { onMount } from 'svelte';
	let billList = null;

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
	{#if !billList}
		<div style="height:50vh;" class="w-full flex">
			<div class="m-auto">Loading...</div>
		</div>
	{:else if billList.length > 0}
		{#each billList as bill}
			<BillCard {bill} />
		{/each}
	{:else}
		<div style="height:50vh;" class="w-full flex">
			<div class="m-auto">No Bills to show</div>
		</div>
	{/if}
</div>
