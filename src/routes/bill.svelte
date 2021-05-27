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
    import ItemList from '$lib/ItemList.svelte';
    export let bill;
    export let shop;
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
            class="float-left mr-4 h-4" 
            src="{`https://e-receipter.github.io/shop-data/${shop.shopId}.png`}"
            />
        <b class="">{shop.name}</b>
        <p class="font-medium text-sm">{shop.address}</p>
        </div>
        <div class="flex justify-between">
            <span>Contact no: {shop.phone}</span>
            <span>GSTIN: {shop.gstin}</span>
        </div>
        {#if bill}
            <div class="flex justify-between">
                <span>Date: {bill.datetime}</span>
                <span>Time: {bill.datetime}</span>
            </div>
        {/if}
    </div>
    <div class="">
        <div class="mx-2">
            <ItemList bill={bill}/>
            <div class="flex justify-around p-4 bg-gray-200 rounded-b-lg">
                <button class="noButton">Delete</button>
                <button class="yesButton">Save</button>
            </div>
        </div>
    </div>
    <div class="rounded-md shadow-lg m-2">
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