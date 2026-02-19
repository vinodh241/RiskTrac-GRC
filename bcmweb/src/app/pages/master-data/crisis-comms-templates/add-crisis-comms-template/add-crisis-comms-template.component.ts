import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { MasterCrisisService } from 'src/app/services/master-data/master-crisis/master-crisis.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-add-crisis-comms-template',
  templateUrl: './add-crisis-comms-template.component.html',
  styleUrls: ['./add-crisis-comms-template.component.scss']
})
export class AddCrisisCommsTemplateComponent implements OnInit {
  mode: any = "";
  crisisTempData: any = {};
  submitted: boolean = false;
  saveerror: any;
  allTemplateList: any;
  isTemplateExists: boolean = false;

  ckeConfig: any;
  disabledCkeConfig: any;

  constructor(
    public dialog: MatDialog,
    private rest: RestService,
    public utils: UtilsService,
    public service: MasterCrisisService,
    private ckEditorService: CkEditorConfigService,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public dialogRef: MatDialogRef<AddCrisisCommsTemplateComponent>,
  ) {
    this.rest.openWait("Fetching Data ...");
    this.service.getSiteMasterInfo();
  }

  ngOnInit(): void {
    this.mode = this.parent.mode;
    this.allTemplateList = JSON.parse(JSON.stringify(this.parent.allTemplates));

    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));

    if (this.mode == "Edit") {
      this.crisisTempData = this.parent.selectedTemp;
    }
    else {
      this.crisisTempData = {
        "EmailTemplateID": null,
        "TemplateName": "",
        "EmailTitle": "",
        "EmailContent": "",
        "CriticalityID": null,
        "CriticalityName": "",
        "ActionLinkID": null,
        "ActionLink":"",
        "Attached":null
      }
    }
    this.rest.closeWait();
  }

  checkTemplateExist(e: any) {
    if (this.parent.selectedTemp)
      this.isTemplateExists = this.allTemplateList.some((x: any) => x.TemplateName.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.EmailTemplateID !== this.parent.selectedTemp.EmailTemplateID));
    else
      this.isTemplateExists = this.allTemplateList.some((x: any) => x.TemplateName.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  onSubmit() {
    this.submitted = true;

    if (!this.crisisTempData.TemplateName || !this.crisisTempData.EmailTitle || !this.crisisTempData.EmailContent || !this.crisisTempData.CriticalityID || !this.crisisTempData.ActionLinkID || this.isTemplateExists)
      return;

    this.service.addOrUpdateCrisisCommsTemp(this.mode == "Add" ? null : this.crisisTempData.EmailTemplateID, this.crisisTempData, this.mode).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess(this.mode == "Add" ? "Template Added Successfully" : "Template Updated Successfully");
        this.service.processCrisisCommsTempList(res);
        this.resetCrisis();
        this.dialogRef.close(true);
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    });
  }

  resetCrisis() {
    this.mode = "";
    this.crisisTempData = {};
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
        this.service.getCrisisMaster();
      }, timeout)
    });
  }
}
