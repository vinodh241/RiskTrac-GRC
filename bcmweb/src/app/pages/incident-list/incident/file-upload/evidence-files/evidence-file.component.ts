import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { fileNamePattern } from 'src/app/core-shared/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

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
    validFileNameErr: boolean = false;

    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });

    submitted: boolean = false;
    remarkError: boolean = false;
    // evidenceIdError: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<EvidenceFileComponent>,
        @Inject(MAT_DIALOG_DATA) public parent: any,
        public service: IncidentService,
        private utils: UtilsService,
        private _dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any
    ) { }

    ngOnInit(): void {
    }

    getEvidenceDetails() {
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
        console.log("this.remarkError::", this.remarkError);
    }

    // onEvidenceId(event: any) {
    //     if (event.target.value && event.target.value.trim() != '') {
    //         this.evidenceIdError = false;
    //     } else {
    //         this.evidenceIdError = true;
    //     }
    //     console.log("this.evidenceIdError::", this.evidenceIdError);
    // }

    validateSave() {
        this.submitted = true;
        if (this.uploader.queue.length < 1) {
            this.uploaderror = "No file selected. Please choose a file to upload.";
        } else if (this.remarks == "" && this.parent.evdname != 'Recommendation') {
            this.remarkError = true;
        } else {
            this.fileUpload();
        }
    }

    fileUpload() {
        switch(this.parent.evdname) {
            case 'Incident':
                this.service.uploadIncidentEvidence(this.uploadFile, this.remarks)
                this.cancel()
                break
            case 'RCA':
                this.service.uploadRCAEvidence(this.uploadFile, this.remarks)
                this.cancel()
                break
            case 'Recommendation':
                this.service.uploadRecommendationEvidence(this.uploadFile).subscribe(res => {
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
        }
    }

    cancel() {
        // this.model.framework= undefined ;
        this.uploaderror = "";
        this.filename = "";
        this.uploadFile.append('UploadFile', "");
        this.uploader.queue = [];
        this.uploadFile = new FormData();
        this.invalidfile = false;
        this.invalidfilesize = false;
        this.remarks = "";
        this.dialogRef.close();
    }

    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this._dialog.open(InfoComponent, {
            id: "InfoComponent",
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

