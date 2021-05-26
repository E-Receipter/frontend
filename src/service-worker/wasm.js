import {WASM_MODULE_JS,WASM_MODULE,PROTOBUFJS,PROTOFILE,JABCODEREADER} from './settings';
import db from './db';
// import protobuf from 'protobufjs';

let module = null;
let proto = null;
let ebillType = null;
let billType = null;
let decoder = null;

export function importWASM(importer){
    importer(WASM_MODULE_JS);
    importer(JABCODEREADER);
    importer(PROTOBUFJS);
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

async function loadProtoBuf(){
    const file = await fetch(PROTOFILE);
    const string = await file.text();
    proto = (await protobuf.parse(string)).root;
    ebillType = proto.lookupType("EncryptedBill");
    billType = proto.lookupType("Bill");
}

function getImageData(buffer,width,height){
    const array = new Uint8ClampedArray(buffer);
    return new ImageData(array,width,height);
}

async function jabDecode(imgData,width,height){
    let value = [];
    if(!module)
        await loadWASM();
    if(!decoder){
        decoder = new JABCodeDecoder(module,width,height);
    }
    else if((decoder.width!=width)||(decoder.height!=height)){
        decoder.clean();
        decoder = new JABCodeDecoder(module,width,height);
    }
    value = decoder.decode(imgData);
    return (value.length>0)?value:null;
}

async function protoBufDecode(value){
    if(!proto)
        await loadProtoBuf();
    const ebill = ebillType.toObject(ebillType.decode(value))
    const bill = billType.toObject(billType.decode(ebill.encryptedBill))
    return {
        trueData: value,
        shopId: ebill.shopId,
        ...bill,
    }
}

export async function handleScan({url, request}){
    let ans = '{}';
    const width = url.searchParams.get('width');
    const height = url.searchParams.get('height');
    let imgData = getImageData(await request.arrayBuffer(),width,height);
    let value = await jabDecode(imgData,width,height);
    if(!value)
        return new Response(ans);
    ans = await protoBufDecode(value);
    return new Response(JSON.stringify(ans));
}