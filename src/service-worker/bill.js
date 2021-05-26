// CRUD on bills
import db from './db';

export function list(filters){

}

export function details(billId){

}

export function add(object){
    return db.bills.put(object);
}

export function del(billId){
    
}