import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GlobalDashboardService } from 'src/app/services/dashboard/global-dashboard/global-dashboard.service';

@Component({
  selector: 'app-bcp-coverage-widget',
  templateUrl: './bcp-coverage-widget.component.html',
  styleUrls: ['./bcp-coverage-widget.component.scss'],
})

export class BcpCoverageWidgetComponent implements OnInit {
  @Input() bcpCoverageData: any[] = []

  bcpPieGraph: any;
  totalCovereddata: number = 0;
  notCovered: number = 0;
  outdated: number = 0;
  notCoveredBCP: number = 0;
  CoveredBCP: number = 0;
  noData: boolean = false

  constructor(public service: GlobalDashboardService) {}
  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.notCoveredBCP  = this.bcpCoverageData[0]?.BCPNotCovered >= 0  ? this.bcpCoverageData[0]?.BCPNotCovered : 0;
    this.CoveredBCP     = this.bcpCoverageData[0]?.BCPCovered >= 0 ? this.bcpCoverageData[0]?.BCPCovered : 0;
    this.outdated       = this.bcpCoverageData[0]?.BCPOutDated >= 0 ? this.bcpCoverageData[0]?.BCPOutDated : 0;

    if (this.CoveredBCP == 0 && this.outdated == 0) {
      this.noData = true;
    } else {
      this.noData = false;
      setTimeout(() => {
        this.pieGraph();
      }, 100);
    }
  }

  pieGraph() {
    this.bcpPieGraph = {
      chart: {
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        verticalAlign: 'middle',
        text: undefined,
      },
      tooltip: {
        enabled: true,
        outside: false,
        isHTML: true,
        // format:'<span style="color: #ffffff">{point.name}: </span><span style="color:#ffffff; font-weight:700">{point.y}</span>',
        format:
          '<b><span style="color:{point.color}; font-size: 20px;">\u25CF</span> <div style="color: #ffffff">{point.name}:<br><span font-size: 20px;">Count:</span> <div style="color:{point.color}">{point.y}</div>',
        followPointer: false,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        style: {
          fontSize: '10px',
        },
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'pointer',
          showInLegend: false,
          colors: [
            {
              linearGradient: {
                x1: 1,
                x2: 0,
                y1: 1,
                y2: 1,
              },
              stops: [
                [0, '#FCE38A'],
                [1, '#F3B181'],
              ],
            },

            {
              linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1,
              },
              stops: [
                [0, '#F54E4E'],
                [1, '#DEB0B0'],
              ],
            }

            // '#a8e2e9',
          ],
          borderRadius: 5,
          dataLabels: {
            enabled: true,
            format: '<b>{point.y}</b>',
            distance: -50,
            style: {
              // fontWeight: 'bold',
              fontSize: '0.9em',
              textOutline: 'none',
          },
            // filter: {
            //   property: 'percentage',
            //   operator: '>',
            //   value: 4,
            // },
          },
        },
      },

      series: [
        {
          data: [
            { name: 'Covered & Current', y: this.CoveredBCP },
            { name: 'Not Covered', y: this.notCoveredBCP }
          ],
          size: '110%',
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
    };
    this.bcpPieGraph = Highcharts.chart('bcpCoverage', this.bcpPieGraph);
  }
}
