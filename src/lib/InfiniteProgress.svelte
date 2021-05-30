<script>
import { onMount,onDestroy } from 'svelte';
let percent = 0;
let timer = null;

onMount(()=>{
    timer = setInterval(()=>{
		let left = 100 - percent-1;
		percent += left*0.05;
	},500);
})

onDestroy(()=>{
    clearInterval(timer);
})
</script>

<style>
	.progress{
		background: linear-gradient(45deg, #ffffff, #e6e6e6);
		box-shadow:  5px -5px 70px #5231c5,
             -5px 5px 70px #683ffb;
		height: 1rem;
		transition-property: width;
		@apply duration-500 ease-linear rounded-lg;
	}
	.neu-bg {
background: linear-gradient(45deg, #5432ca, #643cf0);
box-shadow:  21px -21px 42px #352080,
             -21px 21px 42px #8550ff;}
</style>

<div class="neu-bg w-full z-40 rounded-xl p-1 bg-purple-900">
	<div class="progress" style={`width:${percent}%`}></div>
</div>