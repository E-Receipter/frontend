<script context="module">
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
    export let bill;
    export let shop;
</script>

<style>
.h-83v{
    height: 83.3vh;
}
</style>

<div class="flex flex-col justify-between h-83v">
<div class="flex-1">shop:<br/>{JSON.stringify(shop)}</div>
<div class="flex-1">bill:<br/>{JSON.stringify(bill)}</div>
</div>