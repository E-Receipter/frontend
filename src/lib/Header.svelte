<script>
import { map } from "$lib/name_map.js";
export let name;
$: fullName = map[name];
</script>

<style>

</style>

<div class="flex w-full h-1/6 bg-prim text-pure-white py-2 rounded-b-sm">
    <img src="chevron.svg" alt="<"/>
    <div class="flex-1 flex"><span class="mx-auto">{fullName}</span></div>
    <img class="opacity-0" src="chevron.svg" alt="<"/>
</div>