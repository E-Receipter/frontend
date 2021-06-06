import {
  CacheableResponsePlugin
} from 'workbox-cacheable-response';
import {
  ExpirationPlugin
} from 'workbox-expiration';
import {
  registerRoute
} from 'workbox-routing';
import {
  StaleWhileRevalidate,
  CacheFirst
} from 'workbox-strategies';
import {
  precacheAndRoute
} from 'workbox-precaching';
import {
  timestamp
} from '$service-worker';
import {
  WASM_MODULE_JS,
  WASM_MODULE,
  PROTOBUFJS,
  PROTOFILE,
} from './settings.js';
import {
  importWASM,
  handleScan,
  generateImage,
} from './wasm.js';
import {
  getBill,
  delBill,
  listBills,
  updateBill,
} from './bill';

// load WASM Module JS
importWASM(self.importScripts);

//precache
precacheAndRoute([
  {
    url: '/',
    revision: timestamp,
  },
  {
    url: '/favicon.ico',
    revision: timestamp,
  },
  {
    url: '/manifest.json',
    revision: timestamp,
  },
  {
    url: PROTOFILE,
    revision: timestamp,
  },
  {
    url: PROTOBUFJS,
    revision: timestamp,
  },
  {
    url: WASM_MODULE_JS,
    revision: timestamp,
  },
  {
    url: WASM_MODULE,
    revision: timestamp,
  }
]);

// Cache Google Fonts with a stale-while-revalidate strategy, with
// a maximum number of entries.
registerRoute(
  ({
    url
  }) => url.origin === 'https://fonts.googleapis.com' ||
  url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20
      }),
    ],
  }),
);
// css and js
registerRoute(
  ({
    request
  }) => request.destination === 'script' ||
  request.destination === 'style',
  new StaleWhileRevalidate()
);
// images
registerRoute(
  ({
    request
  }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

//upload image
registerRoute(
  ({
    url
  }) => {
    return url.pathname === '/upload'
  },
  handleScan,
  'POST',
)

//get bill details
registerRoute(
  ({
    url
  }) => url.pathname === '/db/get',
  async ({
    url
  }) => {
    const id = Number(url.searchParams.get('id'));
    const data = await getBill(id);
    delete data.trueData;
    return new Response(JSON.stringify(data));
  }
)
//delete bill details
registerRoute(
  ({
    url
  }) => url.pathname === '/db/get',
  async ({
      url
    }) => {
      const id = Number(url.searchParams.get('id'));
      const data = await delBill(id);
      return new Response(JSON.stringify(data));
    },
    'DELETE'
)

//verify bill
registerRoute(
  ({
    url
  }) => url.pathname === '/db/verify',
  async ({
      url
    }) => {
      const id = Number(url.searchParams.get('id'));
      const data = await getBill(id);
      const array = data.trueData;
      const imgData = await generateImage(array);
      const formdata = new FormData();
      formdata.append('width',imgData.width);
      formdata.append('height',imgData.height);
      formdata.append('data',new Blob([imgData.data]))
      return new Response(formdata);
    },
)

//list bills
registerRoute(
  ({
    url
  }) => url.pathname === '/db',
  async ({
    url
  }) => {
    const filters = url.searchParams;
    const data = await listBills(filters);
    return new Response(JSON.stringify(data));
  },
)

//fix bill
registerRoute(
  ({
    url
  }) => url.pathname === '/db/fix',
  async ({
    url
  }) => {
    const id = Number(url.searchParams.get('id'));
    let data = await getBill(id);
    delete data.trueData;
    const res = await fetch(`https://e-receipter.github.io/shop-data/${data.shopId}.json`);
    if(res.ok){
      const shopData = await res.json();
      data.shopName = shopData.name;
      data.shopData = shopData;
      updateBill(id,{shopData,shopName:data.shopName});
    }
    return new Response(JSON.stringify(data));
  },
)

self.addEventListener('activate', () => {
  clients.claim();
  console.log('ready ayyi!');
});