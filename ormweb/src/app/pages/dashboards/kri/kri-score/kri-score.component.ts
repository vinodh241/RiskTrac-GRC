import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KriService } from 'src/app/services/kri/kri.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-kri-score',
  templateUrl: './kri-score.component.html',
  styleUrls: ['./kri-score.component.scss']
})
export class KriScoreComponent implements OnInit {
  displayedColumns: string[] = [
    'kricode', 'indicator', 'Measurmentfrequency', 'Target', 'Kritype', 'tvalue-1', 'tvalue-2', 'tvalue-3',
    'tvalue-4', 'tvalue-5', 'period', 'date', 'measurement', 'krivalue', 'Remarks', 'status',
    'upload',
  ]; // 'action'
  dataSource: any;
  period: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    private dialogRef: MatDialogRef<KriScoreComponent>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public kriService: KriService,
    public utils: UtilsService,
  ) { }

  ngOnInit(): void {
    let gs = this.data.kriScore;
    var ReportingFrequencyID;
    if (this.kriService.kriMeasurmentsReportingFrequncy == 'Monthly') {
      ReportingFrequencyID = 1
    } else if (this.kriService.kriMeasurmentsReportingFrequncy == 'Quarterly') {
      ReportingFrequencyID = 2
    } else if (this.kriService.kriMeasurmentsReportingFrequncy == 'Semi Annual') {
      ReportingFrequencyID = 3
    } else {
      ReportingFrequencyID = 4
    }
    this.getPeriod(ReportingFrequencyID);
    var singlePerid;
    var date = this.data.kriScore[0].Date;
    var currentDateObj = new Date(date);
    var numberOfMlSeconds = currentDateObj.getTime();
    var newDateObj = new Date(numberOfMlSeconds);
    let month = new Date(newDateObj).getMonth();
    let year = ' ' + new Date(date).getFullYear() + ' '
    if (this.kriService.kriMeasurmentsReportingFrequncy == 'Monthly') {
      singlePerid = this.months[month] + year;
    } else if (this.kriService.kriMeasurmentsReportingFrequncy == 'Quarterly') {
      singlePerid = this.getQuarternew(newDateObj)
    } else if (this.kriService.kriMeasurmentsReportingFrequncy == 'Semi Annual') {
      singlePerid = month < 6 ? 'Jan-Jun' + year : 'Jul-Dec ' + year;
    } else {
      singlePerid = 'Jan-Dec ' + year;
    }
    let kris
    if (this.period != singlePerid) {
      kris = this.kriService.kriMeasurementold.filteredData
    } else {
      kris = this.kriService.kriMeasurement.filteredData
    }
    kris.filter((da: any) => {
      if (da.MetricID == gs[0].MetricID) {
        if (da.evidences != null && da.evidences != undefined) {
          if (da.evidences.length > 0) {
            this.data.kriScore[0].evidences = da.evidences;
          } else {
            this.data.kriScore[0].evidences = [];
          }
        }
        if (da.PreviousScoring != null && da.PreviousScoring != undefined) {
          if (da.PreviousScoring.length > 0) {
            this.data.kriScore[0].PreviousScoring = da.PreviousScoring;
          } else {
            this.data.kriScore[0].PreviousScoring = [];
          }
        }
      }
    })
    this.dataSource = this.data.kriScore;
    console.log('KriScoreComponent-this.dataSource::', JSON.stringify(this.dataSource))
  }

  getPreviousScoring(row: any) {
    if (
      row &&
      row.PreviousScoring &&
      row.PreviousScoring.length > 0 &&
      row.PreviousScoring
    ) {
      return row.PreviousScoring.sort(
        (a: any, b: any) =>
          new Date(b.Date).getTime() - new Date(a.Date).getTime()
      );
    } else {
      return null;
    }
  }

  OnfilesdataOP(evt: any) {
    let fileEvidences = evt.Evidences;
    if (fileEvidences) {
      fileEvidences.forEach((ele: any) => {
        if (!ele.MetricID) {
          ele['MetricID'] = evt.inputData.MetricID;
        }
      });
      this.dataSource.data.forEach((metric: any) => {
        if (metric.MetricID == evt.inputData.MetricID) {
          metric.evidences = fileEvidences;
        }
      });
    }
  }

  getRemarkData(data: any): any {
    let dbt = 0
    let bol = true
    if (data != null) {
      for (let i of data) {
        dbt += 1
      }
    }
    if (data == null || dbt <= 0) {
      bol = true
    } else {
      bol = false
    }
    return bol
  }

  getPeriod(id: any) {
    let frequencyId = id;
    var currentDateObj = new Date();
    var numberOfMlSeconds = currentDateObj.getTime();
    var newDateObj = new Date(numberOfMlSeconds);
    let month = new Date(newDateObj).getMonth();
    let year = ' ' + new Date().getFullYear() + ' '
    switch (frequencyId) {
      case 1:
        this.period = this.months[month] + year;
        break;
      case 2:
        this.period = this.getQuarter();
        break;
      case 3:
        this.period = month < 6 ? 'Jan-Jun ' + year : 'Jul-Dec ' + year
        break;
      case 4:
        this.period = 'Jan-Dec ' + year
        break;
    };
  }

  getQuarternew(newDateObj: any) {
    var finaltype;
    var date = new Date(newDateObj);
    var month = Math.floor(date.getMonth() / 3) + 1;
    month -= month > 4 ? 4 : 0;
    var year = date.getFullYear();
    switch (month) {
      case 1:
        finaltype = "Jan-Mar " + year;
        break;
      case 2:
        finaltype = "Apr-Jun " + year;
        break;
      case 3:
        finaltype = "Jul-Sep " + year
        break;
      case 4:
        finaltype = "Oct-Dec " + year
        break;
      default:
        break;
    }
    return finaltype;
  }

  getQuarter() {
    var finaltype;
    var date = new Date();
    var month = Math.floor(date.getMonth() / 3) + 1;
    month -= month > 4 ? 4 : 0;
    var year = date.getFullYear();
    switch (month) {
      case 1:
        finaltype = "Jan-Mar " + year;
        break;
      case 2:
        finaltype = "Apr-Jun " + year;
        break;
      case 3:
        finaltype = "Jul-Sep " + year
        break;
      case 4:
        finaltype = "Oct-Dec " + year
        break;
      default:
        break;
    }
    return finaltype;
  }
}