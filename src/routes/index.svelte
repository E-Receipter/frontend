<script>
	import { fade } from 'svelte/transition';
	import { pageTransitionDelay, pageTransitionDuration } from '$lib/uiSettings.js';
</script>

<style>

</style>

<div
	in:fade={{ duration: pageTransitionDuration, delay: pageTransitionDelay }}
	out:fade={{ duration: pageTransitionDelay }}
	class="flex flex-col h-5/6 w-screen">
	<div class="flex flex-1 p-8 bg-prim">
		<img class="mx-auto" src="main.svg" alt="" />
	</div>
	<div class="flex flex-1 justify-center font-medium">
		<div class="m-auto flex flex-col justify-center">
			<a href="/scan" class="flex justify-around rounded-full bg-prim text-pure-white px-6 py-2">
				<img class="mr-1" src="scanIcon.svg" alt="" />
				<span class="ml-1">Scan</span>
			</a>
			<div class="flex mt-2">
				<a href="/list" class="mx-auto text-prim">view my bills</a>
			</div>
		</div>
	</div>
</div>
