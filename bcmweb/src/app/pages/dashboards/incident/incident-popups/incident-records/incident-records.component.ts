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
    selector: 'app-incident-records',
    templateUrl: './incident-records.component.html',
    styleUrls: ['./incident-records.component.scss'],
})
export class IncidentRecordsComponent implements OnInit {
    // @Input() data: any
    unitWiseData: any;
    displayedColumns: string[] = ['Position','QuarterWisePosition', 'IncidentCode','IncidentTitle', 'Status','IncidentDate','ReportingDate','Amount'];
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
    currency = environment.currency;

    constructor(
        public dashboardservice: DashboardService,
        public dialogRef: MatDialogRef<IncidentRecordsComponent>,
        public utils: UtilsService,
        public dialog: MatDialog,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public parent: any,
    ) {}

    ngOnInit(): void {
        this.tableData = this.parent.id
        this.title = this.parent.title
        console.log("this.tableData",this.tableData)
        this.dataSource = this.tableData
    }

    cancel() {
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
