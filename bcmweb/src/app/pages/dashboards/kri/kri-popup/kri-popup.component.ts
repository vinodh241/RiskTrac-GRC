import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { KriScoringComponent } from 'src/app/pages/kri-scoring/kri-scoring.component';
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
  displayedColumns: string[] = ['id', 'kriCode', 'unit', 'period', 'date', 'measurment', 'kriValue','remarks'];
  dataSource = new MatTableDataSource<Element>(this.data.data);
  count=0
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  constructor(
    public _router:Router ,
    public dialog: MatDialog,
    public DashboardService: DashboardService,
    public matDialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public kriService:KriService,
    public utils:UtilsService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSet = this.data.data;
        console.log('this.dataSet  --kri: ',this.data.data)

    let index = 1
    for (let i =0; this.data.data?.length > 0; i++) {
      this.data.data[i].sno = index + i
    }
    //     this.KRIStatus = this.data.KriStatus;
    //     console.log('mkkkm', this.KRIStatus);
    //     // this.dataSourceData = [...this.dataSet,]
    //     // Update the KRIStatus value for all objects in the JSON
    //    this.dataSet.map((obj: any) => {
    //          obj['KRIStatusData']= this.KRIStatus ;

    //     });

    //     // Convert the updated JSON data to a string
    //     //   const updatedJsonString = JSON.stringify(updatedJsonData);
    //     console.log(
    //         '🚀 ~ file: kri-popup.component.ts:62 ~ KriPopupComponent ~ ngAfterViewInit ~ updatedJsonData:',
    //         this.dataSet
    //     );
    //     console.log('this.dataSet', this.dataSet);
    //     console.log('this.KRIStatus', this.KRIStatus
  }


  formatDate(date: any) {
    if(date != null){
      let d = new Date(date);
      let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      // console.log(`${da}-${mo}-${ye}`);
      return `${da} ${mo} ${ye}`
    }else{
      return "";
    }

  }

  ngOnInit(): void {
    
    this.kriService.getkrireporteddata()

  }

  closeAllPopup(){
    this.matDialog.closeAll()
  }

  passingRoutingData(dt:any){
    var data = []
    data.push(dt)
    const kriPopup = this.dialog.open(KriScoreComponent, {
      disableClose: false,
      height: '80vh',
      width: '80vw',
      data: {mode:'unit-3',kriScore:data},
    })
    // this.DashboardService.KeyRiskIndicatorsteps.step3=dt
    // console.log(this.DashboardService.KeyRiskIndicatorsteps)
  //   this._router.navigate(['kri-scoring']);
  //   console.log('dt :',dt)
  //  this.DashboardService?.KeyRiskIndicatorScore.push(dt)

  }


 openPopUp(id:any): void {
    let filterDate

    const kriPopup = this.dialog.open(KriMigrationUnitComponent, {
      disableClose: false,
      height: '80vh',
      width: '40vw',
      data: {mode:'unit-3'},
    })
    // console.log('Dinesh') value:this.getIndex(this.data.dat),kri:filterDate,name:this.getName(id),id:id
  }

}
