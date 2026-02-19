import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { FormControl } from '@angular/forms';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';

@Component({
  selector: 'app-initiate-bcp',
  templateUrl: './initiate-bcp.component.html',
  styleUrls: ['./initiate-bcp.component.scss']
})

export class InitiateBCPComponent {

  displayedColumns: string[] = ['Position', 'BusinessFunction', 'BusinessGroupName', 'DocStatus', 'LastReviewed', 'Status'];
  bcpReviewList = new MatTableDataSource<Element>();
  businessFilter = new FormControl();

  constructor(
    @Inject(DOCUMENT) private _document: any,
    public dialog: MatDialog,
    public service: BusinessContinuityPlansService,
    public route: Router,
    public utils: UtilsService,
    public dialogRef: MatDialogRef<InitiateBCPComponent>
  ) {
    this.service.getBusinessFunReviewList();
  }

  ngOnInit() {
    this.service.reviewListSubj.subscribe((value: any) => {
      if (value) {
        this.bcpReviewList = this.service.reviewList.reviewList;
      }
    });
    this.businessFilter.valueChanges.subscribe((Value) => {
      const filteredValue = (Value || '');
      this.bcpReviewList = addIndex(JSON.parse(JSON.stringify(this.service.reviewList.reviewList.filter((x: any) => (x.BusinessFunctionName || '').toLowerCase().trim().includes(filteredValue.toLowerCase().trim())))), false);
    });
  }

  select(item?: any) {
    this.service.selectedBusinessFunction.next(item.BusinessFunctionID);
    let listingPageFlag = false
    this.service.listingPage.next(listingPageFlag);

    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content: 'Are you sure, you want to Initiate BCP?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        this.service.initiateBCP(item.BusinessFunctionID).subscribe(res => {
          if (res.success == 1) {
            this.dialogRef.close(true);
            this.saveSuccess("Business Function is initiated");
            this.service.processBusinessList(res)
          } else {
            if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
          }
          error:
          console.log("err::", "error");
        })
      }
    })


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
        this.service.getBusinessContinuityList();
      }, timeout)
    });
  }

  close() {
    this.dialog.closeAll();
  }

  formatTimeZone(dateval: any) {
    let date = null;
    if (dateval instanceof Date) {
      const d = dateval.getDate();
      let dd = '';
      if (d < 10) {
        dd = '0' + d;
      } else {
        dd = '' + d;
      }
      let m = dateval.getMonth() + 1;
      let mm = '';
      if (m < 10) {
        mm = '0' + m;
      } else {
        mm = '' + m;
      }
      const y = dateval.getFullYear();
      const Timeval = "00:00:00.000Z"
      let val = y + '-' + mm + '-' + dd;
      date = val
    } else if (typeof dateval === 'string' || dateval instanceof String) {
      const dateval2 = dateval.split('T')[0];
      const Timeval = "00:00:00.000Z"
      date = dateval2;
    } else {
      return null;
    }
    return date;
  }

}
