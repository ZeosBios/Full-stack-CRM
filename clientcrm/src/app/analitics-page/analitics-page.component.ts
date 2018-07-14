import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import {Chart} from 'chart.js'
import { AnalitycsPage } from '../shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analitics-page',
  templateUrl: './analitics-page.component.html',
  styleUrls: ['./analitics-page.component.css']
})
export class AnaliticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef:ElementRef
  @ViewChild('order') orderRef:ElementRef

  aSub: Subscription
  average: number
  pending = true

  constructor(private analyticsService: AnalyticsService) { }

  ngOnDestroy() {
    if (this.aSub) {
    this.aSub.unsubscribe()
    }
  }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(255, 99, 132)',
    }

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)',
    }
    
    this.aSub = this.analyticsService.getAnalytics().subscribe(
      (data: AnalitycsPage) => {
        this.average = data.average
        gainConfig.labels = data.chart.map(item => item.label)
        gainConfig.data = data.chart.map(item => item.gain)

        orderConfig.labels = data.chart.map(item => item.label)
        orderConfig.data = data.chart.map(item => item.order)

        const gainContext = this.gainRef.nativeElement.getContext('2d')
        gainContext.canvas.height = '300px'

        const orderContext = this.orderRef.nativeElement.getContext('2d')
        orderContext.canvas.height = '300px'

        new Chart(gainContext, createChartCongig(gainConfig))
        new Chart(orderContext, createChartCongig(orderConfig))
        
        this.pending = false
      })
  }
}

function createChartCongig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data, 
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }

  }
}
