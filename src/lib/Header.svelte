<script>
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { pageTransitionDelay, pageTransitionDuration } from '$lib/uiSettings.js';
	import { map } from '$lib/name_map.js';
	export let name;
	$: fullName = map[name];

	let percent = 0;
	let timer = null;

	$: if(navigating){
			timer = setInterval(()=>{
				let left = 100 - percent;
				percent += left*0.1;
			},200);
		} else if(timer){
			clearInterval(timer);
		}

</script>

<style>
	.progress{
		height: 2px;
		transition-property: width;
		@apply duration-500 ease-in-out;
	}
</style>
{#if navigating}
<div class="absolute top-0 w-full">
	<div class="progress" style={`width:${percent}%`}></div>
</div>
{/if}
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
