<script>
export let bill;
</script>

<style>
th {
    @apply text-left text-gray-600 p-2;
}
td {
    @apply text-left p-2 font-light;
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
<table style="max-height:50vh;" class="bg-gray-200 rounded-t-lg flex flex-col w-full shadow-md overflow-auto">
	<tr>
		<th>Item</th>
		<th>MRP</th>
		<th>QTY</th>
		<th>NET Amt</th>
	</tr>
	{#if bill}
		{#each bill.items as item}
			<tr>
				<td>{item.name}</td>
				<td>{item.price.toFixed(2)}</td>
				<td>{item.qty}</td>
				<td><b>{(item.price * item.qty).toFixed(2)}</b></td>
			</tr>
		{/each}
	{:else}
		<tr>
			<td colspan="4">No data available!</td>
		</tr>
	{/if}
</table>
