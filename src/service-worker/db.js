//Manage indexDB
//TODO
//add signature to db to avoid fake bill making
import Dexie from 'dexie';

const db = new Dexie('bills');
db.version(1).stores({
    bills: `
        ++id,
        billId,
        datetime, 
        totalAmt, 
        totalQty,
        shopId,
        shopName
    `, // dont end with , causes error
});
//*items is [{name,price,qty}...]
// trueData is UInt32Array
// shopData is object
export default db;