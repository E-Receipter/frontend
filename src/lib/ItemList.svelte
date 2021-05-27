<script>
export let bill;
</script>

<style>
th {
    @apply text-right text-gray-600 p-2;
}
td {
    @apply text-left p-2 font-light;
}
td.numeric{
	@apply text-right;
}
tr {
    @apply py-4 flex justify-evenly w-full;
}
tr:nth-child(odd){
    @apply bg-gray-200;
}
tr:nth-child(even){
    @apply bg-white;
}
</style>
<div class="pt-2 pb-1">Item Details</div>
<div style="max-height:60vh;" class="relative overflow-auto rounded-t-lg">
	<table class="bg-gray-200 w-full">
		<tr class="sticky top-0">
			<th>Item</th>
			<th>MRP</th>
			<th>QTY</th>
			<th>NET Amt</th>
		</tr>
		{#if bill}
			{#each bill.items as item}
				<tr>
					<td>{item.name}</td>
					<td class="numeric">{item.price.toFixed(2)}</td>
					<td class="numeric">{item.qty}</td>
					<td class="numeric"><b>{(item.price * item.qty).toFixed(2)}</b></td>
				</tr>
			{/each}
		{:else}
			<tr>
				<td colspan="4">No data available!</td>
			</tr>
		{/if}
	</table>
</div>
