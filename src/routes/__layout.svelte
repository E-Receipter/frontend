<script>
    import { page, navigating } from '$app/stores';
    import Header from '$lib/Header.svelte';
    import '../global.css';

    $: section = $page.path.split('/')[1];
</script>

{#if section}
<Header name={section}/>
{/if}
<slot/>