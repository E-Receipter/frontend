//Manage indexDB
import Dexie from 'dexie';

const db = new Dexie('bills');
db.version(1).stores({
    bills: `++billId,id, shopId, trueData, datetime, *items, totalAmt, totalQty`
});
// trueData is UInt32Array
export default db;