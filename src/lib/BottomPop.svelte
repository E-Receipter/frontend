<script>
import { createEventDispatcher,onMount } from 'svelte';
import { fly } from 'svelte/transition';
export let imgSrc;
export let title;
export let description;
export let noButton;
export let yesButton;

const dispatch = createEventDispatcher();
</script>

<style>
.noButton{
 @apply rounded-full bg-pureWhite text-prim border-prim border-2 px-6 py-2;
}
.yesButton{
@apply rounded-full bg-prim text-pureWhite border-pureWhite border-2 px-6 py-2;
}
</style>

<div transition:fly="{{ y: 200, duration: 500 }}"
    class="bg-white flex flex-col rounded-t-3xl fixed inset-x-0 bottom-0">
    <div class="flex flex-col justify-between py-4 mx-2">
        <img class="flex-1 mx-auto" style="max-width:50%;" src={imgSrc}/>
        <span class="flex-1 mx-auto my-2 text-center">{title}</span>
        <span class="flex-1 mx-auto text-gray-500 text-center">{description}</span>
    </div>
    <div class="flex justify-around pb-4">
        <button 
            class="noButton"
            on:click={e=>{dispatch('click',false);}}>{noButton}</button>
        <button 
            class="yesButton"
            on:click={e=>{dispatch('click',true);}}>{yesButton}</button>
    </div>
</div>