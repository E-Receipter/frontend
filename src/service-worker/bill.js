// CRUD on bills
import db from './db';

function filterObject(array, keys) {
    for (let obj of array) {
        for (let key of keys)
            delete obj[key];
    }
    return array;
}

export async function listBills(filters) {
    const dateAfter = Number(filters.get('date_after'));
    const dateBefore = Number(filters.get('date_before'));

    const shopName = filters.get('shop_name');

    const itemName = filters.get('item_name');

    let query = db.bills;
    if (dateAfter)
        query = query.where('datetime').above(dateAfter);
    if (dateBefore)
        query = query.where('datetime').below(dateBefore);
    if(shopName)
        query = query.where('shopName').equalsIgnoreCase(shopName);
    if (itemName) {
        const itemNameUp = itemName.toUpperCase();
        query = query.filter((bill) => {
            for (let item of bill.items) {
                if (item.name.toUpperCase().indexOf(itemNameUp) != -1)
                    return true;
            }
        });
    }
    query = await query.reverse().sortBy('datetime');
    return filterObject(query, ['trueData']);
}

export async function getBill(id) {
    return await db.bills.get(id);
}

export async function addBill(object) {
    return await db.bills.put(object);
}

export async function delBill(id) {
    return await db.bills.delete(id);
}

export async function updateBill(id,changes) {
    return await db.bills.update(id,changes);
}