<script>
	import { onMount, onDestroy } from 'svelte';
	let percent = 0;
	let timer = null;

	onMount(() => {
		timer = setInterval(() => {
			let left = 100 - percent - 1;
			percent += left * 0.05;
		}, 500);
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<style>
	.progress {
		background: linear-gradient(45deg, #ffffff, #e6e6e6);
		height: 1rem;
		transition-property: width;
		@apply duration-500 ease-linear rounded-lg;
	}
	.neu-bg {
		background: linear-gradient(315deg, #5432ca, #643cf0);
	}
</style>

<div class="w-full z-40 rounded-xl p-1 bg-purple-900">
	<div class="progress" style={`width:${percent}%`} />
</div>
