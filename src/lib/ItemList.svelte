<script>
export let bill;
</script>

<style>
th {
    @apply text-center text-gray-600 py-2;
}
td {
    @apply text-center py-2 font-light break-words;
}
tr {
    @apply py-4 w-full;
}
table tr:nth-child(odd){
    @apply bg-gray-100;
}
table tr:nth-child(even){
    @apply bg-white;
}
</style>
<div class="pt-2 pb-1">Item Details</div>
<div style="max-height:50vh;" class="relative overflow-auto rounded-t-lg">
	<table class="sticky top-0 bg-gray-100 w-full table-fixed">
		<tr class="">
			<th>Item</th>
			<th>MRP</th>
			<th>QTY</th>
			<th>NET Amt</th>
		</tr>
	</table>
	<table class="bg-gray-100 w-full table-fixed">
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
				<td class="flex" colspan="4"><img class="m-auto h-28" src="/loading.svg" alt="loading.."/></td>
			</tr>
		{/if}
	</table>
</div>
