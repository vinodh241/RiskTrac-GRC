import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';  
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
    selector: 'app-ras',
    templateUrl: './ras.component.html',
    styleUrls: ['./ras.component.scss']
})
export class RasChartComponent implements OnInit {    
  
  raschartFirst: any;  
  rasoptionsFirst: any
  assessmentNotFilled: any;
  unitOverdue: any;

    
  raschartSecond: any; 
  rasoptionsSecond: any;

    listData:any;

    constructor( private dashboardService: DashboardService

    ) {
      
    }

    ngOnInit(): void {        
      this.dashboardService.getRiskAssessmentSchedule()
      this.listData = this.dashboardService.master; 
      this.assessmentNotFilled = this.dashboardService.master.assessmentNotFilled[0]; 
      this.unitOverdue = this.dashboardService.master.unitOverdue[0]; 
      
 
      this.rasoptionsFirst = {
        chart: {
          type: 'pie'
        },
        title: {
          verticalAlign: 'middle', 
          text: "<br><br><br><span style='color: #7e7e7e'><strong class='headTotalFS'>"+this.unitOverdue.scheduledUnitOverdue+"</strong>("+this.unitOverdue.percentageUnitOverdue+"%)</span><br> Unit<br> <strong>Overdue<strong></br>"
        },
        plotOptions: {
          pie: {
            innerSize: 120,
            depth: 0,
            dataLabels: {
              enabled: false
            },
            colors: ['#ff5473','#dddddd']
          }
        }, 
        series: [{ 
          data: [
            ['', this.unitOverdue.scheduledUnitOverdue],
            ['', this.unitOverdue.totalUnitOverdue - this.unitOverdue.scheduledUnitOverdue]
          ]
        }],
        };
 
      
      
  this.rasoptionsSecond = {
    chart: {
      type: 'pie'
    },
    title: {
      verticalAlign: 'middle', 
      text: "<br><br><br><span style='color: #7e7e7e'><strong class='headTotalFS'>"+this.assessmentNotFilled.scheduledassessmentNotFilled+"</strong>("+this.assessmentNotFilled.percentageassessmentNotFilled+"%)</span><br> Assessments<br><strong>Not Filled<strong></br>"
    },
    plotOptions: {
      pie: {
        innerSize: 120,
        depth: 0,
        dataLabels: {
          enabled: false
        },
        colors: ['#ffb26a','#dddddd']
      }
    }, 
    series: [{ 
      data: [
        ['', this.assessmentNotFilled.scheduledassessmentNotFilled],
        ['', this.assessmentNotFilled.totalassessmentNotFilled - this.assessmentNotFilled.scheduledassessmentNotFilled]
      ]
    }],
    };
      
      this.raschartFirst = Highcharts.chart("containerFirst", this.rasoptionsFirst); 
      this.raschartSecond = Highcharts.chart("containerSecond", this.rasoptionsSecond); 
    
    }
}
