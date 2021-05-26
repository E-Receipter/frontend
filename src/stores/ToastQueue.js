import { writable } from 'svelte/store';

function createToastQueue(){
    const { subscribe, update } = writable([]);

    function pop(index){
        update(
            (value)=>{
                value.pop(index);
                return value;
            }
        )
    }
    function push(object){
        update(
            (value)=>{
                value.push(object);
                return value;
            }
        )
    }
    return {
        subscribe,
        push,
        pop,
    }
}

export const toastQueue = createToastQueue();