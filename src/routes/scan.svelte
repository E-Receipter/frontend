<script>
import adapter from 'webrtc-adapter';
import {onMount,onDestroy} from 'svelte';
import Loader from '$lib/Loader.svelte';
let DOMready;
let stream;
let video;
let msg='';
let canvas;

let videoOrCanvas = true;
let loading = false;

async function loadCam(){
    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if(!getUserMedia){
        msg="no user media";
        console.log("no user media");
        return;
    }
    stream = await new Promise(
        (resolve,reject)=>{
            getUserMedia.call(navigator,{
                video:{
                    facingMode: {
                            ideal: "environment" 
                        },
                    height: {
                        ideal: 1080,
                    }
                    },
                audio:false,
            },
            resolve,
            reject);
        }
    );
    video.srcObject = stream;
    video.play();
}
onMount(async ()=>{
    try{
        await loadCam();
    }catch(e){
        msg = e;
        console.log(e);
    }
})

async function takePicture(){
    videoOrCanvas=!videoOrCanvas;
    var ctx = canvas.getContext('2d');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx.drawImage(
        video,0,0,canvas.width,canvas.height,
    );
    decodeBill(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

async function decodeBill(imgData){
    loading = !loading;
    const res = await fetch('/upload',{method:'POST',body:imgData});
    msg = res.body.json();
}

</script>

<style>
.bounce {
    transition-timing-function: cubic-bezier(.6,-0.51,.57,1);
}
</style>

{#if loading}
<Loader/>
{/if}

<div class="flex flex-col h-5/6 w-full">
    {msg}
    <video 
        alt="loading..." 
        bind:this={video} 
        class:hidden={!videoOrCanvas} 
        class="h-full w-full"/>
    <canvas 
        bind:this={canvas} 
        class:hidden={videoOrCanvas} 
        class="h-full w-full"/>
    <div class="absolute z-100 flex inset-x-0 bottom-3">
        <button
            class:p-1={videoOrCanvas} 
            class:p-5={!videoOrCanvas} 
            class="transition-all duration-500 bounce rounded-full m-auto bg-prim" 
            on:click={takePicture}>
            <div 
                class="transition-all duration-500 bounce rounded-full border-2 border-white m-1"
                class:p-4={videoOrCanvas} 
                class:p-0={!videoOrCanvas}
                class:border-transparent={!videoOrCanvas}
                >
            </div>
        </button>
    </div>
    
</div>