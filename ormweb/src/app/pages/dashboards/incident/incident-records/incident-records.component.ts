import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
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
    displayedColumns: string[] = ['Position','QuarterWisePosition', 'IncidentTitle', 'Status','IncidentDate','ReportingDate','Amount'];
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

    constructor(
        public dashboardservice: DashboardService,
        public dialogRef: MatDialogRef<IncidentRecordsComponent>,
        public utils: UtilsService,
        @Inject(MAT_DIALOG_DATA) public parent: any,
    ) {}

    ngOnInit(): void {
        // console.log("id",this.parent.id)
        this.tableData = this.parent.id
        this.criticalWiseData = this.parent.criticalData
        this.criticalId = this.parent.popup
        this.tableData = this.tableData.filter(
            (ele:any) =>
                ele.selected
        )
        // console.log("this.tableData",this.tableData[0])

        if(this.parent.popup == "criticaldata"){
            this.cwGraphFlag = true
        }
        // console.log("cwGraphFlag",this.cwGraphFlag)
        this.dataSource = this.tableData[0].countdata;
        // console.log('this.unitWiseData', this.dataSource);
    }

    cancel() {
        // this.model.framework= undefined ;
        this.dialogRef.close();
    }
}
