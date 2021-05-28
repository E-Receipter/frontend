<script>
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { pageTransitionDelay, pageTransitionDuration } from '$lib/uiSettings.js';
	import { onMount, onDestroy } from 'svelte';
	import Loader from '$lib/Loader.svelte';
	import BottomPop from '$lib/BottomPop.svelte';
	let DOMready;
	let stream;
	let video;
	let msg = '';
	let canvas;

	let videoOrCanvas = true;
	let loading = false;
	let error = false;
	let errorResolve = null;

	let factor = null;
	let vlength = null;
	function animateCanvas() {
		const animationKey = requestAnimationFrame(animateCanvas);
		//copy image from video to canvas
		if (video && stream && canvas) {
			let ctx = canvas.getContext('2d');
			if (!factor || !vlength) {
				let vheight = video.videoHeight;
				let vwidth = video.videoWidth;
				if (vheight > vwidth) {
					factor = Number((vheight - vwidth) / 2);
					vlength = vwidth;
				} else {
					factor = Number((vwidth - vheight) / 2);
					vlength = vheight;
				}
			}
			ctx.drawImage(video, factor, 0, vlength, vlength, 0, 0, canvas.width, canvas.height);
			return;
		}
		cancelAnimationFrame(animationKey);
	}

	async function stopVideo() {
		if (stream) {
			const tracks = stream.getTracks();
			tracks.forEach(function(track) {
				track.stop();
			});
			stream = null;
		}
	}

	async function loadCam() {
		const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if (!getUserMedia) {
			msg = 'no user media';
			console.log('no user media');
			return;
		}
		stream = await new Promise((resolve, reject) => {
			getUserMedia.call(
				navigator,
				{
					video: {
						width: { min: 400, ideal: 1200 },
						height: { min: 400, ideal: 1200 },
						aspectRatio: { ideal: 1 }
					},
					audio: false
				},
				resolve,
				reject
			);
		});
		video.srcObject = stream;
		video.play();
		requestAnimationFrame(animateCanvas);
	}
	onMount(async () => {
		try {
			await loadCam();
		} catch (e) {
			msg = e;
			console.log(e);
		}
	});

	onDestroy(async () => {
		try {
			await stopVideo();
		} catch (e) {
			msg = e;
			console.log(e);
		}
	});

	async function takePicture() {
		videoOrCanvas = false;
		var ctx = canvas.getContext('2d');
		if (
			!(await decodeBill(
				canvas.width,
				canvas.height,
				ctx.getImageData(0, 0, canvas.width, canvas.height)
			))
		) {
			await stopVideo();
		}
	}

	async function decodeBill(width, height, imgData) {
		loading = true;
		let res = null;
		try {
			res = await fetch(`/upload?width=${width}&height=${height}`, {
				method: 'POST',
				body: imgData.data.buffer
			});
		} catch (e) {
			loading = false;
			handleError();
			return null;
		}
		if (res.status != 200) {
			loading = false;
			handleError();
			return null;
		}
		const { id } = await res.json();
		goto(`/bill?id=${id}`);
		loading = false;
	}

	async function handleError() {
		const errorPromise = new Promise(resolve => (errorResolve = resolve));
		error = true;
		if (await errorPromise) {
			//try again
			await loadCam();
			videoOrCanvas = true;
		} else {
			//Cancel
			goto('/');
		}
		error = false;
	}
</script>

<style>
	.bounce {
		transition-timing-function: cubic-bezier(0.6, -0.51, 0.57, 1);
	}
</style>

{#if loading}
	<Loader />
{/if}
<div class="hidden p-1 p-5 p-4 p-0" />
<div
	in:fade={{ duration: pageTransitionDuration, delay: pageTransitionDelay }}
	out:fade={{ duration: pageTransitionDelay }}
	class="flex flex-col h-5/6 w-full">
	{msg}
	<div class="m-auto flex">
		<video alt="loading..." bind:this={video} class="hidden" />
		<canvas bind:this={canvas} width="480" height="480" class="m-auto" style="width:90%;" />
	</div>
	<div class="absolute z-100 flex inset-x-0 bottom-3">
		<button
			class:p-5={videoOrCanvas}
			class:p-1={!videoOrCanvas}
			class="transition-all duration-500 bounce rounded-full m-auto bg-prim ring-2 ring-prim
			ring-offset-2"
			on:click={takePicture} />
	</div>
</div>
{#if error}
	<BottomPop
		imgSrc="scanFailed.png"
		title="Scan Failed"
		description="Oops Sorry, we are not able to get the Jab code, hold tight and try again"
		noButton="Cancel"
		yesButton="Try again!"
		on:click={e => errorResolve(e.detail)} />
{/if}
