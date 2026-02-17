import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RiskAppetiteViewComponent } from '../../pages/risk-appetite-documents/risk-appetite-view/risk-appetite-view.component';
import { RiskAppetiteService } from 'src/app/services/risk-appetite/risk-appetite.service';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { saveAs } from 'file-saver';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { fileNamePattern } from 'src/app/core-shared/commonFunctions';

export const ExcelValidExtension = ["xlsx"];
export const PdfValidExtennsion = ["pdf"];
export const ExcelValidHeaders = ["Appetite", "Risk Metric", "Measurement Type", "Low Risk", "Moderate Risk", "Critical Risk", "Units (Metric Source)"];

export interface RiskAppetiteData {
    id: number;
    name: string;
    policyFileName: string;
    frameworkFileName: string;
    uploadDate: Date;
}

@Component({
    selector: 'app-risk-appetite-documents',
    templateUrl: './risk-appetite-documents.component.html',
    styleUrls: ['./risk-appetite-documents.component.scss']
})
export class RiskAppetiteDocumentsComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'policyFileName', 'frameworkFileName', 'uploadDate']

    // @ts-ignore
    dataSource: MatTableDataSource<RiskAppetiteData>;
    riskAppetiteList = {};

    // @ts-ignore
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public uploader1: FileUploader = new FileUploader({
        isHTML5: true
    });

    public uploader2: FileUploader = new FileUploader({
        isHTML5: true
    });

    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });

    // file upload data
    UploadFile: FormData = new FormData();
    uploadRAFPolicy: FormData = new FormData();
    uploadRAFFramework: FormData = new FormData();
    uploadFilename: any;
    uploadFilename1: any;
    fileinput = "";
    fileinput1 = "";
    invalidfile: boolean = false;
    invalidfilesize = false;
    showUpload: boolean = false;
    showUpload1: boolean = false;
    loaderUploader: boolean = false;
    filename: any;
    filename1: any;
    invalidfilesize1: boolean = false;
    invalidfile1: boolean = false;
    templateId: any = null;
    validate: boolean = false;
    isPolicyError:boolean=false;
    validFileNameErr: boolean = false;
    validFileNameErr1: boolean = false;
    // rafPolicyName: string = "";
    uploadRAFError = "";
    uploadExcelError = "";
    uploadForm = new FormGroup({
        rafPolicyName: new FormControl(''),
        uploadRAFPolicy: new FormControl('', Validators.required),
        uploadRAFFramework: new FormControl('', Validators.required)
    });

    submitted = false;
    isrefPolicyError: boolean = false;
    selectedExcelJson: any[] = [];
    invalidExcelDataFile = false;

    constructor(
        private _riskAppetiteService: RiskAppetiteService,
        public utils: UtilsService,
        public dialog: MatDialog,
        @Inject(DOCUMENT) private document: any
    ) { }

    ngOnInit(): void {
        this.getRiskAppetiteList();
    }

    get f() {
        return this.uploadForm.controls;
    }

    removeExtension(fileName: any) {
        return fileName != undefined && fileName!=null ? fileName.substring(0, fileName.lastIndexOf('.')) : '';
    }

    onSubmit() {
        this.submitted = true;
        if (this.uploadForm.value.rafPolicyName && this.uploadForm.value.rafPolicyName.length>256){
            this.isPolicyError = true;
        }
        if (this.uploadForm.value.rafPolicyName && this.uploadForm.value.rafPolicyName.trim() != '') {
            this.isrefPolicyError = false;

            if (this.uploader1.queue.length < 1 || this.uploader2.queue.length < 1) {
                if (this.uploader1.queue.length < 1) {
                    this.uploadRAFError = "Upload RAF Policy File."
                }
                if (this.uploader2.queue.length < 1) {
                    this.uploadExcelError = "Upload RAF Framework File."
                }
            } else if (!this.invalidfile && !this.invalidfile1 && !this.invalidfilesize && !this.invalidfilesize1 && !this.invalidExcelDataFile && !this.validFileNameErr && !this.validFileNameErr1) {
                this.uploadDocuments();
            }
        } else {
            if (this.uploader1.queue.length < 1) {
                this.uploadRAFError = "Upload RAF Policy File."
            }
            if (this.uploader2.queue.length < 1) {
                this.uploadExcelError = "Upload RAF Framework File."
            }
            this.isrefPolicyError = true;
            return;
        }
    }

    onRafPolicyName(event: any) {
        if (event.target.value && event.target.value.trim() != '') {
            this.isrefPolicyError = false;
        } else {
            this.isrefPolicyError = true;
        }
        // console.log("this.isrefPolicyError::", this.isrefPolicyError);
    }

    onCancel() {
        this.submitted = false;
        this.uploadForm.controls["rafPolicyName"].setErrors(null);
        this.uploadForm.reset();
        this.uploadRAFError = "";
        this.uploadExcelError = "";
        this.filename = "";
        this.fileinput = "";
        this.fileinput1 = "";
        this.uploadFilename = "";
        this.uploadFilename1 = "";
        this.UploadFile.append('UploadFile', "");
        this.uploadRAFFramework.append('uploadRAFFramework', "");
        this.uploadRAFPolicy.append('uploadRAFPolicy', "");
        this.uploader.queue = [];
        this.uploader1.queue = [];
        this.uploader2.queue = [];
        this.UploadFile = new FormData();
        this.uploadRAFPolicy = new FormData();
        this.uploadRAFFramework = new FormData();
        this.invalidfile = false;
        this.invalidfile1 = false;
        this.invalidfilesize = false;
        this.invalidfilesize1 = false;
        this.invalidExcelDataFile = false;
        this.validFileNameErr = false;
        this.validFileNameErr1 = false;
    }

    downloadLatestTemplate() {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = "assets/SampleTemplate/RA_Template.xlsx";
        link.download = 'RA_Template.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    processDownload(fileData: any, fileMetaDetails: string) {
        // const FileType = res["result"][0][0].FileContent.type;
        const TYPED_ARRAY = new Uint8Array(fileData);
        const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
        const fileMetaType = fileMetaDetails;
        const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
        const blob = new Blob([blobData], { type: fileMetaType });
        return blob;
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

    getPolicyDetails() {
        if (this.uploader1.queue.length > 1) {
            let latestFile = this.uploader1.queue[this.uploader1.queue.length - 1]
            this.uploader1.queue = [];
            this.uploader1.queue.push(latestFile);

        }
        for (let j = 0; j < this.uploader1.queue.length; j++) {
            const fileItem = this.uploader1.queue[j]._file;
            this.filename = fileItem.name;
            const extension = this.filename.split('.').pop();
            this.fileinput = fileItem.name;
            if (PdfValidExtennsion.includes(extension.toLowerCase())) {
                this.invalidfile = false;
                this.uploadRAFPolicy.append('uploadRAFPolicy', fileItem);
                this.uploadRAFError = "";
            } else {
                this.invalidfile = true;
                this.uploadRAFError = "";
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
            if (fileNamePattern(fileItem.name)) {
                this.validFileNameErr = true;
            }else {
                this.validFileNameErr = false;
            }
            // this.uploadFile.append('Extension', fileItem.type);
        }
        // this.uploader.clearQueue();
        console.log("this.invalidFile::", this.invalidfile);
    }


    getFrameworkDetails(event: any) {
        this.invalidExcelDataFile = false;
        if (this.uploader2.queue.length > 1) {
            let latestFile = this.uploader2.queue[this.uploader2.queue.length - 1]
            this.uploader2.queue = [];
            this.uploader2.queue.push(latestFile);
        }
        for (let j = 0; j < this.uploader2.queue.length; j++) {
            const fileItem1 = this.uploader2.queue[j]._file;
            this.filename1 = fileItem1.name;
            const extension = this.filename1.split('.').pop();
            this.fileinput1 = fileItem1.name;
            if (ExcelValidExtension.includes(extension.toLowerCase())) {
                this.invalidfile1 = false;
                this.uploadRAFFramework.append('uploadRAFFramework', fileItem1);
                this.uploadExcelError = "";
            } else {
                this.invalidfile1 = true;
                this.invalidfilesize1 = false;
                this.invalidExcelDataFile = false;
                this.validFileNameErr1 = false;
                this.uploadExcelError = "";
            }
            const bytesize = fileItem1.size;
            let sizeInMB: any;
            sizeInMB = (bytesize / (1024 * 1024)).toFixed(2);
            if (sizeInMB <= 10) {
                this.invalidfilesize1 = false;
            }
            else {
                this.invalidfilesize1 = true;
                this.invalidExcelDataFile = false;
            }
            if (fileNamePattern(fileItem1.name)) {
                this.validFileNameErr1 = true;
            }else {
                this.validFileNameErr1 = false;
            }
            if (!this.invalidfilesize1) {
                let excelValidAlphabets = ['D', 'E', 'F', 'G', 'H']
                const reader: FileReader = new FileReader();
                reader.readAsBinaryString(fileItem1);
                reader.onload = (e: any) => {

                    const binarystr: string = e.target.result;
                    const workbook = XLSX.read(binarystr, { type: 'binary' });
                    const wsname: string = workbook.SheetNames[0];
                    const ws: XLSX.WorkSheet = workbook.Sheets[wsname];
                    let initialIndex = 6;
                    let riskMetricIndexes = Object.keys(ws).filter(x => x.includes('C'));
                    let lastIndex = Number(riskMetricIndexes[riskMetricIndexes.length - 1].slice(1));
                    outerloop:
                    for (let alpha of excelValidAlphabets) {
                        for (let i = initialIndex; i <= lastIndex; i++) {
                            if (!ws[alpha + i]?.h) {
                                this.invalidExcelDataFile = true;
                                break outerloop;
                            }
                        }
                    }
                }
            }
            // this.uploadFile.append('Extension', fileItem1.type);
        }
        // this.uploader.clearQueue();
    }

    uploadDocuments() {
        this.uploader.queue.push(this.uploader1.queue[0]);
        this.uploader.queue.push(this.uploader2.queue[0]);

        for (let k = 0; k < this.uploader.queue.length; k++) {
            const fileItemMain = this.uploader.queue[k]._file;
            this.UploadFile.append('UploadFile', fileItemMain);
        }

        const rafPolicyName = this.uploadForm.value.rafPolicyName?.trim();
        console.log(rafPolicyName, typeof (rafPolicyName))
        this.UploadFile.append('policyName', rafPolicyName ? rafPolicyName : "");
        this._riskAppetiteService.uploadRiskAppetite(this.UploadFile, rafPolicyName ? rafPolicyName : "").subscribe(res => {
            next:
            // this.uploadForm.reset();
            this.uploadForm.clearValidators();
            this.uploadForm.updateValueAndValidity();
            this.onCancel();
            localStorage.setItem('token', res.token);
            if (res.success == 1) {
                // this.popupInfo("Success", res.message)
                if (res.result.documents) {
                    let id = 0;
                    res.result.documents.forEach((doc: any) => {
                        id++;
                        doc.id = id;
                    });
                    this.dataSource = new MatTableDataSource(res.result.documents);
                    this.dataSource.paginator = this.paginator;
                }
                this.getRiskAppetiteList()

            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this.document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    popupInfo(title: string, message: string) {
        const timeout = 2000; // 3 seconds
        const confirm = this.dialog.open(InfoComponent, {
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
            }, timeout)
        });
    }

    getRiskAppetiteList(): void {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "documents": [
                        {
                            "FWID": "1",
                            "FrameworkName": "Policy Name 1",
                            "Version": "1.4",
                            "PolicyFileID": "150067",
                            "PolicyFileName": "BC-Framework2.xlsx",
                            "FrameworkFileId": "150068",
                            "FrameworkFileName": "BC-Framework2.xlsx",
                            "UploadDate": "2022-07-20T13:23:28.490Z"
                        },
                        {
                            "FWID": "1",
                            "FrameworkName": "Policy Name 1",
                            "Version": "1.4",
                            "PolicyFileID": "150067",
                            "PolicyFileName": "BC-Framework2.xlsx",
                            "FrameworkFileId": "150068",
                            "FrameworkFileName": "BC-Framework2.xlsx",
                            "UploadDate": "2022-07-20T13:23:28.490Z"
                        }
                    ]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            this.process(data);

        } else {
            this._riskAppetiteService.getRiskAppetites().subscribe(res => {
                next:
                this.process(res);
            });
        }

    }

    process(data: any): void {
        if (data.success == 1) {
            if (data.result.documents.length > 0) {
                let docs = data.result.documents;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.id = id;
                    });
                    this.dataSource = new MatTableDataSource(data.result.documents);
                    this.dataSource.paginator = this.paginator;
                }
            }
        } else {
            if (data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this.document);
        }
    }

    openRafPolicy(row: any, policyList: any): void {
        const uploadedDocument = this.dialog.open(RiskAppetiteViewComponent, {
            disableClose: true,
            maxHeight: '100vh',
            maxWidth:'100vw',
            height: '100%',
            width: '100%',
            panelClass: "full-screen-modal",
            data: {
                row,
                policyList
            },
        });

        uploadedDocument.afterClosed().subscribe(result => {
            if(result){
                this.getRiskAppetiteList();
            }
        })
    }

    downloadPolicy(rowData: any, fileType: string) {
        if (fileType === 'Policy') {
            const fileData = {
                "fileId": rowData.PolicyFileID,
                "fileType": fileType
            }
            this._riskAppetiteService.downloadRiskAppetite(fileData).subscribe(res => {
                console.log("fileName::", rowData.PolicyFileName);
                saveAs(this.processDownload(res.result[0][0].PolicyFileContent.data, 'application/pdf'), rowData.PolicyFileName.substring(0, rowData.PolicyFileName.lastIndexOf('.')).trim() + '.pdf');
            });
        } else {
            const fileData = {
                "fileId": rowData.FrameworkFileId,
                "fileType": fileType
            }
            this._riskAppetiteService.downloadRiskAppetite(fileData).subscribe(res => {
                console.log("fileName::", rowData.PolicyFileName);
                saveAs(this.processDownload(res.result[0][0].FrameworkFileContent.data, 'application/xlsx'), rowData.FrameworkFileName.substring(0, rowData.FrameworkFileName.lastIndexOf('.')).trim() + '.xlsx');
            });
        }
    }

    getBackgroundColor(rowData: any) {
        if (rowData.id === 1) {
            return '#fffde7'
        }
        return '';
    }
}
