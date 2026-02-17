import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { RiskAppetiteService } from 'src/app/services/risk-appetite/risk-appetite.service';
import { environment } from 'src/environments/environment';
import { ExcelValidExtension } from '../risk-appetite-documents/risk-appetite-documents.component';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';

export interface Template {
    id: number,
    templateName: string,
    uploadOn: string
}

@Component({
    selector: 'app-risk-appetite-templates',
    templateUrl: './risk-appetite-templates.component.html',
    styleUrls: ['./risk-appetite-templates.component.scss']
})
export class RiskAppetiteTemplatesComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'template-name', 'upload-on']

    //@ts-ignore
    dataSource: MatTableDataSource<Template>

    // @ts-ignore
    @ViewChild(MatPaginator) paginator: MatPaginator;

    uploadFile: FormData = new FormData();
    filename: any = '';
    invalidfile: boolean = false;
    invalidfilesize = false;
    showUpload: boolean = false;
    uploaderror = "";

    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });

    constructor(
        private _service: RiskAppetiteService,
        private router: Router,
        public dialog: MatDialog,
        public utils: UtilsService,
        @Inject(DOCUMENT) private _document: any
    ) { }

    ngOnInit(): void {
        this.getTemplateList();
    }

    ngAfterViewInit() {
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }

    getTemplateList(): void {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "dataList": [
                        {
                            "TemplateID": "150067",
                            "FileName": "Template Name 1",
                            "CreatedDate": "2022-07-20T13:23:28.490Z"
                        },
                        {
                            "FileID": "150068",
                            "FileName": "Template Name 2",
                            "CreatedDate": "2022-07-20T13:23:28.490Z"
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
            this.dataSource.paginator = this.paginator;
        } else {
            this._service.getRiskAppetiteTemplates().subscribe(res => {
                next:
                this.process(res);
            })
        }

    }

    process(data: any): void {
        if (data.success == 1) {
            if (data.result.dataList.length > 0) {
                let docs = data.result.dataList;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.id = id;
                    });
                    this.dataSource = new MatTableDataSource(data.result.dataList);
                    this.dataSource.paginator = this.paginator;
                }
            }
        } else {
            if (data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    onFileClick(event: any) {
        event.target.value = '';
    }

    getFrameworkDetails() {
        // this.uploadFile.delete('UploadFile')
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
            if (ExcelValidExtension.includes(extension.toLowerCase())) {
                this.invalidfile = false;
                this.uploadFile.append('UploadFile', fileItem);
                this.showUpload = true;
                this.uploaderror = "";
            } else {
                this.invalidfile = true;
                this.showUpload = false;
            }
            const bytesize = fileItem.size;
            let sizeInMB: any;
            sizeInMB = (bytesize / (1024 * 1024)).toFixed(2);
            if (sizeInMB < 50) {
                this.invalidfilesize = false;
                this.showUpload = true;
            }
            else {
                this.invalidfilesize = true;
                this.showUpload = true;
                this.showUpload = false;
            }
            this.uploadFile.append('Extension', fileItem.type);
            console.log("this.uploader2::", this.uploadFile);
        }
        // this.uploader.clearQueue();
    }

    validateDetails() {
        if (this.uploader.queue.length < 1) {
            this.uploaderror = "Upload File"
        } else {
            this.upload();
        }
    }

    upload() {
        console.log("this.uploader::", this.uploadFile);
        this._service.uploadRiskAppetiteTemplate(this.uploadFile).subscribe(res => {
            next:
            // console.log(res);
            // console.log("done");
            // console.log(localStorage.getItem('token'), res.token);
            localStorage.setItem('token', res.token);
            this.getTemplateList();
            // console.log(this.dataSource);
            this.onCancel();
            this.clearError();
            if (res.success == 1) {
                this.popupInfo("Success", res.message)
            } else {
                if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
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
                // this.router.navigate(['']);
            }, timeout)
        });
    }

    onCancel() {
        // this.model.framework= undefined ;
        this.uploaderror = "";
        this.filename = "";
        this.uploadFile.append('UploadFile', "");
        this.showUpload = false;
        this.uploader.clearQueue();
        this.uploadFile = new FormData();
        this.invalidfile = false;
        this.invalidfilesize = false;
    }

    downloadTemplate(row: any) {
        let templateId = row.TemplateID;
        this._service.downloadRiskAppetiteTemplate(templateId).subscribe(res => {
            console.log(res["result"][0][0].FileContent.data);
            const FileType = res["result"][0][0].FileContent.type;
            const TYPED_ARRAY = new Uint8Array(res.result[0][0].FileContent.data);
            const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
            }, ''));
            const fileMetaType = 'application/xlsx';
            const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
            const blob = new Blob([blobData], { type: fileMetaType });
            saveAs(blob, row.FileName.split('.')[0] + '.xlsx');
        });
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

    clearError(): void {
        this.uploaderror = "";
    }
}

