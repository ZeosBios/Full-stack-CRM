import { Injectable } from "@angular/core";
import { Position, OrderPosition } from "../shared/interfaces"
import { Observable } from "rxjs";

@Injectable()
export class OrderService{

    public list: OrderPosition[] =[]
    public price = 0
    
    add(position: Position){

        const orderPosition: OrderPosition = Object.assign({}, {
            name: position.name,
            cost: position.cost,
            quantity: position.quantity,
            _id: position._id
        })
        const candidate = this.list.find(pos => pos._id === orderPosition._id)
        if (candidate) {
             candidate.quantity += orderPosition.quantity
        } else {
            this.list.push(orderPosition)
        }

        this.computePrice() 
    }

    remove(orederPosition: OrderPosition){
        const index = this.list.findIndex(pos => pos._id === orederPosition._id) 
        this.list.splice(index, 1)
        this.computePrice() 
    }

    clear(){
        this.list = []
        this.price = 0
    }

    private computePrice() {
        this.price = this.list.reduce((total, item) =>{
           return total += item.quantity * item.cost
        }, 0)
    } 
}