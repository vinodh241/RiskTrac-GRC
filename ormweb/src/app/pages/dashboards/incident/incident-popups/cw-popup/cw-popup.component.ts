import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IncidentComponent } from 'src/app/pages/incident-list/incident/incident.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
export interface QuarterList {
    quarterdata: string;
    totaldata: number;
}


@Component({
  selector: 'app-cw-popup',
  templateUrl: './cw-popup.component.html',
  styleUrls: ['./cw-popup.component.scss']
})
export class CwPopupComponent implements OnInit {
    displayedColumns: string[] = ['Position','QuarterWisePosition', 'IncidentCode', 'IncidentTitle', 'Status','IncidentDate','ReportingDate','Amount'];
    dataSource = new MatTableDataSource<Element>();
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
    dataSet: any;
    currency = environment.currency;
  constructor(    public dashboardservice: DashboardService,
    public dialogRef: MatDialogRef<CwPopupComponent>,
    public utils: UtilsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,) { }

  ngOnInit(): void {
    this.dataSet = this.parent.data
    // console.log("🚀 ~ CwPopupComponent ~ ngOnInit ~ this.dataSet:", this.dataSet)
    this.currency = this.dataSet[0]?.Currency;
    this.title = this.parent.title
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
