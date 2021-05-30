<script>
import { onMount,onDestroy } from 'svelte';
let percent = 0;
let timer = null;

onMount(()=>{
    timer = setInterval(()=>{
		let left = 100 - percent-5;
		percent += left*0.05;
	},500);
})

onDestroy(()=>{
    clearInterval(timer);
})
</script>

<style>
	.progress{
		height: 1rem;
		transition-property: width;
		@apply bg-white duration-500 ease-linear rounded-lg;
	}
</style>

<div class="w-full z-40 rounded-xl p-1 bg-purple-900">
	<div class="progress" style={`width:${percent}%`}></div>
</div>