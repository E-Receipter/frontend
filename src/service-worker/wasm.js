import {WASM_MODULE_JS,WASM_MODULE,WASM_FOLDER,JABCODEREADER} from './settings';

let module = null;

export function importWASM(importer){
    importer(WASM_MODULE_JS);
    console.log(self.Module);
    importer(JABCODEREADER);
    loadWASM();
}

async function loadWASM(){
    const req = await fetch(WASM_MODULE);
    console.log(req);
    const buffer = await req.arrayBuffer();
    console.log(buffer.byteLength);
    module = await self.Module(
        {
            wasmBinary: buffer,
        }
    )
}

export async function handleScan({url, request, event, params}){
    return new Response(module._test(10,20).toString());
}