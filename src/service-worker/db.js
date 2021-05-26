//Manage indexDB
import Dexie from 'dexie';

const db = new Dexie('bills');
db.version(1).stores({
    bills: `++billId,id, shopId, trueData, datetime, *items`
});

export default db;