// CRUD on bills
import db from './db';

export async function listBills(filters){

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