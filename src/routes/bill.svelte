<script>
	import { onMount } from 'svelte';
	import { pageTransitionDelay, pageTransitionDuration } from '$lib/uiSettings.js';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import ItemList from '$lib/ItemList.svelte';
	import ShopCard from '$lib/ShopCard.svelte';
	import BottomPop from '$lib/BottomPop.svelte';
	import VerifyBottomPop from '$lib/VerifyBottomPop.svelte';
	let bill = null;
	let backPage = false;

	async function loadBill(id){
		const res = await fetch(`/db/get?id=${id}`);
		if (res.ok) {
			bill = await res.json();
			if((!bill.shopName)&&(navigator.onLine)){
				fixBill(id);
			}
		} else {
			bill = null;
		}
	}

	async function fixBill(id){
		const res = await fetch(`/db/fix?id=${id}`);
		if (res.ok) {
			bill = await res.json();
		} else {
			bill = null;
		}
	}

	onMount(async () => {
		const query = new URLSearchParams(window.location.search);
		const id = query.get('id');
		backPage = Boolean(query.get('back_page'));
		await loadBill(id);
	});

	let delPopUp = false;
	let deleteResolve = null;
	async function deleteBill() {
		const deletePromise = new Promise(resolve => {
			deleteResolve = resolve;
		});
		delPopUp = true;
		const deleteReturn = await deletePromise;
		if (deleteReturn) {
			const res = await fetch(`/db/get?id=${bill.id}`, { method: 'DELETE' });
			if (res.ok) {
				if(backPage){
					window.history.back();
				}else{
					goto('/');
				}
			}
		}
		delPopUp = false;
	}
	async function saveBill() {
		goto('/');
	}

	let verifyPopUp = false;
	let verifyResolve = null;
	async function verifyBill(){
		const verifyPromise = new Promise(resolve =>{
			verifyResolve = resolve;
		});
		verifyPopUp = true;
		const verifyReturn  = await verifyPromise;
		verifyPopUp = false;
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
	in:fly={{ x: 200, duration: pageTransitionDuration, delay: pageTransitionDelay }}
	out:fly={{ x: 200, duration: pageTransitionDelay }}
	class="flex flex-col m-2">
	<div class="flex flex-col font-light">
		<ShopCard {bill} />
	</div>
	<div class="">
		<div class="mx-2">
			<ItemList {bill} />
			<div class="flex justify-around p-4 bg-gray-100 rounded-b-lg">
				<button class="noButton" on:click={deleteBill}>Delete</button>
				{#if !backPage}
					<button class="yesButton" on:click={saveBill}>Save</button>
				{/if}
				{#if backPage}
					<button class="yesButton" on:click={verifyBill}>Verify</button>
				{/if}
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
					<td>
						<b>{bill.totalQty}</b>
					</td>
					<td class="text-green-500">
						<b> ₹ {bill.totalAmt.toFixed(2)}</b>
					</td>
				</tr>
			{:else}
				<tr>
					<td class="flex" colspan="2">
						<img class="m-auto h-28" src="/loading.svg" alt="loading.." />
					</td>
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
		on:click={e => deleteResolve(e.detail)} />
{/if}
{#if verifyPopUp}
	<VerifyBottomPop id={bill.id} on:click={e => verifyResolve(e.detail)}/>
{/if}