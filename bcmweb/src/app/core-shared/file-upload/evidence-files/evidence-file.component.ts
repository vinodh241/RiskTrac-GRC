import { DOCUMENT } from '@angular/common';
import { Component, Inject, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { fileNamePattern } from '../../commonFunctions';

export const ValidExtension = ["pdf", "docx", "jpeg", "xlsx", "eml", "png", "jpg"];

@Component({
    selector: 'app-evidence-file',
    templateUrl: './evidence-file.component.html',
    styleUrls: ['./evidence-file.component.scss']
})
export class EvidenceFileComponent implements OnInit {
    uploadFilename: any;
    uploadFile: FormData = new FormData();
    filename: any = '';
    invalidfile: boolean = false;
    invalidfilesize = false;
    uploaderror: string = "";
    remarks: string = "";
    inputData: any;
    validFileNameErr: boolean = false;
    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });

    submitted: boolean = false;
    remarkError: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<EvidenceFileComponent>,
        @Inject(MAT_DIALOG_DATA) public parent: any,
        public incidentservice: IncidentService,
        public kriService: KriService,
        private riskAssessmentservice: RiskAssessmentService,
        private utils: UtilsService,
        private _dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any
    ) { }

    ngOnInit(): void {

    }

    getEvidenceDetails() {
        console.log("this.uploadFilename", this.uploadFilename)

        // this.uploadFile.delete('UploadFile');
        if (this.uploader.queue.length > 1) {
            let latestFile = this.uploader.queue[this.uploader.queue.length - 1];
            this.uploader.queue = [];
            this.uploadFile = new FormData();
            this.uploader.queue.push(latestFile);
        }

        for (let j = 0; j < this.uploader.queue.length; j++) {
            const fileItem = this.uploader.queue[j]._file;
            this.filename = fileItem.name;
            const extension = this.filename.split('.').pop();
            if (ValidExtension.includes(extension.toLowerCase())) {
                this.invalidfile = false;
                this.uploadFile.append('UploadFile', fileItem);
                this.uploaderror = "";
            } else {
                this.invalidfile = true;
                this.uploaderror = ""
            }
            const bytesize = fileItem.size;
            let sizeInMB: any;
            sizeInMB = (bytesize / (1024 * 1024)).toFixed(2);
            if (sizeInMB <= 10) {
                this.invalidfilesize = false;
            }
            else {
                this.invalidfilesize = true;
            }
            if (fileNamePattern(this.uploadFilename)) {
                this.validFileNameErr = true;
            }else {
                this.validFileNameErr = false;
            }
            this.uploadFile.append('Extension', fileItem.type);
        }
    }

    onRemark(event: any) {
        if (event.target.value && event.target.value.trim() != '') {
            this.remarkError = false;
        } else {
            this.remarkError = true;
        }
    }



    validateSave() {
        this.submitted = true;
        if (this.uploader.queue.length < 1) {
            this.uploaderror = "No file selected. Please choose a file to upload.";
        } else if (this.remarks == "" && this.parent.evdname != 'Recommendation' && this.parent.evdname != 'Risk Unit Maker' && this.parent.evdname != 'Kri Scoring') {
            this.remarkError = true;
        } else {
            this.fileUpload();
        }
    }

    fileUpload() {
        switch (this.parent.evdname) {
            case 'Incident':
                this.incidentservice.uploadIncidentEvidence(this.uploadFile, this.remarks)
                this.cancel()
                break
            case 'RCA':
                this.incidentservice.uploadRCAEvidence(this.uploadFile, this.remarks)
                this.cancel()
                break
            case 'Recommendation':
                this.incidentservice.uploadRecommendationEvidence(this.uploadFile).subscribe(res => {
                    if (res.success == 1) {
                        let evd = res.result.fileData[0]
                        this.parent.recData.data.push({ "EvidenceID": evd.EvidenceID, "RecommendationID": this.parent.recID, "OriginalFileName": evd.OriginalFileName, "Remark": "", "CreatedDate": evd.CreatedDate });
                        this.parent.recData.data = [...this.parent.recData.data]
                        this.cancel()
                    } else {
                        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.popupInfo("Unsuccessful", res.error.errorMessage);
                    }
                });
                break
            case 'Risk Unit Maker':

                this.uploadFile.delete('remarks');
                this.uploadFile.append('remarks', this.remarks);
                this.riskAssessmentservice.uploadRiskUnitMaker(this.uploadFile).subscribe(res => {
                    if (res.success == 1) {
                        let evd = res.result.fileData[0]
                        this.parent.recData.data.push({
                            "EvidenceID": evd.EvidenceID,
                            "FileContentID": evd.FileContentID,
                            "FileName": evd.FileName,
                            "Remark": evd.Remark,
                            "CreatedDate": evd.CreatedDate
                        });
                        this.parent.recData.data = [...this.parent.recData.data]
                        this.cancel()
                    } else {
                        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.popupInfo("Unsuccessful", res.error.errorMessage);
                    }
                });
                break
            case 'Kri Scoring':
                this.uploadFile.delete('remarks');
                this.uploadFile.append('remarks', this.remarks);
                this.kriService.uploadKriScoring(this.uploadFile).subscribe(res => {
                    if (res.success == 1) {
                        let evd = res.result.fileData[0]
                        this.parent.recData.data.push({
                            "EvidenceID": evd.EvidenceID,
                            "FileContentID": evd.FileContentID,
                            "FileName": evd.FileName,
                            "Remark": evd.Remark,
                            "CreatedDate": evd.CreatedDate
                        });
                        this.parent.recData.data = [...this.parent.recData.data]
                        this.cancel()
                    } else {
                        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.popupInfo("Unsuccessful", res.error.errorMessage);
                    }
                });
                break
        }
    }

    cancel() {
        this.uploaderror = "";
        this.filename = "";
        this.uploadFile.append('UploadFile', "");
        this.uploader.queue = [];
        this.uploadFile = new FormData();
        this.invalidfile = false;
        this.invalidfilesize = false;
        this.validFileNameErr = false;
        this.remarks = "";
        this.dialogRef.close();
    }

    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this._dialog.open(InfoComponent, {
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: message
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
                // this.router.navigate(['']);
            }, timeout)
        });
    }
}

