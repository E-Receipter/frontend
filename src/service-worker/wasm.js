import {WASM_MODULE_JS,WASM_MODULE,WASM_FOLDER,JABCODEREADER} from './settings';

let module = null;

export function importWASM(importer){
    importer(WASM_MODULE_JS);
    importer(JABCODEREADER);
}

async function loadWASM(){
    const req = await fetch(WASM_MODULE);
    const buffer = await req.arrayBuffer();
    module = await self.Module(
        {
            wasmBinary: buffer,
        }
    )
}

export async function handleScan({url, request, event, params}){
    if(!module)
        await loadWASM();
    return new Response(module._test(10,20).toString());
}