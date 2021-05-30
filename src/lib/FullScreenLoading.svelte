<script>
import { fade } from 'svelte/transition';
import Loader from '$lib/Loader.svelte';
import InfiniteProgress from '$lib/InfiniteProgress.svelte';
</script>

<div 
    out:fade={{ duration: 300 }}
    class="absolute inset-0 bg-prim flex flex-col justify-around z-50">
    <div class="mx-4">
        <InfiniteProgress/>
    </div>
</div>