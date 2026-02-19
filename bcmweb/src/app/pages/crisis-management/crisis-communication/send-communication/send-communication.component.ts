import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CrisisCommunicationService } from 'src/app/services/crisis-communication/crisis-communication.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CreateNewMessageComponent } from '../create-new-message/create-new-message.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';

@Component({
  selector: 'app-send-communication',
  templateUrl: './send-communication.component.html',
  styleUrls: ['./send-communication.component.scss']
})
export class SendCommunicationComponent {

  // DB error -- Declaration
  saveerror: any = '';

  // ckeditor config -- declarations
  ckeConfig: any;
  disabledCkeConfig: any;
  intializeCKEditor: boolean = false;

  constructor(
    public dialog: MatDialog,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    public service: CrisisCommunicationService,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public ckEditorService: CkEditorConfigService,
    public dialogRef: MatDialogRef<SendCommunicationComponent>
  ) {
    this.service.getCrisisCommunicationData(this.parent.clickedCrisis.CommunicationID);
    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.intializeCKEditor = true;
    }, 100);
  }

  editCrisisMessage(mode: any, data: any = {}) {
    const dialog = this.dialog.open(CreateNewMessageComponent, {
      panelClass: ['full-screen-modal'],
      disableClose: true,
      maxWidth: '100vw',
      width: '89.5vw',
      data: {
        crisisMode: mode,
        crisisModelHeader: mode == 'Add' ? 'Add New Communication' : 'Update Communication',
        crisisData: data
      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.service.getCrisisCommunicationData(this.parent.clickedCrisis.CommunicationID);
    });
  }

  getRecipentsValue(recipentId: any) {
    if (recipentId) {
      if (recipentId == 1)
        return null;
      if (recipentId == 2 || recipentId == 4)
        return this.service.crisisCommData?.FormatedSites;
      if (recipentId == 3)
        return this.service.crisisCommData?.FormatedBusinessFunctions;
      if (recipentId == 5)
        return this.service.crisisCommData?.FormatedFBCCAndFBCTs;
    }
  }

  formatedDate(date?: any) {
    return this.service.dateToStringWithTimeStamp(date);
  }

  publishCommunication() {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content:
          'Are you sure, you want to send communication?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        this.sendCommunication();
      }
    });
  }

  sendCommunication(): void {
    this.service.SendCommunications(this.service.crisisCommData).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess("Crisis Communication Published Successfully");
        this.dialogRef.close(true);
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    })
  }

  // Common Methods below (Save Sucess) -- start
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
