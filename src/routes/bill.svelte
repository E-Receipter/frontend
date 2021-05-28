<script>
    import {onMount} from 'svelte';
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import ItemList from '$lib/ItemList.svelte';
    import ShopCard from '$lib/ShopCard.svelte';
    import BottomPop from '$lib/BottomPop.svelte';
    let bill = null;

    onMount(async() => {
        const query = new URLSearchParams(window.location.search);
        const billId = query.get('billId');
        const res = await fetch(`/db/get?billId=${billId}`);
        if(res.ok){
            bill = await res.json();
        }else{
            bill = null;
        }
    })

    let delPopUp = false;
    let deleteResolve = null;
    async function deleteBill(){
        const deletePromise = new Promise((resolve)=>{deleteResolve=resolve});
        delPopUp = true;
        const deleteReturn = await deletePromise;
        if(deleteReturn){
            const res = await fetch(`/db/get?billId=${bill.billId}`,{method:'DELETE'});
            if(res.ok){
                goto('/');
            }
        }
        delPopUp = false;
    }
    async function saveBill() {
        goto('/');
    }
</script>

<style>
th {
    @apply text-center;
}
td {
    @apply text-center;
}
</style>

<div 
    in:fly="{{ x: 200, duration: 500,delay:500 }}"
    out:fly="{{ x: 200, duration: 500 }}"
    class="flex flex-col m-2">
    <div class="flex flex-col font-light">
        <ShopCard bill={bill}/>
    </div>
    <div class="">
        <div class="mx-2">
            <ItemList bill={bill}/>
            <div class="flex justify-around p-4 bg-gray-100 rounded-b-lg">
                <button class="noButton" on:click={deleteBill}>Delete</button>
                <button class="yesButton" on:click={saveBill}>Save</button>
            </div>
        </div>
    </div>
    <div class="rounded-lg m-2 p-2 border bg-gray-100">
        <table class="w-full">
            <tr>
                <th>Total Qty</th>
                <th>Total Price</th>
            </tr>
            {#if bill}
                <tr>
                    <td><b>{bill.totalQty}</b></td>
                    <td class="text-green-500"><b>{bill.totalAmt.toFixed(2)}</b></td>
                </tr>
            {:else}
                <tr>
                    <td class="flex" colspan="2"><img class="m-auto h-28" src="/loading.svg" alt="loading.."/></td>
                </tr>
            {/if}
        </table>
    </div>
</div>
{#if delPopUp}
    <BottomPop
        imgSrc="delete.png"
        title="Are you sure?"
        description="Deletion is a permanent action"
        noButton="Cancel"
        yesButton="Delete"
        on:click={e=> deleteResolve(e.detail)}
        />
{/if}