import { Component, Inject, Input } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { MimeTypes } from 'src/app/includes/utilities/constant';
import { fileNamePattern, filterMimeTypes } from 'src/app/includes/utilities/commonFunctions'
import { CrisisCommunicationService } from 'src/app/services/crisis-communication/crisis-communication.service';
import { environment } from 'src/environments/environment';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { FileUploadService } from 'src/app/services/common-module/file-upload/file-upload.service';
import { AssessmentRiskListing } from 'src/app/services/site-risk-assessments/assessment-risk-listing.service';
import { IncidentReportService } from 'src/app/services/incident-report/incident-report.service';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';

const baseURL = environment.bcmapiUrl;
declare var $: any;

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    url: '',
  });
  uploadButtonText: string = '';
  maxUploadFileSize: number = 0;
  attachmentsConfig: any[] = [];
  communicationId: number = 0;
  allowedFileExtensions: any;
  token: any = null;
  apiUrl: any = '';
  triggered: number = 0;
  // validFileNameErr: boolean = false;

  selectedFileName    : string = '';
  uploadEvidence      : FormData = new FormData();
  uploadEvidenceError : string = ''; // Please select the file to proceed
  uploadProgress      : any;
  submitted           : boolean = false;

  // @ts-ignore
  wait;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  constructor(
    public dialog: MatDialog,
    private utils: UtilsService,
    public service: FileUploadService,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public bcmsService: BcmsTestingService,
    public sraService: AssessmentRiskListing,
    public incidentService: IncidentReportService,
    public crisisService: CrisisCommunicationService,
    public dialogRef: MatDialogRef<FileUploadComponent>,
  ) {
  }

  ngOnInit() {
    this.resetUploader();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;

    if (files && files.length === 1) {
      this.handleFile(files[0]);
    } else {
      this.uploadEvidenceError = 'Please drop a single file.';
      this.resetUploader();
    }
  }

  handleFile(file: File) {
    if (!file) return;
    this.selectedFileName = file.name;
    this.getFileDetails(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input?.files;

    if (files && files.length === 1) {
      this.handleFile(files[0]);
    } else {
      this.uploadEvidenceError = 'Please select a single file.';
      this.resetUploader();
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  getFileDetails(file: File) {
    const extension = '.' + file.name.split('.').pop() || '';
    if (!this.parent.config.FileExtensions.includes(extension.toLowerCase())) {
      this.uploadEvidenceError = `Please upload valid file like ${(this.parent.config.FileExtensions).join(', ')} only`;
      this.resetUploader();
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    if (+sizeInMB > this.parent.config.FileSize) {
      this.uploadEvidenceError = 'File size has exceeded the limit of ' + this.parent.config.FileSize + ' MB.';
      this.resetUploader();
      return;
    }

    if (fileNamePattern(file.name)) {
      this.uploadEvidenceError = 'Special Characters are not allowed in File name';
      this.resetUploader();
      return;
    }

    this.uploadEvidenceError = "";
    this.uploadEvidence = new FormData();
    this.uploadEvidence.append('file', file);
    this.uploadProgress = 0;
  }

  saveEvidenceFile() {
    this.submitted = true;
    if (this.uploadEvidenceError || !this.selectedFileName)
      return;

    this.service.uploadEvidenceFile(this.uploadEvidence, this.parent.config.apiURL).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.saveSuccess('File Uploaded Successfully');
        if (this.parent.moduleName == 'Crisis') {
          this.crisisService.processUploadCrisisAttachment(res);
        } else if (this.parent.moduleName == 'SRA') {
          this.sraService.processUploadSRAAttachment(res);
        } else if (this.parent.moduleName == 'Incident') {
          this.incidentService.processUploadIncidentAttachment(res);
        } else if (this.parent.moduleName == 'observerReport') {
          this.bcmsService.processUploadObserverAttachment(res);
        } else if (this.parent.moduleName == 'participantReport') {
          this.bcmsService.processUploadParticipantAttachment(res);
        }
        this.resetUploader();
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });
  }

  // triggerFileUpload() {
  //   const fileInput = document.getElementById('UploadFile') as HTMLInputElement;
  //   fileInput.click();
  //   this.uploadFile();
  // }

  // uploadFile() {
  //   this.token = localStorage.getItem("token") || '';
  //   if (this.parent.moduleName == 'Crisis') {
  //     // this.apiUrl = baseURL + this.crisisService.fileUploadData?.apiURL;
  //     this.uploader = new FileUploader({
  //       url: this.apiUrl, removeAfterUpload: false, autoUpload: true, authToken: this.token,
  //       allowedMimeType: filterMimeTypes(this.allowedFileExtensions, MimeTypes),
  //       maxFileSize: this.maxUploadFileSize * 1024 * 1024
  //     });
  //   }

  //   this.uploader.onBeforeUploadItem = (fileItem: FileItem) => {
  //     this.uploader.authToken = localStorage.getItem("token") || '';
  //     this.uploader.options.additionalParameter = {
  //       communicationId: this.communicationId
  //     };
  //   };

  //   this.uploader.onAfterAddingFile = (fileItem: FileItem) => this.onAfterAddingFile(fileItem);
  //   this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
  //     this.triggered += 1;
  //     if (this.triggered == 1) {
  //       this.openWait('Uploading....');
  //     }
  //     if (fileNamePattern(fileItem.file.name || '')) {
  //       this.validFileNameErr = true;
  //       return;
  //     } else {
  //       this.validFileNameErr = false;
  //     }

  //     this.selectedFileName = fileItem.file.name || '';
  //   };

  //   this.uploader.onSuccessItem = (fileItem: FileItem, response: any, status: number, headers: ParsedResponseHeaders) => {
  //     let data = JSON.parse(response);
  //     if (this.validFileNameErr) {
  //       this.closeWait();
  //       localStorage.setItem('token', data['token']);
  //       return;
  //     }
  //     this.closeWait();
  //     localStorage.setItem('token', data['token']);
  //     if (data.success == 1) {
  //       this.saveSuccess('File Uploaded Successfully');
  //       if (this.parent.moduleName == 'Crisis') {
  //         this.crisisService.processUploadCrisisAttachment(data);
  //       }
  //       this.resetUploader();
  //     } else {
  //       if (data?.error?.errorCode && data?.error?.errorCode == "TOKEN_EXPIRED")
  //         this.utils.relogin(this._document);
  //       else
  //         this.popupInfo("Unsuccessful", data.error?.errorMessage)
  //     }
  //   };

  //   this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);

  //   this.uploader.onErrorItem = (fileItem: FileItem, response: any, status: number, headers: ParsedResponseHeaders) => {
  //     this.closeWait();
  //     if (response)
  //       this.popupInfo("Unsuccessful", response.error?.errorMessage);
  //     else
  //       this.popupInfo("Unsuccessful", 'Failed to Upload');
  //   };
  // }

  // onBeforeUploadItem(fileItem: any) {
  //   this.uploader.authToken = this.token;
  //   if (this.parent.moduleName == 'Crisis')
  //     fileItem.append("communicationId", this.communicationId);
  // }

  // onAfterAddingFile(fileItem: FileItem) {
  //   let latestFile = this.uploader.queue[this.uploader.queue.length - 1];
  //   this.uploader.queue = [];
  //   this.uploader.queue.push(latestFile);
  // }

  // onWhenAddingFileFailed(item: any, filter: any, options: any) {
  //   let errorMessage: string = '';
  //   switch (filter.name) {
  //     case 'mimeType':
  //       errorMessage = `Please upload valid file like ${(this.allowedFileExtensions).join(', ')} only`;
  //       this.popupInfo("Unsuccessful", errorMessage)
  //       break;
  //     case 'fileSize':
  //       errorMessage = 'File size has exceeded the limit of ' + this.maxUploadFileSize + 'mb.';
  //       this.popupInfo("Unsuccessful", errorMessage)
  //       this.uploader.clearQueue();
  //       $("#UploadFile").val('');
  //       break;
  //   }
  // }

  resetUploader() {
    if (this.uploader) {
      this.uploader.clearQueue();
      $("#UploadFile").val('');
    }
  }

  // Common Methods below(loader,error,success popup) - start
  openWait(masg: any): void {
    this.wait = this.dialog.open(WaitComponent, {
      disableClose: true,
      panelClass: "dark",
      data: {
        text: masg
      }
    })
  }

  closeWait(): void {
    if (this.wait)
      this.wait.close();
    this.triggered = 0;
  }

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this.dialog.open(InfoComponent, {
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

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }

}

