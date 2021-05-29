import {
    WASM_MODULE_JS,
    WASM_MODULE,
    PROTOBUFJS,
    PROTOFILE,
    JABCODEREADER
} from './settings';
import {
    addBill
} from './bill';
// import protobuf from 'protobufjs';

let module = null;
let proto = null;
let ebillType = null;
let billType = null;
let decoder = null;

export function importWASM(importer) {
    importer(WASM_MODULE_JS);
    importer(JABCODEREADER);
    importer(PROTOBUFJS);
}

async function loadWASM() {
    const req = await fetch(WASM_MODULE);
    const buffer = await req.arrayBuffer();
    module = await self.Module({
        wasmBinary: buffer,
    })
}

async function loadProtoBuf() {
    const file = await fetch(PROTOFILE);
    const string = await file.text();
    proto = (await protobuf.parse(string)).root;
    ebillType = proto.lookupType("EncryptedBill");
    billType = proto.lookupType("Bill");
}

function getImageData(buffer, width, height) {
    const array = new Uint8ClampedArray(buffer);
    return new ImageData(array, width, height);
}

async function jabDecode(imgData, width, height) {
    let value = [];
    if (!module)
        await loadWASM();
    if (!decoder) {
        decoder = new JABCodeDecoder(module, width, height);
    } else if ((decoder.width != width) || (decoder.height != height)) {
        decoder.clean();
        decoder = new JABCodeDecoder(module, width, height);
    }
    value = decoder.decode(imgData);
    if (value.length > 0)
        return value;
    return null;
}

async function protoBufDecode(value) {
    if (!proto)
        await loadProtoBuf();
    const ebill = ebillType.toObject(ebillType.decode(value))
    const bill = billType.toObject(billType.decode(ebill.encryptedBill))
    return {
        trueData: new Uint32Array(value),
        shopId: ebill.shopId,
        ...bill,
    }
}

async function expandData(data) {
    let totalAmt = 0,
        totalQty = 0;
    for (let item of data.items) {
        totalQty += item.qty;
        totalAmt += item.price * item.qty;
    }
    const res = await fetch(`https://e-receipter.github.io/shop-data/${data.shopId}.json`);
    if (res.ok) {
        const shopData = await res.json();
        return {
            ...data,
            totalAmt,
            totalQty,
            shopName: shopData.name,
            shopData,
        }
    } else {
        return {
            ...data,
            totalAmt,
            totalQty,
            shopName: null,
            shopData: null,
        };
    }
}

export async function handleScan({
    url,
    request
}) {
    let res = '{}';
    const width = url.searchParams.get('width');
    const height = url.searchParams.get('height');
    let imgData = getImageData(await request.arrayBuffer(), width, height);
    let value = await jabDecode(imgData, width, height);
    if (!value)
        return new Response(res, {
            status: 500,
            statusText: 'Scan Failed'
        });
    const decoded = await protoBufDecode(value);
    res = await expandData(decoded);
    if (!res)
        return new Response(res, {
            status: 500,
            statusText: 'shop data fetch failed'
        });
    return new Response(
        JSON.stringify({
            id: await addBill(res),
        })
    );
}