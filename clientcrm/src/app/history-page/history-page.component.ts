import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order, Filter } from '../shared/interfaces';

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('toolTip') toolTipRef: ElementRef
  toolTip: MaterialInstance 
  isFilterVisible = false
  oSub: Subscription
  offset = 0
  limit = STEP
  orders: Order[] = []
  loading = false
  reloding = false  
  noMoreOrders = false
  filter: Filter = {}  
  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.reloding = true
    this.fetch()
  }

  private fetch(){
   const params = Object.assign( {}, this.filter, {
    offset: this.offset,
    limit: this.limit
   })
    this.oSub = this.ordersService.fetch(params).subscribe(
      orders => {
        this.orders = this.orders.concat(orders)
        this.noMoreOrders = orders.length < STEP
        this.loading = false
        this.reloding = false
      }
    )
  }

  ngOnDestroy(){
    this.toolTip.destroy()
    if (this.oSub){
      this.oSub.unsubscribe()
    }
  }

  ngAfterViewInit(){
    this.toolTip = MaterialService.initToolTip(this.toolTipRef)
  }

  loadMore(){
    this.loading = true
    this.offset += STEP
    this.fetch()
  }

  applyFilter(filter: Filter){
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloding = true
    this.fetch()
  }

  isFiltered():boolean {
    return Object.keys(this.filter).length !== 0 
  }
}
