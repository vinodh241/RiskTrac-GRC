import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GlobalDashboardService } from 'src/app/services/dashboard/global-dashboard/global-dashboard.service';

@Component({
  selector: 'app-bcp-criticality-distribution',
  templateUrl: './bcp-criticality-distribution.component.html',
  styleUrls: ['./bcp-criticality-distribution.component.scss']
})
export class BcpCriticalityDistributionComponent {
  @Input() bcpCriticalityData: any[] = [];

  bcpcriticalitydistribution : any;

  data: any = [];
  RPO_Data : any  = {}
  RTO_Data : any  = {}
  MTPD_Data : any = {}

  constructor (
    public service    : GlobalDashboardService
  ){}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.data = this.service.globalDashboardDataMaster?.BCPCriticalityDistribution || [];
    if (this.data.length) {
      this.RPO_Data = {
        RPO_4_Hours         : this.data[0].RPO_4_Hours,
        RPO_4_Hours_1_Days  : this.data[0].RPO_4_Hours_1_Days,
        RPO_2_3_Days        : this.data[0].RPO_2_3_Days,
        RPO_3_5_Days        : this.data[0].RPO_3_5_Days,
        RPO_5_Days          : this.data[0].RPO_5_Days
      };
      this.RTO_Data = {
        RTO_4_Hours         : this.data[0].RTO_4_Hours,
        RTO_4_Hours_1_Days  : this.data[0].RTO_4_Hours_1_Days,
        RTO_2_3_Days        : this.data[0].RTO_2_3_Days,
        RTO_3_5_Days        : this.data[0].RTO_3_5_Days,
        RTO_5_Days          : this.data[0].RTO_5_Days
      };
      this.MTPD_Data = {
        MTPD_4_Hours        : this.data[0].MTPD_4_Hours,
        MTPD_4_Hours_1_Days : this.data[0].MTPD_4_Hours_1_Days,
        MTPD_2_3_Days       : this.data[0].MTPD_2_3_Days,
        MTPD_3_5_Days       : this.data[0].MTPD_3_5_Days,
        MTPD_5_Days         : this.data[0].MTPD_5_Days
      };
      this.criticalGraph();
      this.bcpcriticalitydistribution = Highcharts.chart("bcpcriticalitydistribution", this.bcpcriticalitydistribution);
    }
  }

  criticalGraph() :any {
    const self = this;
    this.bcpcriticalitydistribution = {
      chart: {
        type: 'bar'
      },
      style: {
        fontFamily: 'Roboto',
      },
      title: {
        text: 'Distribution of key parameters across all business functions'
      },
      xAxis: {
        categories: ['RPO', 'RTO', 'MTPD'],
        labels: {
          style: {
            fontWeight: 'bold',
            fontSize: '1.5vh',
          },
        },
        lineWidth: 0,
      },
      yAxis: {
        min: 0,
        tickInterval: 10,
        max: 100,
        labels: {
          format: '{value}%'
        },
      },
      legend: {
         reversed:true,
         layout: 'horizontal',
         align:'left',
         horizontalAlign: 'middle',
         labelFormat: '{name}',
         itemStyle: {
           color: '#000000',
           fontSize: '8px',
       },
       },
      plotOptions: {
        series: {
          stacking: 'normal',
          borderRadius: '500',
          dataLabels: {
            enabled: true,
            formatter: function() :any{
              return (this as any).point.actualValue; // Display the actual value
            },
            // color: '#000000'
          },
          bar: {

            dataLabels: {
              enabled: true,
              backgroundColor: 'none',
              style: {
                fontWeight: 'bold',
              },
            },
          },
          pointWidth: 15,
         // pointPadding: 0.5,
        }
      },
      tooltip: {
        enabled: true,
        outside: false,
        isHTML: true,
        // format:'<span style="color: #ffffff">{point.name}: </span><span style="color:#ffffff; font-weight:700">{point.y}</span>',
        format:
          '<b><span style="color:{point.color}; font-size: 20px;">\u25CF</span> <div style="color: #ffffff">{series.name}:<br><span font-size: 20px;">Count:</span> <div style="color:{point.color}">{point.actualValue}</div>',
        followPointer: false,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        style: {
          fontSize: '10px',
        },
      },
      series: this.formatCount(),
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 400,
            },
          },
        ],
      },
    };


  }

  formatCount():any {
    return [
      {
        name: '>= 5 Days',
        data: [
          {
            y: ( (this.data[0].RPO_5_Days == 0 ? 2 : this.calcSpace(this.RPO_Data, 'RPO_5_Days', this.data[0].RPO_5_Days))),
            actualValue: this.data[0].RPO_5_Days,
            // color: (this.data[0].RPO_5_Days == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].RTO_5_Days == 0 ? 2 : this.calcSpace(this.RTO_Data, 'RTO_5_Days', this.data[0].RTO_5_Days))),
            actualValue: this.data[0].RTO_5_Days,
            // color: (this.data[0].RTO_5_Days == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].MTPD_5_Days == 0 ? 2 : this.calcSpace(this.MTPD_Data, 'MTPD_5_Days', this.data[0].MTPD_5_Days))),
            actualValue: this.data[0].MTPD_5_Days,
            // color: (this.data[0].MTPD_5_Days == 0 ? 'red' : null)
          }
       ],
        color:
        {
          linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
          stops: [
            [0, '#DEB0B0'],
            [1, '#F54E4E']
          ]
        },
        dataLabels: {
          style: {
            fontWeight: 'bold',
            fontSize: '1em',
            textOutline: 'none',
          }
        }
      },
      {
        name: '3 to 5 Days',
        data: [
          {
            y: ((this.data[0].RPO_3_5_Days == 0 ? 2 : this.calcSpace(this.RPO_Data, 'RPO_3_5_Days', this.data[0].RPO_3_5_Days))),
            actualValue: this.data[0].RPO_3_5_Days,
            // color: (this.data[0].RPO_3_5_Days == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].RTO_3_5_Days == 0 ? 2 : this.calcSpace(this.RTO_Data, 'RTO_3_5_Days', this.data[0].RTO_3_5_Days))),
            actualValue: this.data[0].RTO_3_5_Days,
            // color: (this.data[0].RTO_3_5_Days == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].MTPD_3_5_Days == 0 ? 2 : this.calcSpace(this.MTPD_Data, 'MTPD_3_5_Days', this.data[0].MTPD_3_5_Days))),
            actualValue: this.data[0].MTPD_3_5_Days,
            // color: (this.data[0].MTPD_3_5_Days == 0 ? 'red' : null)
          }
        ],
        color:
        {
          linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
          stops: [
            [0, '#FCE38A'],
            [1, '#F3B181']
          ]
        },
        dataLabels: {
          style: {
            fontWeight: 'bold',
            fontSize: '1em',
            textOutline: 'none',
          }
        }
      },
      {
        name: '1 to 3 Days',
        data: [
          {
            y: ((this.data[0].RPO_2_3_Days == 0 ? 2 : this.calcSpace(this.RPO_Data, 'RPO_2_3_Days', this.data[0].RPO_2_3_Days))),
            actualValue: this.data[0].RPO_2_3_Days,
            // color: (this.data[0].RPO_2_3_Days == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].RTO_2_3_Days == 0 ? 2 : this.calcSpace(this.RTO_Data, 'RTO_2_3_Days', this.data[0].RTO_2_3_Days))),
            actualValue: this.data[0].RTO_2_3_Days,
            // color: (this.data[0].RTO_2_3_Days == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].MTPD_2_3_Days == 0 ? 2 : this.calcSpace(this.MTPD_Data, 'MTPD_2_3_Days', this.data[0].MTPD_2_3_Days))),
            actualValue: this.data[0].MTPD_2_3_Days,
            // color: (this.data[0].MTPD_2_3_Days == 0 ? 'red' : null)
          }
        ],
        color:
        {
          linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
          stops: [
            [0, '#D7F1FF'],
            [1, '#68CAFF']
          ]
        },
        dataLabels: {
          style: {
            fontWeight: 'bold',
            fontSize: '1em',
            textOutline: 'none',
          }
        }
      },
      {
        name: '4Hrs to 1 Day',
        data: [
          {
            y: ((this.data[0].RPO_4_Hours_1_Days == 0 ? 2 : this.calcSpace(this.RPO_Data, 'RPO_4_Hours_1_Days', this.data[0].RPO_4_Hours_1_Days))),
            actualValue: this.data[0].RPO_4_Hours_1_Days,
            // color: (this.data[0].RPO_4_Hours_1_Days == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].RTO_4_Hours_1_Days == 0 ? 2 : this.calcSpace(this.RTO_Data, 'RTO_4_Hours_1_Days', this.data[0].RTO_4_Hours_1_Days))),
            actualValue: this.data[0].RTO_4_Hours_1_Days,
            // color: (this.data[0].RTO_4_Hours_1_Days == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].MTPD_4_Hours_1_Days == 0 ? 2 : this.calcSpace(this.MTPD_Data, 'MTPD_4_Hours_1_Days', this.data[0].MTPD_4_Hours_1_Days))),
            actualValue: this.data[0].MTPD_4_Hours_1_Days,
            // color: (this.data[0].MTPD_4_Hours_1_Days == 0 ? 'red' : null)
          }
        ],
        color:
        {
          linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
          stops: [
            [0, '#EDD7FF'],
            [1, '#C073FF']
          ]
        },
        dataLabels: {
          style: {
            fontWeight: 'bold',
            fontSize: '1em',
            textOutline: 'none',
          }
        }
      },
      {
        name: '<= 4 Hours',
        data: [
          {
            y: ((this.data[0].RPO_4_Hours == 0 ? 2 : this.calcSpace(this.RPO_Data, 'RPO_4_Hours', this.data[0].RPO_4_Hours))),
            actualValue: this.data[0].RPO_4_Hours,
            // color: (this.data[0].RPO_4_Hours == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].RTO_4_Hours == 0 ? 2 : this.calcSpace(this.RTO_Data, 'RTO_4_Hours', this.data[0].RTO_4_Hours))),
            actualValue: this.data[0].RTO_4_Hours,
            // color: (this.data[0].RTO_4_Hours == 0 ? 'red' : null)
          },
          {
            y: ((this.data[0].MTPD_4_Hours == 0 ? 2 : this.calcSpace(this.MTPD_Data, 'MTPD_4_Hours', this.data[0].MTPD_4_Hours))),
            actualValue: this.data[0].MTPD_4_Hours,
            // color: (this.data[0].MTPD_4_Hours == 0 ? 'red' : null)
          }
        ],
        color:
        {
          linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
          stops: [
            [0, '#D7FEDF'],
            [1, '#5FF37F']
          ]
        },
        dataLabels: {
          style: {
            fontWeight: 'bold',
            fontSize: '1em',
            textOutline: 'none',
          }
        }
      }


    ]
  }


  getMaxKey(typeData:any) {
    let maxKey   = null;
    let maxValue = -Infinity;
    for (let key in typeData) {
      if (typeData[key] > maxValue) {
        maxValue = typeData[key];
        maxKey   = key;
      }
    }

    return maxKey;
  }

  calcSpace(typeData:any, key:any, value:any):any {
    let space:any =''
    if (key == this.getMaxKey(typeData)) {
      space =  (((value / this.data[0].RPO_Total) * 100 ) - this.countZeroValues(typeData))
    } else if (key !== this.getMaxKey(typeData)) {
      space =  (value/this.data[0].RPO_Total) * 100
    }
    return Number(space);
  }

  countZeroValues(typeData:any) {
    let zeroCount = 0;
    for (let key in typeData) {
      if (typeData[key] === 0) {
        zeroCount++;
      }
    }
    return (zeroCount * 2);
  }

  checkAllZeroValues(data:any) {
    return Object.values(data).every(value => value === 0)
  }
}
