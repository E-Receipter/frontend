<script>
	import { page, navigating } from '$app/stores';
	import Header from '$lib/Header.svelte';
	import Loader from '$lib/Loader.svelte';
	import FullScreenLoading from '$lib/FullScreenLoading.svelte';
	import '../global.css';

	$: section = $page.path.split('/')[1];
	let ready = false;

	async function checkLoading(){
		if(!navigator.serviceWorker.controller)
			await new Promise((resolve)=>{
				navigator.serviceWorker.oncontrollerchange = resolve;
			})
		ready = true;
	}

	if (typeof navigator !== 'undefined') {
		checkLoading();
	}
</script>

{#if !ready}
	<FullScreenLoading />
{/if}
{#if $navigating}
	<Loader/>
	<div class="absolute inset-0 bg-gray-600 opacity-50"></div>
{/if}
<Header name={section} />
<slot />
