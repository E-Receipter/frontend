<script>
</script>

<style>
.flex-2{
    flex:2;
}
</style>

<div class="flex flex-col h-screen w-screen">
    <div class="flex flex-2 p-8 bg-prim">
        <img src="main.svg" alt=""/>
    </div>
    <div class="flex flex-1 justify-center font-medium">
        <div class="m-auto flex flex-col justify-center">
            <a href="/scan"
            class="flex justify-around rounded-full bg-prim text-pure-white px-6 py-2">
                <img class="mr-1" src="scanIcon.svg" alt=""/>
                <span class="ml-1">Scan</span>
            </a>
            <div class="flex mt-2">
                <a href="/list" class="mx-auto text-prim">view my bills</a>
            </div>
        </div>
    </div>
</div>