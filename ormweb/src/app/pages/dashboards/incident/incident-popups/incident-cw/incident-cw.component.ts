import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IncidentComponent } from 'src/app/pages/incident-list/incident/incident.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
export interface QuarterList {
    quarterdata: string;
    totaldata: number;
}

@Component({
  selector: 'app-incident-cw',
  templateUrl: './incident-cw.component.html',
  styleUrls: ['./incident-cw.component.scss']
})
export class IncidentCwComponent implements OnInit {
    unitWiseData: any;
    displayedColumns: string[] = ['Position','QuarterWisePosition','IncidentCode','NoRecommendation', 'IncidentTitle', 'Status','IncidentDate','ReportingDate','Amount'];
    dataSource: MatTableDataSource<QuarterList> = new MatTableDataSource();
    tableData: any;
    selecteddata: any;
    allCount: any;
    filterSelected: any;
    criticalWiseData: any;
    criticalId: any;
    cwGraphFlag: boolean = false;
    countData: any;
    tableData1: any;
    title: any;
    id: any;
    openFlag: boolean = false
    overdueFlag: boolean = false
    rejectedFlag: boolean = false
    currency = environment.currency;

  constructor(
    public dashboardservice: DashboardService,
    public dialogRef: MatDialogRef<IncidentCwComponent>,
    public utils: UtilsService,
    public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public parent: any,
  ) { }

  ngOnInit(): void {
    // console.log("this.parent.id",this.parent.dataId)
    this.tableData = this.parent.id
    this.currency = this.tableData[0]?.Currency
    this.title = this.parent.title
    this.id = this.parent.dataId
            if(this.id == "1"){
                this.openFlag = true
                // console.log("1")
            }else if(this.id == "2"){
                this.overdueFlag = true
                // console.log("2")
            }else if(this.id == "3"){
                this.rejectedFlag = true
                // console.log("3")
            }

    // console.log("this.tableData",this.tableData)

    // console.log("🚀 ~ file: incident-cw.component.ts:43 ~ IncidentCwComponent ~ ngOnInit ~ this.tableData:", this.tableData)
  }

  cancel(){
    this.dialogRef.close();
  }

  openIncident(id: number): void {
    // this.dialogRef.close();
    // this.router.navigate(['incident-list']);

    const dialog = this.dialog.open(IncidentComponent, {
        disableClose: true,
         maxWidth: '100vw',
         //maxHeight: '100vh',
        // height: '100%',
        // width: '100%',
        panelClass: 'full-screen-modal',
        data: {
            id: id
        }
    });
    // if(id) {
    //  this.service.isIncidentEditable = false;
    // } else {
    //  this.service.isIncidentEditable = true;

    // }
    // console.log(this.service.isIncidentEditable);
    // this.service.isIncidentEditable = false;
    dialog.afterClosed().subscribe(result => {
        // if(this.service) {
        //     console.log("Before cleaning incident...", this.service.incident)
        //     this.service.cleanIncident()
        //     console.log("After cleaning incident...", this.service.incident)
        // }
    })
}


}
