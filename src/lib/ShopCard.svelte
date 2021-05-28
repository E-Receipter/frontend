<script>
export let bill;
</script>
{#if bill}
    <div>
        <img
            alt="<logo>"
            class="float-left mr-4 h-16"
            src={`https://e-receipter.github.io/shop-data/${bill.shopId}.png`} />
        <b class="">{bill.shopData.name}</b>
        <p class="font-medium text-sm">{bill.shopData.address}</p>
    </div>
    <div class="flex justify-between mt-2 py-2 border-t border-dashed border-black">
        <span>Contact no: {bill.shopData.phone}</span>
        <span>GSTIN: {bill.shopData.gstin}</span>
    </div>
    <div class="flex justify-between border-black border-t border-b border-dashed py-2">
        <span>Date: {new Date(bill.datetime).toDateString()}</span>
        <span>Time: {new Date(bill.datetime).toLocaleTimeString()}</span>
    </div>
{:else}
    <div class="w-full h-28 mx-2 flex">
        <img class="m-auto h-28" src="/loading.svg" alt="loading.."/>
    </div>
{/if}
