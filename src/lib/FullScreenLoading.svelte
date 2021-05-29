<script>
import { fade } from 'svelte/transition';
import Loader from '$lib/Loader.svelte';
</script>

<div 
    out:fade={{ duration: 300 }}
    class="absolute inset-0 bg-prim flex z-50">
    <div class="m-auto">
        <Loader/>
    </div>
</div>