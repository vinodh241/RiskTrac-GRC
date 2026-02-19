import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-periodic-review-widget',
  templateUrl: './periodic-review-widget.component.html',
  styleUrls: ['./periodic-review-widget.component.scss']
})
export class PeriodicReviewWidgetComponent {
  @Input() periodicReviewData: any = {};
  // data: any = [{
  //   "SRAPeriodic": {
  //     "SRA_current": 60,
  //     "SRA_outdated": 10,
  //     "SRA_max": 100,
  //     "SRA_Total": 70
  //   },
  //   "BCMSPeriodic": {
  //     "BCMS_current": 56,
  //     "BCMS_outdated": 5,
  //     "BCMS_max": 100,
  //     "BCMS_Total": 61
  //   },
  //   "BCPPeriodic": {
  //     "BCP_current": 20,
  //     "BCP_outdated": 3,
  //     "BCP_max": 100,
  //     "BCP_Total": 23
  //   }
  // }]
  periodicDistributionSRABCMS: any
  periodicDistributionBIA: any

  ngOnInit(): void {

  }

  ngOnChanges(): any {

    // bar graph for SRA and BCMS periodic data
    console.log(this.periodicReviewData)
    this.periodicReviewBIA();
    this.periodicReviewSRABCMS();
    this.periodicDistributionBIA = Highcharts.chart("containerBIA", this.periodicDistributionBIA);

    this.periodicDistributionSRABCMS = Highcharts.chart("containerSRABCMS", this.periodicDistributionSRABCMS);
  }



  periodicReviewBIA():any { // bar graph for BIA ratings periodic data

    //console.log('periodicReviewBIA')
    this.periodicDistributionBIA = {
      chart: {
        type: 'bar'
      },
      style: {
        fontFamily: 'Roboto',
      },
      title: {
        text: 'Status of all BIA'
      },
      xAxis: {
        categories: ['BIA'],
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
        title: {
          text: ''
        },
        max: 100,
        tickInterval: 25,
        labels: {
          format: `{value}%`
        }
      },
      legend: {
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
            inside: true,
            formatter: function (): any {
              return (this as any).point.actualValue;
            },
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y:-2,
          },
          bar: {
            dataLabels: {
              enabled: true,
              inside:true,
              backgroundColor: 'none',
              style: {
                fontWeight: 'bold',
              },
              align: 'center',
              verticalAlign: 'middle',
              x: 0,
              y:-2,
            },
          },
          pointWidth: 15, // Set a fixed point width for all
          pointPadding: 0.2,
        }
      },
      tooltip: {
        enabled: true,
        outside: false,
        isHTML:true,
        followPointer: false,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        style: {
          fontSize: '1.5vh'
        },
        format : '<b><span style="color:{point.color}; font-size: 24px;">\u25CF</span> <div style="color: #ffffff">{series.name}:<br><span font-size: 24px;">Count:</span> <div style="color:{point.color}">{point.actualValue}</div>',
        // formatter: function (): any {
        //   return '<b>' + (this as any).point.category + ': ' + (this as any).series.name + '</b><br/>' +
        //     'count' + ': ' + (this as any).point.actualValue;
        // },
      },
      series: [
        {
          name: 'Low',
          data: [
          { y:  (this.periodicReviewData.BCPPeriodic?.BCPLowCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.BCPPeriodic, 'BCPLowCounts', this.periodicReviewData.BCPPeriodic?.BCPLowCounts, this.periodicReviewData.BCPPeriodic?.Total))
            ,actualValue: this.periodicReviewData.BCPPeriodic?.BCPLowCounts,
          // color: (this.periodicReviewData.BCPPeriodic?.BCPLowCounts == 0 ? 'red' :
          // {
          //     linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
          //     stops: [
          //       [0, '#2BE760'],
          //       [1, '#D2FD57']
          //     ]
          //   }
          // )
        }
          ],
          color:
          {
            linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
            stops: [
              [0, '#2BE760'],
              [1, '#D2FD57']
            ]
          },
          dataLabels: {
            style: {
              fontWeight: 'bold',
              fontSize: '0.8em',
              textOutline: 'none'
          },
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y:-2,
        }
        },
        {
          name: 'Medium',
          data: [
          { y: (this.periodicReviewData.BCPPeriodic?.BCPMediumCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.BCPPeriodic, 'BCPMediumCounts', this.periodicReviewData.BCPPeriodic?.BCPMediumCounts, this.periodicReviewData.BCPPeriodic?.Total))
          ,actualValue: this.periodicReviewData.BCPPeriodic?.BCPMediumCounts,
          // color: (this.periodicReviewData.BCPPeriodic?.BCPMediumCounts == 0 ? 'red' :
          // {
          //     linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
          //     stops: [
          //       [0, '#FFA41C'],
          //       [1, '#FFC657']
          //     ]
          //   }
          // )
        }
          ],
          color:
          {
            linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
            stops: [
              [0, '#FFA41C'],
              [1, '#FFC657']
            ]
          },
          dataLabels: {
            style: {
              fontWeight: 'bold',
              fontSize: '0.8em',
              textOutline: 'none'
          },
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y:-2,
        }
        },
        {
          name: 'High',
          data: [
          { y: (this.periodicReviewData.BCPPeriodic?.BCPHighCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.BCPPeriodic, 'BCPHighCounts', this.periodicReviewData.BCPPeriodic?.BCPHighCounts, this.periodicReviewData.BCPPeriodic?.Total)),
           actualValue: this.periodicReviewData.BCPPeriodic?.BCPHighCounts,
          // color: (this.periodicReviewData.BCPPeriodic?.BCPHighCounts == 0 ? 'red' :
          // {
          //     linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
          //     stops: [
          //       [0, '#E74B36'],
          //       [1, '#FFD5C8']
          //     ]
          //   }
          // )
        }
          ],
          color:
          {
            linearGradient: {x1: 1, y1: 1, x2: 0, y2: 0},
            stops: [
              [0, '#E74B36'],
              [1, '#FFD5C8']
            ]
          },
          dataLabels: {
            style: {
              fontWeight: 'bold',
              fontSize: '0.8em',
              textOutline: 'none'
          },
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y:-2,
        }
        }],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 450,
              },
            },
          ],
        },
    }
  }
  periodicReviewSRABCMS() :any {  // bar graph for SRA and BCMS periodic data

    this.periodicDistributionSRABCMS = {
      chart: {
        type: 'bar'
      },
      style: {
        fontFamily: 'Roboto',
      },
      title: {
        text: 'Status of SRA and BCMS'
      },
      xAxis: {
        categories: ['SRA', 'BCMS'],
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
        title: {
          text: ''
        },
        max: 100,
        tickInterval: 25,
        labels: {
          format: `{value}%`
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'left',
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
            inside: true,
            backgroundColor: 'none',
            formatter: function ():any {
              return (this as any).point.actualValue;
            },
            style: {
              fontWeight: 'bold',
              textOutline: 'none'
            },
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y:-2,
          },
          pointWidth: 15, // Set a fixed point width for all bars
          pointPadding: 0.2,
        },
        bar: {
          dataLabels: {
            enabled: true,
            inside: true,
            backgroundColor: 'none',
            style: {
              fontWeight: 'bold',
              textOutline: 'none'
            },
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y:-2,
          },
        }
      },
      tooltip: {
        enabled: true,
        outside: false,
        isHTML: true,
        followPointer: false,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 2,
        style: {
          fontSize: '1.5vh'
        },
        format: '<b><span style="color:{point.color}; font-size: 24px;">\u25CF</span> <div style="color: #ffffff">{series.name}:<br><span font-size: 24px;">Count:</span> <div style="color:{point.color}">{point.actualValue}</div>',
      },
      series: [
        {
          name: 'Scheduled',
          data: [
            {
              y: (this.periodicReviewData.SRAPeriodic?.SRAScheduledCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.SRAPeriodic, 'SRAScheduledCounts', this.periodicReviewData.SRAPeriodic?.SRAScheduledCounts, this.periodicReviewData.SRAPeriodic?.Total)),
              actualValue: this.periodicReviewData.SRAPeriodic?.SRAScheduledCounts,
            },
            {
              y: (this.periodicReviewData.BCMSPeriodic?.BCMSScheduledCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.BCMSPeriodic, 'SRAScheduledCounts', this.periodicReviewData.BCMSPeriodic?.BCMSScheduledCounts, this.periodicReviewData.BCMSPeriodic?.Total)),
              actualValue: this.periodicReviewData.BCMSPeriodic?.BCMSScheduledCounts,
            }
          ],
          color: {
            linearGradient: { x1: 1, y1: 1, x2: 0, y2: 0 },
            stops: [
              [0, '#525252'],
              [1, '#8E8E8E']
            ]
          },
          dataLabels: {
            style: {
              fontWeight: 'bold',
              fontSize: '0.8em',
              textOutline: 'none',
              textAlign: 'center'
            },
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y:-2,
          }
        },
        {
          name: 'In Progress',
          data: [
            {
              y: (this.periodicReviewData.SRAPeriodic?.SRAInProgressCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.SRAPeriodic, 'SRAInProgressCounts', this.periodicReviewData.SRAPeriodic?.SRAInProgressCounts, this.periodicReviewData.SRAPeriodic?.Total)),
              actualValue: this.periodicReviewData.SRAPeriodic?.SRAInProgressCounts,
            },
            {
              y: (this.periodicReviewData.BCMSPeriodic?.BCMSInProgressCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.BCMSPeriodic, 'BCMSInProgressCounts', this.periodicReviewData.BCMSPeriodic?.BCMSInProgressCounts, this.periodicReviewData.BCMSPeriodic?.Total)),
              actualValue: this.periodicReviewData.BCMSPeriodic?.BCMSInProgressCounts,
            }
          ],
          color: {
            linearGradient: { x1: 1, y1: 1, x2: 0, y2: 0 },
            stops: [
              [0, '#22D8AC'],
              [1, '#318DFA']
            ]
          },
          dataLabels: {
            style: {
              fontWeight: 'bold',
              fontSize: '0.8em',
              textOutline: 'none',
              textAlign: 'center'
            },
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y:-2,
          }
        },
        {
          name: 'Published',
          data: [
            {
              y: (this.periodicReviewData.SRAPeriodic?.SRAPublishedCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.SRAPeriodic, 'SRAPublishedCounts', this.periodicReviewData.SRAPeriodic?.SRAPublishedCounts, this.periodicReviewData.SRAPeriodic?.Total)),
              actualValue: this.periodicReviewData.SRAPeriodic?.SRAPublishedCounts,
            },
            {
              y: (this.periodicReviewData.BCMSPeriodic?.BCMSPublishedCounts == 0 ? 2 : this.calcSpace(this.periodicReviewData.BCMSPeriodic, 'BCMSPublishedCounts', this.periodicReviewData.BCMSPeriodic?.BCMSPublishedCounts, this.periodicReviewData.BCMSPeriodic?.Total)),
              actualValue: this.periodicReviewData.BCMSPeriodic?.BCMSPublishedCounts,
            }
          ],
          color: {
            linearGradient: { x1: 1, y1: 1, x2: 0, y2: 0 },
            stops: [
              [0, '#61BACD'],
              [1, '#346594']
            ]
          },
          dataLabels: {
            style: {
              fontWeight: 'bold',
              fontSize: '0.8em',
              textOutline: 'none',
              textAlign: 'center'
            },
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y:-2,
          }
        }
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
    }

  }



  getMaxKey(typeData:any) {
    let maxKey   = null;
    let maxValue = -Infinity;
    for (let key in typeData) {
      if(key != 'Total' ) {
        if (typeData[key] > maxValue) {
          maxValue = typeData[key];
          maxKey   = key;
        }
      }

    }
// console.log('✌️maxKey --->', maxKey);

    return maxKey;
  }

  calcSpace(typeData:any, key:any, value:any, Total:any):any {
    // console.log('✌️Total --->', Total);
    // console.log('✌️value --->', value);
    // console.log('✌️key --->', key);
    // console.log('✌️typeData --->', typeData);

    let space:any =''
    if (key == this.getMaxKey(typeData)) {
      space =  (((value / Total) * 100 ) - this.countZeroValues(typeData))
    } else if (key !== this.getMaxKey(typeData)) {
      space =  (value / Total) * 100
      // console.log('✌️space --->', space);
    }
    return Number(space);
  }

  countZeroValues(typeData:any) {
    let zeroCount = 0;
    for (let key in typeData) {
      if(key != 'Total' ) {
        if (typeData[key] === 0) {
          zeroCount++;
        }
      }

    }
    return (zeroCount * 2.5);
  }

  checkAllZeroValues(data:any) {
    return Object.values(data).every(value => value === 0)
  }


}
