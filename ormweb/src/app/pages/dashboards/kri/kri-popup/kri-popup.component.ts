import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { KriMigrationUnitComponent } from '../kri-migration-unit/kri-migration-unit.component';
import { KriScoreComponent } from '../kri-score/kri-score.component';
import { KriService } from 'src/app/services/kri/kri.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
export interface KriData {
  Date: string,
  Frequency: string,
  FrequencyID: number,
  Indicator: string,
  KRICode: string,
  KRI_Target: string,
  KRI_Type: string,
  KRI_Value: string,
  MeasurmentFrequency: string,
  MeasurmentID: string,
  MeasurmentValue: number,
  MetricID: string,
  Period: string,
  Quater: string,
  Remark: string,
  ThresholdID: number,
  ThresholdValue1: number
  ThresholdValue2: number
  ThresholdValue3: number
  ThresholdValue4: number
  ThresholdValue5: number
  Unit: string,
  UnitID: number
}
@Component({
  selector: 'app-kri-popup',
  templateUrl: './kri-popup.component.html',
  styleUrls: ['./kri-popup.component.scss']
})
export class KriPopupComponent implements OnInit {
  displayedColumns: string[] = ['id', 'kriCode', 'unit', 'period', 'date', 'measurment', 'kriValue', 'remarks'];
  dataSource = new MatTableDataSource<Element>(this.data.data);
  count = 0
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  constructor(
    public _router: Router,
    public dialog: MatDialog,
    public DashboardService: DashboardService,
    public matDialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public kriService: KriService,
    public utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.kriService.getkrireporteddata()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // console.log('this.dataSet  --kri: ', this.data.data)
    let index = 1;
    for (let i = 0; i < this.data.data?.length; i++) {
      this.data.data[i]['sno'] = index + i;
    }
  }

  formatDate(date: any) {
    if (date != null) {
      let d = new Date(date);
      let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      return `${da} ${mo} ${ye}`
    } else {
      return "";
    }
  }

  closeAllPopup() {
    this.matDialog.closeAll()
  }

  passingRoutingData(dt: any) {
    var data = []
    data.push(dt)
    const kriPopup = this.dialog.open(KriScoreComponent, {
      disableClose: false,
      height: '80vh',
      width: '80vw',
      data: { mode: 'unit-3', kriScore: data },
    })
  }

  openPopUp(id: any): void {
    let filterDate
    const kriPopup = this.dialog.open(KriMigrationUnitComponent, {
      disableClose: false,
      height: '80vh',
      width: '40vw',
      data: { mode: 'unit-3' },
    })
  }
}