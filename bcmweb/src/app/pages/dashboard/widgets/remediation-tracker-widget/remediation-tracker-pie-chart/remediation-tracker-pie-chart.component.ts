import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-remediation-tracker-pie-chart',
  templateUrl: './remediation-tracker-pie-chart.component.html',
  styleUrls: ['./remediation-tracker-pie-chart.component.scss'],
})
export class RemediationTrackerPieChartComponent {
  @Input() actionItemsPieChartData: any[] = [];
  @Input() chartID: any = '';

  constructor() {}

  ngOnInit() {}

  ngOnChanges(): void {
    setTimeout(() => this.loadChart(), 100);
  }

  loadChart() {
    let self = this;
    (Highcharts as any).chart(this.chartID, {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      style: {
        fontFamily: 'Roboto',
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        labelFormat: '{name}:<b> {y} </b>',
        itemStyle: {
          color: '#000000',
          fontSize: '8px',
      },
      },
      title: {
        text: '',
      },
      tooltip: {
        enabled: true,
        outside: false,
        isHTML:true,
        format : '<b><span style="color:{point.color}; font-size: 20px;">\u25CF</span> <div style="color: #ffffff">{point.name}:<br><span font-size: 20px;">Count:</span> <div style="color:{point.color}">{point.y}</div>',
        followPointer: false,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        style: {
          fontSize: '10px'
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'auto',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
            distance: -2,
            itemStyle: {
              color: '#000000',
              fontWeight: 'bold',
              fontSize: '20px'
          },
        },
        showInLegend: true,

        },
      },
      series: [
        {
          name: '',
          data: self.actionItemsPieChartData,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            distance: -20,
            style: {
              fontWeight: 'bold',
              fontSize: '7px',
              textOutline: 'none',
          },
          },
          states: {
            hover: {
              enabled: true
            },
            inactive: {
              opacity: 1
            }
          }
        },

      ],
    });
  }
}
