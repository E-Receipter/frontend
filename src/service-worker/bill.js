// CRUD on bills
import db from './db';

function filterObject(array,keys){
    for(let obj of array){
        for(let key of keys)
            delete obj[key];
    }
    return array;
}

export async function listBills(filters){
    const date_after = Number(filters.get('date_after'));
    const date_before = Number(filters.get('date_before'));

    const shop_name = filters.get('shop_name');

    const item_name = filters.get('item_name');

    let query = db.bills;
    if(date_after)
        query = query.where('datetime').above(date_after);
    if(date_before)
        query = query.where('datetime').below(date_before);
    if(item_name){
        const item_name_up = item_name.toUpperCase();
        query = query.filter((bill)=>{
            for(let item of bill.items){
                if(item.name.toUpperCase().indexOf(item_name_up) != -1)
                    return true;
            }
        });
    }
    return filterObject(await query.toArray(),['trueData']);
}

export async function getBill(billId){
    return await db.bills.get(billId);
}

export async function addBill(object){
    return await db.bills.put(object);
}

export async function delBill(billId){
    return await db.bills.delete(billId);
}