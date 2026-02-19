import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-risk-data-chart',
  templateUrl: './risk-data-chart.component.html',
  styleUrls: ['./risk-data-chart.component.scss'],
})
export class RiskDataChartComponent {
  @Input() chartID: any;
  @Input() riskStatusData: any;
  @Input() residualRiskStatusData: any;

  noData: boolean = false;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(): void {
    if (
      this.riskStatusData.every((x: any) => x.y == 0) &&
      this.residualRiskStatusData.every((x: any) => x.y == 0)
    ) {
      this.noData = true;
    } else {
      this.noData = false;
      setTimeout(() => this.loadChart(), 100);
    }
  }

  loadChart() {
    let self = this;
    const total = (self.riskStatusData.map((x: any) => x.y) || []).reduce(
      (prev: any, next: any) => prev + next
    );
    const openPercentage = (self.riskStatusData[0].y / total) * 100;

    (Highcharts as any).chart(this.chartID, {
      chart: {
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        style: {
          fontFamily: 'Roboto',
        },
      },
      title: {
        text: '',
      },
      tooltip: {
        enabled: true,
        outside: false,
        isHTML: true,
        format:
          '<b> <div style="color: #ffffff;"><span style="color:{point.radioColor}; font-size: 24px;">\u25CF</span> {point.name}:<br><span font-size: 20px;">Count:</span> <div style="color:{point.color}">{point.y}</div>',
        followPointer: false,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        style: {
          fontSize: '1.5vh',
          padding: 0,
          margin: 0,
        },
      },
      credits: { enabled: false },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      exporting: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'auto',
          dataLabels: {
            enabled: true,
            format: '{point.y}',
          },
          showInLegend: false,
          size: '100%',
        },
      },
      series: [
        {
          name: 'Status',
          data: self.riskStatusData.map((point: any) => ({
            ...point,
            color: {
              linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
              stops: [
                [0, point.color[0]],
                [1, point.color[1]],
              ],
            },
          })),
          size: '70%',
          dataLabels: {
            enabled: true,
            distance: -40,
            format: '{point.y}',
            style: {
              fontSize: '1em',
              textOutline: 'none',
              opacity: 0.7,
            },
          },
          states: {
            hover: {
              enabled: true,
            },
            inactive: {
              opacity: 1,
            },
          },
        },
        {
          name: 'Risk Level',
          data: self.residualRiskStatusData.map((point: any) => ({
            ...point,
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, point.color[0]],
                [1, point.color[1]],
              ],
            },
          })),
          size: '100%',
          innerSize: '65%',
          dataLabels: {
            enabled: true,
            format: '{point.count}',
            style: {
              fontSize: '1em',
              textOutline: 'none',
              opacity: 0.7,
              textAlign: 'center',
            },
            distance: -15,
          },
          startAngle: 0,
          endAngle: (openPercentage / 100) * 360,
          states: {
            hover: {
              enabled: true,
            },
            inactive: {
              opacity: 1,
            },
          },
        },
      ],
    });
  }
}
