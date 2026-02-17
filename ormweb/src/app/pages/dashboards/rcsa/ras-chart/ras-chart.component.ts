import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { RscaPopupComponent } from '../popups/rsca-popups/rsca-popups.component';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';

@Component({
  selector: 'app-ras-chart',
  templateUrl: './ras-chart.component.html',
  styleUrls: ['./ras-chart.component.scss']
})
export class RasChartComponent implements OnInit {
  raschartFirst: any;
  rasoptionsFirst: any
  assessmentNotFilled: any;
  unitOverdue: any;
  totalRiskAssessments: any;
  totalUnits: any;
  list: any;
  raschartSecond: any;
  rasoptionsSecond: any;
  wait: any;
  listData: any;
  yearData: any;
  quaterData: any;
  currentQuarter: any;

  constructor(private dashboardService: DashboardService, public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dashboardService.getRiskAssessmentSchedule()
    this.wait = this.dialog.open(WaitComponent, {
      disableClose: true,
      panelClass: "dark",
      data: {
        text: "Fetching Data ..."
      }
    })
    this.dashboardService.getYearQuarterData();
    this.dashboardService.gotYearQuater.subscribe((value) => {
      if (value == true) {
        this.yearData = this.dashboardService.yearValue
        this.quaterData = this.dashboardService.quaterValue
      }
      let currentDate = new Date();
      let currMonth = currentDate.getMonth() + 1;
      let currQuarter = Math.ceil(currMonth / 3);
      let quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
      this.currentQuarter = quarterFilter;
      setTimeout(() => {
        this.handledata();
      }, 2000)
    });
  }

  handledata() {
    this.wait.close()
    this.listData = (this.dashboardService.master && Array.isArray(this.dashboardService.master)) 
      ? this.dashboardService.master.filter((item: any) => item.Quater === this.currentQuarter)
      : [];
    const unitkey = 'Units';
    const totalunitUniqueByKey = [...new Map(this.listData.map((item: any) =>
      [item[unitkey], item])).values()];
    this.totalUnits = totalunitUniqueByKey;
    const totalRiskAssessmentskey = 'RCSACode';
    const totalRiskAssessmentsUniqueByKey = [...new Map(this.listData.map((item: any) =>
      [item[totalRiskAssessmentskey], item])).values()];
    this.totalRiskAssessments = totalRiskAssessmentsUniqueByKey;
    let assessmentNotFilled = this.listData.filter(
      (ele: any) => ele.ScheduleInherentRiskStatusName == "New" || ele.ScheduleInherentRiskStatusName == "Draft"
    )
    this.assessmentNotFilled = assessmentNotFilled;
    let todayDate = new Date().getDate();
    let todayMonth = new Date().getMonth();
    let todayYear = new Date().getFullYear();
    let todayTime = new Date(todayYear, todayMonth, todayDate).getTime();
    let unitOverdue = this.listData.filter((ele: any) => {
      let responseTime = new Date(
        Number(ele.ProposedCompletionDate.substring(0, 4)),
        Number(ele.ProposedCompletionDate.substring(5, 7)) - 1,
        Number(ele.ProposedCompletionDate.substring(8, 10))
      ).getTime();
      return (ele.ScheduleInherentRiskStatusName == "New" && (responseTime < todayTime)) || (ele.ScheduleInherentRiskStatusName == "Draft" && (responseTime < todayTime))
    });
    const key = 'Units';
    const arrayUniqueByKey = [...new Map(unitOverdue.map((item: any) =>
      [item[key], item])).values()];
    this.unitOverdue = arrayUniqueByKey;
    let percentageUO = this.totalUnits?.length > 0 ? Math.floor((this.unitOverdue?.length / this.totalUnits?.length) * 100) : 0;
    let unitLength = this.totalUnits?.length > 0 ? this.totalUnits?.length : 0;
    let overdueunitLength = this.unitOverdue?.length > 0 ? this.unitOverdue?.length : 0;
    if (unitLength > 0) {
      unitLength = unitLength
    } else {
      unitLength = 1;
    }
    this.rasoptionsFirst = {
      chart: {
        type: 'pie',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      },
      title: {
        verticalAlign: 'middle',
        align: 'center',
        y: 30,
        text: "<span style='color: #7e7e7e'><strong class='headTotalFS'>" + overdueunitLength + "</strong>(" + percentageUO + "%)</span><br> Unit<br> <strong>Overdue<strong></br>"
      },
      tooltip: {
        enabled: true,
        pointFormat: 'Click to view more information',
        headerFormat: '',
        footerFormat: ''
      },
      plotOptions: {
        pie: {
          innerSize: 140,
          depth: 0,
          borderWidth: 0,
          point: {
            events: {
              click: (event: any) => {
                if (event.point) {
                  this.openPopUp("overdueContainerFirst")
                }
              }
            }
          },
          shadow: true,
          dataLabels: {
            enabled: false
          },
          colors: ['#F76C83', '#dddddd']
        },
        series: {
          cursor: 'pointer',
        }
      },
      series: [{
        data: [
          ['Overdue Units', overdueunitLength],
          ['Complete Units', unitLength - overdueunitLength]
        ]
      }],
    };
    let percentageANF = this.listData?.length > 0 ? parseFloat("" + (this.assessmentNotFilled?.length / this.listData?.length) * 100).toFixed(0) : 0;
    let listLength = this.listData?.length > 0 ? this.listData?.length : 0;
    let assessmentNotFilledLength = this.assessmentNotFilled?.length > 0 ? this.assessmentNotFilled?.length : 0;
    if (listLength > 0) {
      listLength = listLength
    } else {
      listLength = 1;
    }
    this.rasoptionsSecond = {
      chart: {
        type: 'pie',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      },
      title: {
        verticalAlign: 'middle',
        align: 'center',
        y: 30,
        text: "<span style='color: #7e7e7e'><strong class='headTotalFS'>" + assessmentNotFilledLength + "</strong>(" + percentageANF + "%)</span><br> Risks<br><strong>Not Filled<strong></br>"
      },
      tooltip: {
        enabled: true,
        pointFormat: 'Click to view more information',
        headerFormat: '',
        footerFormat: ''
      },
      plotOptions: {
        pie: {
          innerSize: 140,
          depth: 0,
          borderWidth: 0,
          point: {
            events: {
              click: (event: any) => {
                if (event.point) {
                  this.openPopUp("notFilledContainerSecond")
                }
              }
            }
          },
          shadow: true,
          dataLabels: {
            enabled: false
          },
          colors: ['#ffb26a', '#dddddd']
        },
        series: {
          cursor: 'pointer',
        }
      },
      series: [{
        data: [
          ['Assessments Not Filled', assessmentNotFilledLength],
          ['Filled Assessments', listLength - assessmentNotFilledLength]
        ]
      }],
    };
    this.raschartFirst = Highcharts.chart("overdueContainerFirst", this.rasoptionsFirst);
    this.raschartSecond = Highcharts.chart("notFilledContainerSecond", this.rasoptionsSecond);
  }

  openPopUp(data: any) {
    var values;
    var dataList;
    var title;
    let todayDate = new Date().getDate();
    let todayMonth = new Date().getMonth();
    let todayYear = new Date().getFullYear();
    let todayTime = new Date(todayYear, todayMonth, todayDate).getTime();
    if (data == 'overdueContainerFirst') {
      title = "Risks - Unit Overdue";
      dataList = this.listData.filter((ele: any) => {
        let responseTime = new Date(
          Number(ele.ProposedCompletionDate.substring(0, 4)),
          Number(ele.ProposedCompletionDate.substring(5, 7)) - 1,
          Number(ele.ProposedCompletionDate.substring(8, 10))
        ).getTime();
        return (ele.ScheduleInherentRiskStatusName == "New" && (responseTime < todayTime)) || (ele.ScheduleInherentRiskStatusName == "Draft" && (responseTime < todayTime))
      });
      values = [{
        total: this.unitOverdue.totalUnitOverdue,
        schedule: this.unitOverdue.scheduledUnitOverdue,
        percentage: this.unitOverdue.percentageUnitOverdue,
        type: "Unit",
        ScheduleInherentRiskStatusName: "Overdue"
      }]
    } else {
      title = "Risks - Not filled/Not submitted";
      dataList = this.listData.filter(
        (ele: any) => ele.ScheduleInherentRiskStatusName == "New" || ele.ScheduleInherentRiskStatusName == "Draft"
      )
      values = [{
        total: this.assessmentNotFilled.totalassessmentNotFilled,
        schedule: this.assessmentNotFilled.scheduledassessmentNotFilled,
        percentage: this.assessmentNotFilled.percentageassessmentNotFilled,
        type: "Assessments",
        ScheduleInherentRiskStatusName: "Not Filled"
      }]
    }
    if (dataList?.length > 0) {
      const rsca = this.dialog.open(RscaPopupComponent, {
        disableClose: false,
        width: '70vw',
        data: {
          data: dataList,
          title: title
        }
      })
    } else {
      this.dashboardService.popupInfo(values[0].type + " " + values[0].ScheduleInherentRiskStatusName, 'No Records Available')
    }
  }
}