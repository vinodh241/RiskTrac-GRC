import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-action-items-bar-chart',
  templateUrl: './action-items-bar-chart.component.html',
  styleUrls: ['./action-items-bar-chart.component.scss'],
})
export class ActionItemsBarChartComponent {
  @Input() openActionItemsBarChartData: any = [];
  @Input() chartID: any = '';

  constructor() {}

  ngOnChanges(): void {
    setTimeout(() => this.loadChart(), 100);
  }

  ngOnInit() {}

  loadChart() {
    let self = this;
    (Highcharts as any).chart(this.chartID, {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      style: {
        fontFamily: 'Roboto',
      },
      title: {
        text:''
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        outside: false,
        isHTML: true,
        format:
          '<b><span style="color:{point.color}; font-size: 24px;">\u25CF</span> <div style="color: #ffffff">{point.name}:<br><span font-size: 24px;">Count:</span> <div style="color:{point.color}">{point.y}</div>',
        followPointer: false,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        style: {
          fontSize: '1.5vh',
        },
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontWeight: 'bold',
            fontSize: '1.5vh',
          },
        },
        lineWidth: 0,
        height:'100%'
      },
      yAxis: {
        min: 0,
        tickAmount: 5, // Set the number of ticks to control spacing
        opposite: true,
        tickPixelInterval: 150,
        title: {
          text: null,
        },

      },
      plotOptions: {
        series: {
          groupPadding: 0,
          borderWidth: 0,
          colorByPoint: true,
          dataLabels: {
            enabled: true,
          },
          dataSorting: {
            enabled: true,
            matchByName: true,
          },
          pointWidth: 15, // Set a fixed point width for all bars
          pointPadding: 0.2,
        },
        bar: {
          borderRadius: '500',
          dataLabels: {
            enabled: true,
            backgroundColor: 'none',
            style: {
              fontWeight: 'bold',
            },
          },
        },
      },
      series: [
        {
          name: 'Count',
          data: self.openActionItemsBarChartData,
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 450,
            },
          },
        ],
      },
    });
  }
}
