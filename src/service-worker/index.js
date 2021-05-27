import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate,CacheFirst} from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { build, timestamp } from '$service-worker';
import { WASM_MODULE_JS,WASM_MODULE } from './settings.js';
import { importWASM,handleScan } from './wasm.js';
import { getBill,delBill,listBills } from './bill';
import { list } from 'postcss';
// load WASM Module JS
importWASM(self.importScripts);

// //precache
// precacheAndRoute([
//     ...build.map((url) => {
//         return {
//             url:url,
//             revision: timestamp,
//         }
//     }),
//     {
//         url:WASM_MODULE_JS,
//         revision: timestamp,
//     },
//     {
//         url:WASM_MODULE,
//         revision: timestamp,
//     }
// ]);

// // Cache Google Fonts with a stale-while-revalidate strategy, with
// // a maximum number of entries.
// registerRoute(
//   ({url}) => url.origin === 'https://fonts.googleapis.com' ||
//              url.origin === 'https://fonts.gstatic.com',
//   new StaleWhileRevalidate({
//     cacheName: 'google-fonts',
//     plugins: [
//       new ExpirationPlugin({maxEntries: 20}),
//     ],
//   }),
// );
// // css and js
// registerRoute(
//     ({request}) => request.destination === 'script' ||
//                    request.destination === 'style',
//     new StaleWhileRevalidate()
// );
// // images
// registerRoute(
//     ({request}) => request.destination === 'image',
//     new CacheFirst({
//       cacheName: 'images',
//       plugins: [
//         new CacheableResponsePlugin({
//           statuses: [0, 200],
//         }),
//         new ExpirationPlugin({
//           maxEntries: 60,
//           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//         }),
//       ],
//     }),
//   );

//upload image
registerRoute(
    ({ url })=>{return url.pathname === '/upload'},
    handleScan,
    'POST',
)

//get bill details
registerRoute(
  ({url}) => url.pathname === '/db/get',
  async ({url}) => {
    const billId = Number(url.searchParams.get('billId'));
    const data = await getBill(billId);
    delete data.trueData;
    return new Response(JSON.stringify(data));
  }
)
//delete bill details
registerRoute(
  ({url}) => url.pathname === '/db/get',
  async ({url}) => {
    const billId = Number(url.searchParams.get('billId'));
    const data = await delBill(billId);
    return new Response(JSON.stringify(data));
  },
  'DELETE'
)
//list bills
registerRoute(
  ({url}) => url.pathname === '/db',
  async ({url}) => {
    const filters = url.searchParams;
    const data = await listBills(filters);
    return new Response(JSON.stringify(data));
  },
)
