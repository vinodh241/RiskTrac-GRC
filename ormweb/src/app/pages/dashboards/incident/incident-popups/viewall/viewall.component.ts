import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CwPopupComponent } from '../cw-popup/cw-popup.component';
import { IncidentCwComponent } from '../incident-cw/incident-cw.component';
import { IncidentRecordsComponent } from '../incident-records/incident-records.component';

export interface QuarterList {
    quarterdata: string;
    totaldata: number;
}


@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrls: ['./viewall.component.scss']
})
export class ViewallComponent implements OnInit {
    displayedColumns: string[] = ['Position','IncidentUnit', 'TotalRecords', 'Percentage'];
    dataSource: MatTableDataSource<QuarterList> = new MatTableDataSource();
    RawData: any;
    listdata: any;
    yearData: any;
    quaterData: any;
    quarterFilter: any;
    // dataSource = new MatTableDataSource<Element>(this.data);

  constructor( public dashboardservice: DashboardService,
    public dialogRef: MatDialogRef<CwPopupComponent>,
    public utils: UtilsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public parent: any) { }

  ngOnInit(): void {
    this.dashboardservice.gotincidentDashboardMaster.subscribe((value) => {
        if (value == true) {
            this.RawData = this.dashboardservice.dashboardIncMaster;
            // console.log('this.RawData: ', this.RawData);
            this.dashboardservice.gotYearQuater.subscribe((value) => {
                this.yearData = this.dashboardservice.yearValue;
                this.quaterData = this.dashboardservice.quaterValue;
            let currentDate = new Date(); // Get the current date
            let currMonth = currentDate.getMonth() + 1;
            let currQuarter = Math.ceil(currMonth / 3);
                let currentQuarter =
                    'Q' +
                    Math.ceil((currentDate.getMonth() + 1) / 3) +
                    '-' +
                    currentDate.getFullYear().toString().substr(2, 2); // Get the current quarter
                    // console.log('currentQuarter: ', currentQuarter);

                    this.quarterFilter =
                    'Q' +
                    (this.quaterData !== undefined && this.quaterData > 0
                        ? this.quaterData
                        : currQuarter) +
                    '-' +
                    this.yearData.toString().substr(2, 2);
                    // console.log('this.quarterFilter: ', this.quarterFilter);


            this.listdata = this.RawData.filter(
                (data: any) =>(data.StatusID != 1 && data.StatusID != 11 && data.StatusID != 12 && data.StatusID != 17 && data.StatusID != 18 && data.StatusID != 13 && data.StatusID != 14 && data.StatusID != 15 && data.StatusID != 16) && data.Quater === this.quarterFilter
            );
            // console.log(' this.listdata : ',  this.listdata );

            // this.countIncidentTypes(this.listdata)
            })
        }
    });
    this.dataSource = this.parent.id;
    // console.log("this.dataSource",this.dataSource)
  }

  getDecimalData(num: any) {
    return parseFloat(num).toFixed(0.0);
}
unitData(unitName: any){
    // console.log('unitName: ', unitName);
    // console.log('this.listdata: ', this.listdata);
    const dialog = this.dialog.open(IncidentRecordsComponent, {
        disableClose: true,
        maxWidth: '100vw',
        panelClass: 'full-screen-modal',
        data: {
            title: unitName,
            id: this.listdata.filter(
                (ele: any) =>
                    ele.IncidentUnitName.trim().toLowerCase() ==
                    unitName.trim().toLowerCase()
            ),
        },
    });
    dialog.afterClosed().subscribe((result) => {});
}

}
