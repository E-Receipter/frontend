<script>
	import { page, navigating } from '$app/stores';
	import Header from '$lib/Header.svelte';
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
<Header name={section} />
<slot />
