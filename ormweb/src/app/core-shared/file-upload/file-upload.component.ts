import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvidenceFileComponent } from './evidence-files/evidence-file.component';
import { MatTableDataSource } from '@angular/material/table';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { saveAs } from 'file-saver';
import { Subscription, interval } from 'rxjs';

// export const ValidExtension = ["pdf", "xls", "xlsx"];

export interface Evidence {
    EvidenceID: number;
    FileName: string;
    Remark: string;
    CreatedDate: string;
}

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit, OnDestroy {
    @Input() recid: number = -1;
    @Input() disabled: boolean = true;
    @Output() filesdataOP: EventEmitter<any> = new EventEmitter();
    @Output() isFileUploadChanged: EventEmitter<boolean> = new EventEmitter();
    @Input() inputData: any;
    displayedColumns: String[] = ['Index', 'UploadFile', 'Remark'];
    recEvidences: MatTableDataSource<Evidence> = new MatTableDataSource();
    @Input() evdname: string = "";
    @Input() showFileIcon: boolean = false;
    // @Input() filesdata: Evidence[] = [];
    
    private refreshSubscription?: Subscription;
    private lastEvidenceCount: number = 0;

    constructor(
        public incidentservice: IncidentService,
        public kriService: KriService,
        private riskAssessmentservice: RiskAssessmentService,
        public dialog: MatDialog,
        public utils: UtilsService
    ) {

    }

    ngOnInit(): void {
        this.loadEvidences();
        
        // Ensure Remark column is included if not already present
        if (!this.displayedColumns.includes('Remark')) {
            this.displayedColumns.push('Remark');
        }
        if (!this.displayedColumns.includes('AddIcon')) {
            this.displayedColumns.push("AddIcon");
        }
        
        // Set up polling to refresh evidence data for Incident/RCA when inputData is not provided
        if (!this.inputData && (this.evdname === 'Incident' || this.evdname === 'RCA')) {
            this.lastEvidenceCount = this.recEvidences.data.length;
            this.refreshSubscription = interval(1000).subscribe(() => {
                this.checkAndRefreshEvidences();
            });
        }
    }
    
    ngOnDestroy(): void {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
    
    private loadEvidences(): void {
        let evidences: Evidence[] = [];
        
        // If inputData is provided and has evidences, use it
        if (this.inputData && this.inputData.evidences) {
            evidences = this.inputData.evidences;
        } 
        // Otherwise, check evdname and use service properties
        else if (this.evdname === 'Incident' && this.incidentservice.incEvidences) {
            evidences = this.mapServiceEvidenceToComponent(this.incidentservice.incEvidences.data || []);
        } 
        else if (this.evdname === 'RCA' && this.incidentservice.rcaEvidences) {
            evidences = this.mapServiceEvidenceToComponent(this.incidentservice.rcaEvidences.data || []);
        }
        
        this.recEvidences = new MatTableDataSource(evidences);
    }
    
    private checkAndRefreshEvidences(): void {
        if (!this.inputData) {
            let currentCount = 0;
            let newEvidences: Evidence[] = [];
            
            if (this.evdname === 'Incident' && this.incidentservice.incEvidences) {
                newEvidences = this.mapServiceEvidenceToComponent(this.incidentservice.incEvidences.data || []);
                currentCount = newEvidences.length;
            } else if (this.evdname === 'RCA' && this.incidentservice.rcaEvidences) {
                newEvidences = this.mapServiceEvidenceToComponent(this.incidentservice.rcaEvidences.data || []);
                currentCount = newEvidences.length;
            }
            
            // If count changed, refresh the data
            if (currentCount !== this.lastEvidenceCount) {
                this.recEvidences = new MatTableDataSource(newEvidences);
                this.lastEvidenceCount = currentCount;
            }
        }
    }

    /**
     * Maps service Evidence type (with OriginalFileName) to component Evidence type (with FileName)
     */
    private mapServiceEvidenceToComponent(serviceEvidences: any[]): Evidence[] {
        return serviceEvidences.map((ev: any) => ({
            EvidenceID: ev.EvidenceID,
            FileName: ev.OriginalFileName || ev.FileName || '',
            Remark: ev.Remark || '',
            CreatedDate: ev.CreatedDate || ''
        }));
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
                recID: this.recid,
                inputData: this.inputData
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            // Wait a bit for async upload to complete, then refresh
            setTimeout(() => {
                this.loadEvidences();
                this.lastEvidenceCount = this.recEvidences.data.length;
                this.isFileUploadChanged.emit(true);
                this.filesdataOP.emit({ 'Evidences': this.recEvidences.data, 'inputData': this.inputData });
            }, 500);
        })
    }

    get FileData(): MatTableDataSource<Evidence> {
        return this.recEvidences || [];
    }

    getFile(row: any, eviName: any) {
        switch (eviName) {
            case 'Incident': {
                // this.downloadFile(res);
                break
            }
            case 'RCA': {
                // this.downloadFile(res);
                break
            }
            case 'Recommendation': {
                // this.downloadFile(res);
                break
            }
            case 'Risk Unit Maker': {
                this.getRiskUnitMaker(row);
                break
            }
            case 'Kri Scoring': {
                this.getKriScoring(row);
                break
            }
        }
    }


    getKriScoring(row: any) {
        let data = { "EvidenceID": row.EvidenceID };
        this.kriService.downloadKriScoringEvidence(data).subscribe(res => {
            if (res.success == 1) {
                this.downloadFile(res);
            } else {

            }
        });
    }


    getRiskUnitMaker(row: any) {
        let data = {
            "CollectionID": row.CollectionID,
            "EvidenceID": row.EvidenceID,
            "FileContentID": row.FileContentID
        };

        this.riskAssessmentservice.downloadRiskUnitMakerEvidence(data).subscribe(res => {
            if (res.success == 1) {
                this.downloadFile(res);
            } else {

            }
        });
    }

    downloadFile(res: any) {
        const FileType = res["result"].fileData[0].FileContent.type;
        const TYPED_ARRAY = new Uint8Array(res.result.fileData[0].FileContent.data);
        const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
        const fileMetaType = res.FileType;
        const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
        const blob = new Blob([blobData], { type: fileMetaType });
        // [".xlsx", ".pdf",".docx",".jpeg"],
        // saveAs(blob, row.FileName.split('.')[0] + fileMetaType);
        saveAs(blob, res.result.fileData[0].FileName)
    }

    convertBase64ToBlobData(base64Data: any, contentType: string) {
        contentType = contentType || '';
        let sliceSize = 1024;
        let byteCharacters = window.atob(decodeURIComponent(base64Data));
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);

            let bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    remove(row: any, eviName: any): void {
        let index = -1;
        index = this.recEvidences.data.indexOf(row)
        if (index !== -1) {
            this.recEvidences.data.splice(index, 1)
            this.recEvidences.data = [...this.recEvidences.data]
        }
        this.isFileUploadChanged.emit(true);
        this.filesdataOP.emit({ 'Evidences': this.recEvidences.data, 'inputData': this.inputData });

    }


}

