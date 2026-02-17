import { Component, Inject, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KriService } from 'src/app/services/kri/kri.service';
import { DOCUMENT } from '@angular/common';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import {MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
// import { IncidentService } from 'src/app/services/incident/incident.service';

@Component({
  selector: 'app-kri-send-email-reminder-dialog',
  templateUrl: './kri-send-email-reminder-dialog.component.html',
  styleUrls: ['./kri-send-email-reminder-dialog.component.scss']
})
export class KriSendEmailReminderDialogComponent implements OnInit {

  @ViewChild('incidentDailog') contentIncident!: ElementRef;

  isMax = false;
  recommendedCount: number = 0;
    tableData: any;
    alldata: any;
    saveerror: string = "";
    KRIReviewData:any[] = []
    defineKRIForm!: FormGroup
    isSubmitData: any;
    submitted:boolean = false

  constructor(
      private dialogRef: MatDialogRef<KriSendEmailReminderDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public parent: any,
      public kriService: KriService,
      @Inject(DOCUMENT) private _document: any,
      public utils: UtilsService,
      public dialog: MatDialog,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.tableData = this.parent.id
    console.log('this.parent: ',this.parent)
    this.alldata = this.parent.allData
    this.isSubmitData = this.parent.isSubmit
    console.log('this.alldata: ',this.alldata)
    this.defineKRIForm = this.fb.group({
        bulkRejectionTextareaData: ["", [Validators.required]],
        bulkApprovalTextareaData: [""],
    })

      this.minimize()
  }

  closeDialog(){
      this.dialogRef.close();
  }

  ngOnDestroy(): void {
      // this.service.getIncidents()
  }

  maximize() {
      this.isMax = true;
      this.dialogRef.addPanelClass("maximumAdded");
      this.dialogRef.removePanelClass("minimumAdded");
      this.dialogRef.updateSize('100%', '100%');
  }

  minimize() {
      this.isMax = false;
      this.dialogRef.addPanelClass("minimumAdded");
      this.dialogRef.removePanelClass("maximumAdded");
      this.dialogRef.updateSize('50vw', '70vh');
  }

  scrollUp() {
      this.contentIncident.nativeElement.scrollTop = this.contentIncident.nativeElement.offsetHeight;
  }

  submit(){
    this.submitted = true
    if (this.defineKRIForm.invalid) {
        return;
      }

console.log("this.defineKRIForm.value.bulkApprovalTextareaData",this.defineKRIForm.value.bulkApprovalTextareaData)
console.log("this.defineKRIForm.value.bulkRejectionTextareaData",this.defineKRIForm.value.bulkRejectionTextareaData)
const filteredDataForStatus2 = this.alldata.filter((metric: any) => metric.CommentBody === "" && metric.ReportStatusID === 2 && metric.IsSaved == true);
console.log("🚀 ~ file: kri-send-email-reminder-dialog.component.ts:84 ~ KriSendEmailReminderDialogComponent ~ submit ~ filteredDataForStatus2:", filteredDataForStatus2)
const filteredDataForStatus3 = this.alldata.filter((metric: any) => metric.CommentBody === "" && metric.ReportStatusID === 3 && metric.IsSaved == true);
console.log("🚀 ~ file: kri-send-email-reminder-dialog.component.ts:86 ~ KriSendEmailReminderDialogComponent ~ submit ~ filteredDataForStatus3:", filteredDataForStatus3)
const approvedMetrics: any = {};
const rejectedMetrics: any = {};
filteredDataForStatus3.forEach((metric: any) => {
    if (metric.isChecked) {
        approvedMetrics[metric.MetricID] = true;
    } else {
        rejectedMetrics[metric.MetricID] = true;
    }

    this.KRIReviewData.push({
        metricID: metric.MetricID,
        measurementID: metric.MeasurementID,
        commentBody: this.defineKRIForm.value.bulkApprovalTextareaData,
        isApproved: metric.isChecked
    });
});
filteredDataForStatus2.forEach((metric: any) => {
    if (metric.isChecked) {
        approvedMetrics[metric.MetricID] = true;
    } else {
        rejectedMetrics[metric.MetricID] = true;
    }

    this.KRIReviewData.push({
        metricID: metric.MetricID,
        measurementID: metric.MeasurementID,
        commentBody: this.defineKRIForm.value.bulkRejectionTextareaData,
        isApproved: metric.isChecked
    });
});


    console.log("this.KRIReviewData",this.KRIReviewData)
    const metricIds: string = this.kriService.kriMeasurments
            .filter(
                (ele: any) => ele.IsSaved == true && ele.isChecked != null
            )
            .map((metric: any) => metric.MetricID)
            .join(',');
    console.log("🚀 ~ file: kri-send-email-reminder-dialog.component.ts:146 ~ KriSendEmailReminderDialogComponent ~ submit ~ metricIds:", metricIds)

    const confirm = this.dialog.open(ConfirmDialogComponent, {
        id: "InfoComponent",
        disableClose: true,
        minWidth: "300px",
        panelClass: "dark",
        data: {
          title: 'Confirm Submission',
          content: "Are you sure you want to Submit the KRI's?",
        }
      });

      this.KRIReviewData = Array.from(new Set(this.KRIReviewData.map(ob => ob.metricID))).map(metricID => this.KRIReviewData.find(ob => ob.metricID === metricID));
      console.log("this.KRIReviewData  -- xoxoo", this.KRIReviewData); 
      confirm.afterClosed().subscribe(result => {
        if (result) {
            this.dialogRef.close();
          this.kriService.saveReviewerDetails(this.KRIReviewData)

            .pipe(
              mergeMap((res: any) => {
                if (res.success === 1) {
                    this.KRIReviewData = []
                  // Continue to the second service
                  return this.kriService.submitReviewerDetails({ metricIDs: metricIds });
                } else {
                  if (res.error.errorCode === 'TOKEN_EXPIRED') {
                    this.utils.relogin(this._document);
                  } else {
                    this.saveerror = res.error.errorMessage;
                  }
                  // Return an observable to break the chain
                  return of(null);
                }
              })
            )
            .subscribe(
              (res: any) => {
                if (res && res.success === 1) {
                  this.saveSuccess(res.message);
                } else {
                  if (res && res.error.errorCode === 'TOKEN_EXPIRED') {
                    this.utils.relogin(this._document);
                  } else {
                    this.saveerror = res ? res.error.errorMessage : 'Unknown error';
                  }
                }
              },
              (error: any) => {
                console.log('err::', error);
              }
            );
        }
      this.isSubmitData = true
      });

    // this.kriService.getkrireporteddata();
  }

  removeMetricFromApprovedRejected(metric: any) {
    let latestMetricIndex = -1;

    // Find the latest occurrence of the metric ID
    this.KRIReviewData.forEach((x: any, index: number) => {
        if (x.MetricID === metric.MetricID) {
            latestMetricIndex = index;
        }
    });

    // Remove all occurrences of the metric ID except the latest one
    if (latestMetricIndex !== -1) {
        this.KRIReviewData = this.KRIReviewData.filter((x: any, index: number) => index === latestMetricIndex || x.MetricID !== metric.MetricID);
    }
    console.log("🚀 ~ file: kri-measurement-review.component.ts:1378 ~ KriMeasurementReviewComponent ~ removeMetricFromApprovedRejected ~   this.KRIReviewData",   this.KRIReviewData)

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
    confirm.afterOpened().subscribe(result => {
        setTimeout(() => {
            this.kriService.getkrireporteddata();
            confirm.close();
        }, timeout)
      });
}
get f() {
    return this.defineKRIForm.controls
  }

}
