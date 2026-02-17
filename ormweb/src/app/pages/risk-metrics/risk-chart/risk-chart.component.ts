import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MetricsComponent } from '../metrics/metrics.component';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
// require("highcharts/modules/networkgraph")(Highcharts);

@Component({
    selector: 'app-risk-chart',
    templateUrl: './risk-chart.component.html',
    styleUrls: ['./risk-chart.component.scss']
})
export class RiskChartComponent implements OnInit, OnChanges {
    @Input() chartData: any;
    @Input() container: any;
    @Output() selectedCategory = new EventEmitter<string>();
    notStarted: boolean = false;
    inProgress: boolean = false;
    reject: boolean = false;
    listContainer: any = []
    currSelectedCategory: string = '';
    chartStatus:any;
    public options: any;
    graphData:any[] =[];
    selectedGraphStatus :any;
    constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.onNavigationEnd(); 
    }

    ngOnChanges(): void {
        if (this.chartData.total) {
            this.getOptions();
            this.displayChart();       
           
        }   
    }

    getOptions() {
        this.options = {
            tooltip: {
                enabled: false,
                useHTML: true,
                pointFormat: '',
                backgroundColor: '#000000',
            },
            chart: {
                backgroundColor: "#00000000",
                styledMode: false,
                style: {
                    fontFamily: "Roboto Condensed"
                },
                type: "bar"
            },
            title: {
                text: "",
                labels: {
                    style: {
                        color: '#fff',
                    },
                },
            },
            xAxis: {
                categories: ["Reviewed", "Not Started", "Submitted", "Review Pending", "In Progress", "Approved", "Rejected"],
                gridLineWidth: 1,
                lineColor: '#ffffff3d',
                gridLineColor: '#ffffff3d',
                title: {
                    text: null,
                },
                labels: {
                    style: {
                        color: '#fff',
                        fontSize: '2.5vh',
                        fontWeight: '400',
                    },
                },
            },
            yAxis: {
                min: 0,
                tickAmount: 2,
                gridLineWidth: 1,
                gridLineColor: '#ffffff3d',
                title: {
                    text: null,
                    align: "high"
                },
                labels: {
                    enabled: false,
                    overflow: "justify",
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        inside: true,
                        align: 'right',
                        style: {
                            color: '#fff',
                            fontSize: '2.5vh',
                            textOutline: 0,
                            fontWeight: '400'
                        }
                    },
                    states: {
                        select: {
                            color: {
                                linearGradient: {
                                    x1: 0,
                                    x2: 0,
                                    y1: 1,
                                    y2: 0,
                                },
                                stops: [
                                    [0, '#FFAA2E'],
                                    [1, '#CB4900'],  
                                ]
                            },
                            
                        }
                    },
                    point: {
                        events: {
                            click: (ev: any) => {
                                this.getSelectedPoint(ev.point.category);
                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    showInLegend: false,
                    borderColor: 'none',
                    allowPointSelect: true,
                    point: {
                        events: {
                            click: (ev: any) => {
                                this.getSelectedPoint(ev['point'].category);
                            }
                        }
                    },
                    data: this.getGraphDataCount()                   
                }
            ]
        }  
    }

    getGraphDataCount() {
        const expectedData = [
            { name: 'Reviewed',      y: this.chartData.reviewed,     selected : false, color : ''},
            { name: 'Not Started',   y: this.chartData.notstarted,   selected : false, color : ''},
            { name: 'Submitted',     y: this.chartData.submitted,    selected : false, color : ''},
            { name: 'Not Submitted', y: this.chartData.notsubmitted, selected : false, color : ''},
            { name: 'In Progress',   y: this.chartData.inprogress,   selected : false, color : ''},
            { name: 'Approved',      y: this.chartData.approved,     selected : false, color : ''},
            { name: 'Rejected',      y: this.chartData.rejected,     selected : false, color : ''}
        ];

        expectedData.forEach(item => {
            const existingItem = this.graphData.find(existing => existing.name === item.name);
            if (existingItem) {
                item.selected = existingItem.selected || false; 
                item.color = existingItem.color || '';
            }
        });

        let isMismatch = false;
        if (this.graphData.length !== expectedData.length) {
            isMismatch = true;
        } else {
            for (let i = 0; i < this.graphData.length; i++) {
                if (this.graphData[i].name !== expectedData[i].name || this.graphData[i].y !== expectedData[i].y) {
                    isMismatch = true;
                    break;
                }
            }
        }
        if (isMismatch) {
            this.graphData = [...expectedData];
        }
        return this.graphData
    }
    
    resetFilter() {
        localStorage.removeItem('RAChartStatus');
        this.graphData = [];
        this.selectedCategory.emit('Reset');  
        this.currSelectedCategory = ""
    }

    unitsCall(nu: any) {
        if (nu > 1) {
            return 'Units'
        } else {
            return "Unit"
        }
    }

    getDataSource(status: any) {
        let statusDataList = this.container.flat().filter((x: any) => x.StatusName == status);
        let unitList = [...new Set(statusDataList.map((x: any) => x.UnitName))];

        let tableBody = '';
        unitList.forEach((name: any, index: number) => {
            let unitData = statusDataList.filter((y: any) => y.UnitName == name);
            tableBody += `
            <tr>
            <td style="width:20%; color:yellow;border: 1px solid white;border-collapse: collapse; padding:5px;">${index + 1}</td>
                <td style='text-align:center; font-size:12px;width:40%; color:yellow; border: 1px solid white;border-collapse: collapse; padding:5px;'>${name}</td>
                <td style='text-align:center;width:40%; font-size:12px; color:skyblue; border: 1px solid white;border-collapse: collapse; padding:5px;' >${unitData.length}</td>
            </tr> `
        })

        let htmld
        if (unitList.length > 0) {
            const html = `
            <p style="color:skyblue; font-size:12px;">
            <span style="font-size:15px;">${unitList.length}</span>
            ${this.unitsCall(unitList.length)} which has <span style="color: yellow; font-size:15px;">${status}</span></p>
          <table  style='border-collapse: collapse;' ;>
          <thead>
          <tr>
              <th ></th>
              <th style='color:#ffffcc;font-size:12px;font-style: oblique;font-weight:normal;'>Units</th>
              <th style='color:#fff;font-size:12px;font-style: oblique; font-weight:normal;'># Of Risk Metrics</th>
          </tr>
          </thead>
          <tbody>
          ${tableBody}
          </tbody>
      </table>
      `
            htmld = html
        } else {
            const html = `
        <div>
        <p style="color:skyblue;font-size:12px;">
         <span style="font-size:15px;" >${unitList.length}</span> Unit which has <span style="color: yellow;font-size:15px;">${status}</span>
        </p>
        </div>
          `
            htmld = html
        }
        return htmld
    }

    getSelectedPoint(point: any) {        
        let selectedData = point;
console.log('✌️this.currSelectedCategory --->', this.currSelectedCategory);
console.log('✌️selectedData --->', selectedData);

        if (this.currSelectedCategory == selectedData) {
            localStorage.setItem('RAChartStatus', 'Reset')
            this.selectedCategory.emit('Reset');
            this.currSelectedCategory = ""
        } else {
            localStorage.setItem('RAChartStatus', selectedData)
            this.selectedCategory.emit(selectedData);
            this.currSelectedCategory = selectedData;
        }
    }

    displayChart() {
        if (this.options) {
            (Highcharts as any).chart("container", this.options);
        }
        this.changeDetectorRef.detectChanges();
    }

    onNavigationEnd() {
        this.router.events.subscribe(Ev => {
            if (Ev instanceof NavigationEnd) {
                this.displayChart();
            }
        });
    }

    showMetrics(): void {
        const metrics = this.dialog.open(MetricsComponent, {
            panelClass: 'dark',
            minWidth: '40vh',
            minHeight: '40vh',
            // position: { left: '20' },
            data: {
                data: this.container
            }
        })
    }
}

