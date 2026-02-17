import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-metrics',
    templateUrl: './metrics.component.html',
    styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
    dataForm: any = []
    displayedColumns: string[] = ['idx', 'units', 'risk-metric'];
    dataSource: any = []
    notstarted = 0
    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<MetricsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        data.data.forEach((group:any) => {
            group.forEach((metric:any) => {
                
            });
        });
    }

    ngOnInit(): void {
        console.log(this.data.data)
    }
}
