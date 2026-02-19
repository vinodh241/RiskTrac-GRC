import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RemediationTrackerService } from 'src/app/services/remediation-tracker/remediation-tracker.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FileUploader } from 'ng2-file-upload';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { fileNamePattern } from 'src/app/includes/utilities/commonFunctions';

@Component({
  selector: 'app-upload-supporting',
  templateUrl: './upload-supporting.component.html',
  styleUrls: ['./upload-supporting.component.scss']
})

export class UploadSupportingComponent {

  addActionItem!: FormGroup;
  minStartDate: any;
  maxEndDate: any;
  actionItemId: any;
  fileName: any;
  uploadedFileName: any
  failedToUpload: boolean = false
  fileErr: boolean = false;
  fileTypeList: any
  allowedFile: boolean = false;
  validFileNameErr: boolean = false;

  file_store: any = [];
  file_list: Array<string> = [];

  public uploader: FileUploader = new FileUploader({
    url: '',
    isHTML5: true
  });

  selectedFile: File | null = null;
  saveerror = "";

  constructor(@Inject(MAT_DIALOG_DATA) public parent: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadSupportingComponent>,
    @Inject(DOCUMENT) private _document: any,
    public service: RemediationTrackerService,
    public utils: UtilsService,
    private rest: RestService) { }

  ngOnInit() {
    this.actionItemId = this.parent.actionPlan.ActionItemID;
    this.fileTypeList = this.parent.fileTypeList.join(", ")
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.file_store = files;
    }
    if (this.file_store[0].name) {
      this.fileErr = false;

      let lastIndex = this.file_store[0]?.name.lastIndexOf('.');
      let uploadFileExtension = this.file_store[0]?.name.substr(lastIndex, this.file_store[0]?.name.length - 1).toLowerCase();

      if (![".xlsx", ".pdf", ".docx", ".jpeg", ".jpg", ".png"].includes(uploadFileExtension) && uploadFileExtension != undefined) {
        this.allowedFile = true;
        return
      }

      if(fileNamePattern(this.file_store[0]?.name)){
        this.validFileNameErr = true;
        return;
      }else {
        this.validFileNameErr = false;
      }
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onFileSelected(event: any) {
    this.failedToUpload = false;
    this.allowedFile = false;
    this.selectedFile = event.target.files[0]
    this.file_store = { ...event.target.files };
    event.value = "";

    if (this.file_store[0].name) {
      this.fileErr = false;

      let lastIndex = this.file_store[0]?.name.lastIndexOf('.');
      let uploadFileExtension = this.file_store[0]?.name.substr(lastIndex, this.file_store[0]?.name.length - 1).toLowerCase();

      if (![".xlsx", ".pdf", ".docx", ".jpeg", ".jpg", ".png"].includes(uploadFileExtension) && uploadFileExtension != undefined) {
        this.allowedFile = true;
        return
      }

      if(fileNamePattern(this.file_store[0]?.name)){
        this.validFileNameErr = true;
        return;
      }else {
        this.validFileNameErr = false;
      }
    }
  }

  upload(): void {
    if (this.file_store[0] == 0 || this.file_store[0] == undefined || this.file_store == 0) {
      this.fileErr = true;
    }

    var fd = new FormData();
    this.file_list = [];

    fd.append("UploadFile", this.file_store[0], this.file_store[0].name,);
    this.file_list.push(this.file_store[0].name);

    fd.append("ActionItemID", this.actionItemId.toString())

    this.service.getUploadActionItemAttachment(fd).subscribe(res => {
      next:
      if (res.success == 1) {
        this.saveSuccess("File uploaded successfully");
        this.uploadedFileName = res.result.ActionItemAttachmentDetails[0].AttachmentName;
        this.failedToUpload = false;

      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
          this.utils.relogin(this._document);
          this.failedToUpload = false;
        } else {
          this.failedToUpload = true;
          this.saveerror = res.error.errorMessage;
        }
      }
      error:
      console.log("err::", "error");
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
        this.service.getUpdateActionItemProgressInfo(this.actionItemId)
        this.dialogRef.close({
          updatedProgress: this.parent.Progress,
          updatedComment: this.parent.Comment,
          IsMarkedComplete: this.parent.IsMarkedComplete
        });
      }, timeout)
    });
  }

  cancel() {
    this.dialogRef.close({
      updatedProgress: this.parent.Progress,
      updatedComment: this.parent.Comment,
      IsMarkedComplete: this.parent.IsMarkedComplete
    });
  }

}


