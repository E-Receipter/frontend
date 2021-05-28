<script>
	import { fade } from 'svelte/transition';
	import { pageTransitionDelay, pageTransitionDuration } from '$lib/uiSettings.js';
	import { map } from '$lib/name_map.js';
	export let name;
	$: fullName = map[name];
</script>

<style>

</style>

<div
	in:fade={{ duration: pageTransitionDuration, delay: pageTransitionDelay }}
	out:fade={{ duration: pageTransitionDelay }}
	class="sticky top-0 flex w-full bg-prim text-pure-white py-2">
	{#if fullName}
		<img
			src="chevron.svg"
			class="cursor-pointer"
			alt="<"
			on:click={e => {
				if (window) {
					window.history.back();
				}
			}} />
	{/if}
	<div class="flex-1 flex">
		<span class="mx-auto">{fullName ? fullName : ''}</span>
	</div>
	<img class="opacity-0" src="chevron.svg" alt="<" />
</div>
