<script>
	import { goto } from '$app/navigation';
	export let bill;

	function gotoBill() {
		goto(`/bill?id=${bill.id}&back_page=list`);
	}
</script>

<div on:click={gotoBill} class="cursor-pointer w-full flex justify-between mt-1 py-4 border-b">
	<div class="text-left mr-4">
		<img
			alt="<logo>"
			class="float-left mr-4 h-16 rounded-lg"
			src={`https://e-receipter.github.io/shop-data/${bill.shopId}.png`} />
		<b class="text-lg">{bill.shopName}</b>
		<p class="font-light text-gray-600 flex justify-between">
			<span>{bill.totalQty} items</span>
			<span>
				{new Date(bill.datetime).toLocaleDateString('en', {
					weekday: 'short',
					month: 'short',
					day: 'numeric'
				})}
			</span>
		</p>
	</div>
	<div class="text-lg text-gray-600">
		<b>${bill.totalAmt.toFixed(2)}</b>
	</div>
</div>
