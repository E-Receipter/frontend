<script>
	export let bgClass;
	export let content;
</script>

<div class={`${bgClass} rounded-full`}>
	{@html content}
</div>
