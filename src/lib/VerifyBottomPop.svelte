<script>
	import { createEventDispatcher,onMount } from 'svelte';
	import { fly } from 'svelte/transition';
    export let id;
    let canvas;

    const dispatch = createEventDispatcher();
    onMount(async ()=>{
        const res = await fetch(`/db/verify?id=${id}`);
        if(!res.ok)
            dispatch('click',false);
        const form = await res.formData();
        const data = new Uint8ClampedArray(await form.get('data').arrayBuffer());
        const width = Number(form.get('width'));
        const height = Number(form.get('height'));
        const image = new ImageData(data,width);
        let ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.putImageData(image,0,0);
    })
</script>

<style>
	.shadow-special {
		box-shadow: 0px -1px 8px -2px rgb(0 0 0 / 31%);
	}
	.noButton {
		@apply rounded-full bg-pureWhite text-prim border-prim border-2 px-6 py-2;
	}
	.yesButton {
		@apply rounded-full bg-prim text-pureWhite border-pureWhite border-2 px-6 py-2;
	}
</style>

<div on:click={e => {
				dispatch('click', Boolean(true));
			}}
	class="absolute inset-0 bg-gray-600 opacity-50">
</div>
<div
	transition:fly={{ y: 200, duration: 500 }}
	class="bg-white shadow-special flex flex-col rounded-t-3xl fixed inset-x-0 bottom-0 z-20">
	<div class="flex flex-col justify-between py-4 mx-2">
		<canvas bind:this={canvas} class="flex-1 mx-auto h-64" style="max-width:80%;"/>
		<span class="flex-1 mx-auto my-2 text-center">Verification</span>
		<span class="flex-1 mx-auto text-gray-500 text-center">scan jabcode to verify data</span>
	</div>
	<div class="flex justify-around pb-4">
		<button
			class="yesButton"
			on:click={e => {
				dispatch('click', true);
			}}>
			close
		</button>
	</div>
</div>
