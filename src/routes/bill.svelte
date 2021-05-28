<script context="module">
    // TODO
    // remove shopData loading. to avoid fake bill making

    export async function load({ page, fetch, session, context }) {
        let shopData = null;
        let billData = null;
        const shopId = page.query.get('shopId');
        const billId = page.query.get('billId');
        if(typeof window !== 'undefined'){
            billData = await fetch(`/db/get?billId=${billId}`);
        }
        shopData = await fetch(`https://e-receipter.github.io/shop-data/${shopId}.json`);
        if (shopData.ok) {
            return {
                props: {
                    bill: (billData)?await billData.json():null,
                    shop:{
                        shopId,
                        ...await shopData.json()
                        },
                }
            };
        }
        return {
            status: shopData.status,
            error: new Error(`Could not load`),
        };
    }
</script>

<script>
    import { goto } from '$app/navigation';
    import ItemList from '$lib/ItemList.svelte';
    import BottomPop from '$lib/BottomPop.svelte';
    export let bill;
    export let shop;

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

<div class="flex flex-col m-2">
    <div class="flex flex-col font-light">
        <div>
        <img alt='<logo>' 
            class="float-left mr-4 h-16" 
            src="{`https://e-receipter.github.io/shop-data/${shop.shopId}.png`}"
            />
        <b class="">{shop.name}</b>
        <p class="font-medium text-sm">{shop.address}</p>
        </div>
        <div class="flex justify-between mt-2 py-2 border-t border-dashed border-black">
            <span>Contact no: {shop.phone}</span>
            <span>GSTIN: {shop.gstin}</span>
        </div>
        {#if bill}
            <div class="flex justify-between border-black border-t border-b border-dashed py-2">
                <span>Date: {new Date(bill.datetime).toDateString()}</span>
                <span>Time: {new Date(bill.datetime).toLocaleTimeString()}</span>
            </div>
        {/if}
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
                    <td colspan="2">no data available!</td>
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