<script>
import { fade } from 'svelte/transition';
import { onMount } from 'svelte';
let billList = [];

onMount(async ()=>{
    const res = await fetch('/db');
    if(res.ok){
        billList = await res.json();
    }
});
</script>

<div 
    in:fade="{{ duration: 500,delay:500 }}" 
    out:fade="{{ duration: 500 }}"
    class="flex flex-col">
    {JSON.stringify(billList)}
</div>