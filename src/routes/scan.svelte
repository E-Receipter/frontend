<script>
import { goto } from '$app/navigation';
import { fade } from 'svelte/transition';
import {onMount,onDestroy} from 'svelte';
import Loader from '$lib/Loader.svelte';
import BottomPop from '$lib/BottomPop.svelte';
let DOMready;
let stream;
let video;
let msg='';
let canvas;

let videoOrCanvas = true;
let loading = false;
let error = false;
let errorResolve = null;

async function stopVideo(){
    if(stream){
        // const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        // video.srcObject = null;
    }
}

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

onDestroy(async () =>{
    try{
        await stopVideo();
    }catch(e){
        msg = e;
        console.log(e);
    }
})

async function takePicture(){
    videoOrCanvas=false;
    var ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(
        video,0,0,canvas.width,canvas.height,
    );

    if(!await decodeBill(
        canvas.width, 
        canvas.height,
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
            )
        )
    ){
        //Remove after making BottomPop buttons working
        await stopVideo();
    }
}

async function decodeBill(width,height,imgData){
    loading = true;
    let res = null;
    try{
        res = await fetch(
            `/upload?width=${width}&height=${height}`,
            {
                method:'POST',
                body:imgData.data.buffer
            });
    }catch(e){
        loading = false;
        handleError();
        return null;
    }
    if(res.status!=200){
        loading = false;
        handleError();
        return null;
    }
    const {billId} = await res.json();
    goto(`/bill?billId=${billId}`);
    loading = false;
}

async function handleError(){
    const errorPromise = new Promise((resolve)=> errorResolve = resolve );
    error=true;
    if(await errorPromise){
        //try again
        await loadCam();
        videoOrCanvas=true;
    }else {
        //Cancel
        goto('/');
    }
    error = false;
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
<div class="hidden p-1 p-5 p-4 p-0"></div>
<div 
    in:fade="{{ duration: 500,delay:500 }}"
    out:fade="{{ duration: 500 }}"
    class="flex flex-col h-5/6 w-full">
    {msg}
    <video 
        alt="loading..." 
        bind:this={video} 
        class:hidden={!videoOrCanvas} 
        class="h-full w-full"/>
    <canvas 
        bind:this={canvas} 
        class:hidden={videoOrCanvas} 
        class=""/>
    <div class="absolute z-100 flex inset-x-0 bottom-3">
        <button
            class:p-5={videoOrCanvas}
            class:p-1={!videoOrCanvas}
            class="transition-all duration-500 bounce rounded-full m-auto bg-prim ring-2 ring-prim ring-offset-2" 
            on:click={takePicture}>
        </button>
    </div>
</div>
{#if error}
<BottomPop
    imgSrc="scanFailed.png"
    title="Scan Failed"
    description="Oops Sorry, we are not able to get the Jab code, hold tight and try again"
    noButton="Cancel"
    yesButton="Try again!"
    on:click={e=> errorResolve(e.detail)}
    />
{/if}