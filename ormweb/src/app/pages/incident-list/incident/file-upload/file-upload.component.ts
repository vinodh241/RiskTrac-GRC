import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { MatDialog } from '@angular/material/dialog';
import { EvidenceFileComponent } from 'src/app/core-shared/file-upload/evidence-files/evidence-file.component';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/services/utils/utils.service';

// export const ValidExtension = ["pdf", "xls", "xlsx"];

export interface Evidence {
    EvidenceID: number;
    OriginalFileName: string;
    Remark: string;
    CreatedDate: string;
}

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit {
    displayedColumns: String[] = ['Index', 'UploadFile'];
    recEvidences: MatTableDataSource<Evidence> = new MatTableDataSource();

    @Input() evdname: string = "";
    @Input() recid: number = -1;
    @Input() disabled: boolean = true;

    @Output() refresh: EventEmitter<any> = new EventEmitter();

    constructor(
        public service: IncidentService,
        public dialog: MatDialog,
        public utils: UtilsService
    ) {
        service.gotIncident.subscribe(value => {
            if (value == true) {
                setTimeout(() => {
                    this.recEvidences.data = service.recEvidences.filter((rec: any) => rec.RecommendationID == this.recid)
                    this.refresh.emit(this.recEvidences.data)
                }, 500);
            }
        })
    }

    ngOnInit(): void {
        this.displayedColumns.push(this.evdname == "Recommendation" ? "CreatedDate" : "Remark")
        this.displayedColumns.push("AddIcon")
    }

    uploadEvidence(event: any) {
        event.preventDefault();
        const dialogRef = this.dialog.open(EvidenceFileComponent, {
            disableClose: true,
            height: '50vh',
            width: '50vw',
            data: {
                evdname: this.evdname,
                recData: this.recEvidences,
                recID: this.recid
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result == undefined || result == ''){
                // this.refresh.emit(this.recEvidences.data)
                this.refresh.emit(this.recEvidences.filteredData)
            }
        })
    }

    remove(data: any): void {
        let index = -1
        switch (this.evdname) {
            case 'Incident':
                index = this.service.incEvidences.data.indexOf(data)
                if (index !== -1) {
                    this.service.incEvidences.data.splice(index, 1)
                    this.service.incEvidences.data = [...this.service.incEvidences.data]
                }
                break
            case 'RCA':
                index = this.service.rcaEvidences.data.indexOf(data)
                if (index !== -1) {
                    this.service.rcaEvidences.data.splice(index, 1)
                    this.service.rcaEvidences.data = [...this.service.rcaEvidences.data]
                }
                break
            case 'Recommendation':
                index = this.recEvidences.data.indexOf(data)
                if (index !== -1) {
                    this.recEvidences.data.splice(index, 1)
                    this.recEvidences.data = [...this.recEvidences.data]
                    this.refresh.emit(this.recEvidences.data)
                }
                break
        }
    }
}

