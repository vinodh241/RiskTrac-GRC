import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { InherentRiskService } from 'src/app/services/rcsa/inherent-risk/inherent-risk.service';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { OverAllInherentRiskRatingService } from 'src/app/services/rcsa/master/inherent-risk/over-all-inherent-risk-rating.service';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-schedule-assessments',
  templateUrl: './new-schedule-assessments.component.html',
  styleUrls: ['./new-schedule-assessments.component.scss']
})
export class NewScheduleAssessmentsComponent implements OnInit {
  copy: any;
  AssessmentPeriodDS: any;
  reviewerDS: any;

  saveerror: string = '';
  userSame : boolean = false;
  masterForm = new FormGroup({
    schedulePeriod: new FormControl(null, [Validators.required]),
    txtProsessedStartDate: new FormControl(null, [Validators.required]),
    txtProsessedEndDate: new FormControl(null, [Validators.required]),
    ddlReviewer1: new FormControl(null, [Validators.required]),
    ddlReviewer2: new FormControl(null, [Validators.required]),
    txtRateId: new FormControl(""),
    txtDescription: new FormControl(""),
     // sample formcontrol name
     reminderDate: new FormControl(null, [Validators.required])
  });
  selectedPeriodYearValue: number = new Date().getFullYear();
  selectedPeriodQuarterValue: number = Math.floor(new Date().getMonth() / 3 + 1);
  minDate!: Date;
  maxDate!: Date;
  radioSelect:boolean = false
  ScheduleAssessStatusID : any ;

  constructor(
    private service: ScheduleAssessmentsService,
    private configScoreRatingService: ConfigScoreRatingService,
    private overAllInherentRiskService: OverAllInherentRiskRatingService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewScheduleAssessmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any

  ) {
    if (data) {
      this.copy = JSON.parse(JSON.stringify(data))
    }


  }

  ngOnInit(): void {
    this.getPageLoad();
    // this.getScheduleAssessmentPeriod();
    // this.getReviewer();

    this.masterForm.get('schedulePeriod')?.valueChanges.subscribe(x => {
      let quarter = (x || '')?.split(',')[0].toString().trim();
      this.selectedPeriodYearValue = Number((x || '')?.split(',')[1].toString().trim());
      this.selectedPeriodQuarterValue = Number(quarter.substring(quarter.length - 1));
      this.masterForm.get('txtProsessedStartDate')?.reset();
      this.masterForm.get('txtProsessedEndDate')?.reset();
    })
    this.masterForm.get('txtProsessedStartDate')?.valueChanges.subscribe(() => this.onDateChange());
    this.masterForm.get('txtProsessedEndDate')?.valueChanges.subscribe(() => this.onDateChange());
 
  }
  getPageLoad(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": {
            "SchedeuleAssessmentPeriod": [
              {
                "SchedulePeriod": "Quarter 4, 2022"
              },
              {
                "SchedulePeriod": "Quarter 1, 2023"
              },
              {
                "SchedulePeriod": "Quarter 2, 2023"
              },
              {
                "SchedulePeriod": "Quarter 3, 2023"
              }
            ],
            "Reviewer": [
              {
                "ReviewerID": 1,
                "UserGUID": "A9A14500-E163-ED11-AA60-000C2990EBB7",
                "Description": "test@lucidspire.com",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T10:29:41.717Z",
                "CreatedBy": "Base Script",
                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                "LastUpdatedBy": null,
                "UserName": "test@lucidspire.com",
                "FirstName": "test@lucidspire.com",
                "MiddleName": null,
                "LastName": "SEyes",
                "EmailID": "vinod.avala@secureyes.net"
              },
              {
                "ReviewerID": 2,
                "UserGUID": "AAA14500-E163-ED11-AA60-000C2990EBB7",
                "Description": "OpsSecurEyes02@lucidspire.com",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T10:29:41.717Z",
                "CreatedBy": "Base Script",
                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                "LastUpdatedBy": null,
                "UserName": "OpsSecurEyes02@lucidspire.com",
                "FirstName": "OpsSecurEyes02@lucidspire.com",
                "MiddleName": null,
                "LastName": "SEyes",
                "EmailID": "vinod.avala@secureyes.net"
              },
              {
                "ReviewerID": 3,
                "UserGUID": "F492A38B-8265-ED11-AA60-000C2990EBB7",
                "Description": "harish@lucidspire.com",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T10:29:41.717Z",
                "CreatedBy": "Base Script",
                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                "LastUpdatedBy": null,
                "UserName": "harish@lucidspire.com",
                "FirstName": "harish@lucidspire.com",
                "MiddleName": "Kumar",
                "LastName": "Garg",
                "EmailID": "harish.garg@secureyes.net"
              },
              {
                "ReviewerID": 4,
                "UserGUID": "DF260FCA-8565-ED11-AA60-000C2990EBB7",
                "Description": "vamshiv@lucidspire.com",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T10:29:41.717Z",
                "CreatedBy": "Base Script",
                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                "LastUpdatedBy": null,
                "UserName": "vamshiv@lucidspire.com",
                "FirstName": "vamshiv@lucidspire.com",
                "MiddleName": "",
                "LastName": "V",
                "EmailID": "vamshivenu.v@gmail.com"
              },
              {
                "ReviewerID": 5,
                "UserGUID": "233D96CC-8865-ED11-AA60-000C2990EBB7",
                "Description": "palanis@lucidspire.com",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T10:29:41.717Z",
                "CreatedBy": "Base Script",
                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                "LastUpdatedBy": null,
                "UserName": "palanis@lucidspire.com",
                "FirstName": "palanis@lucidspire.com",
                "MiddleName": "",
                "LastName": "S",
                "EmailID": "palanipalanisamp1990@gmail.com"
              },
              {
                "ReviewerID": 6,
                "UserGUID": "AE98A237-8965-ED11-AA60-000C2990EBB7",
                "Description": "sangeethar@lucidspire.com",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T10:29:41.717Z",
                "CreatedBy": "Base Script",
                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                "LastUpdatedBy": null,
                "UserName": "sangeethar@lucidspire.com",
                "FirstName": "sangeethar@lucidspire.com",
                "MiddleName": "",
                "LastName": "R",
                "EmailID": "sangeethaa.r.89@gmail.com"
              },
              {
                "ReviewerID": 7,
                "UserGUID": "5C8B264D-8E65-ED11-AA60-000C2990EBB7",
                "Description": "manohar@lucidspire.com",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T10:29:41.717Z",
                "CreatedBy": "Base Script",
                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                "LastUpdatedBy": null,
                "UserName": "manohar@lucidspire.com",
                "FirstName": "manohar@lucidspire.com",
                "MiddleName": "",
                "LastName": "R",
                "EmailID": "smruti.ranjan@secureyes.net"
              }
            ]
          }
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processScheduleAssessmentPeriod(data);
      this.processReviewer(data);

    } else {
      let obj = { "scheduleYear": "0", "scheduleAssessmentID": this.copy.mode == "add" ? 0 : this.copy.ScheduleAssessmentID }
      this.configScoreRatingService.getDataForManageScheduleAssessmentScreen(obj).subscribe(data => {
        next: {
          this.processScheduleAssessmentPeriod(data);
          this.processReviewer(data);
        }
      });
    }

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.copy.mode == "edit") {

        this.setEditData();
      }
    }, 0);
  }

  onDateChange() {
    this.masterForm.controls['reminderDate'].setValue(null);
  }
  // start of date min max method
  valueChanged(event: any) {
    if(this.masterForm.controls['txtProsessedStartDate'].value !== null && this.masterForm.controls['txtProsessedEndDate'].value !== null) {
      this.minDate = this.masterForm.controls['txtProsessedStartDate'].value;
      this.maxDate = this.masterForm.controls['txtProsessedEndDate'].value;
    }

    // this.masterForm.controls['reminderDate'].setValue(null);

  }

  // end

  setEditData(): void {
    this.masterForm.patchValue({
      schedulePeriod: this.copy.SchedulePeriod,
      txtProsessedStartDate: this.copy.ProposedStartDate,
      txtProsessedEndDate: this.copy.ProposedCompletionDate,
      ddlReviewer1: this.copy.PrimaryReviewerID,
      ddlReviewer2: this.copy.SecondaryReviewerID,
      txtRateId: this.copy.ScheduleAssessmentID,
      txtDescription: this.copy.ScheduleAssessmentDescription,
      reminderDate: this.copy.ReminderDate
    });
    this.valueChanged(null);

    // this.getActiveUnit(this.copy.GroupID, this.copy.UnitID);
  }
  getScheduleAssessmentPeriod() {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Schedule Assessment Period fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "SchedulePeriod": "Quarter 4, 2022"
            },
            {
              "SchedulePeriod": "Quarter 1, 2023"
            },
            {
              "SchedulePeriod": "Quarter 2, 2023"
            },
            {
              "SchedulePeriod": "Quarter 3, 2023"
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Schedule Assessment Period fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processScheduleAssessmentPeriod(data);
    } else {
      // this.service.getSchedulePeriod().subscribe(res => {
      let obj = { "scheduleYear": "0", "scheduleAssessmentID": this.copy.ScheduleAssessmentID };
      this.configScoreRatingService.getScheduleAssessmentScreen(obj).subscribe(res => {
        next:
        this.processScheduleAssessmentPeriod(res);
      });
    }
  }

  processScheduleAssessmentPeriod(data: any): void {

    if (data.success == 1) {
      //SchedeuleAssessmentPeriod
      if (data.result.recordset.ScheduleAssessmentInfo.length){
        this.ScheduleAssessStatusID = data.result.recordset.ScheduleAssessmentInfo[0].ScheduleAssessmentStatusID;
        console.log(' this.ScheduleAssessStatusID: '+ this.ScheduleAssessStatusID)
      } 
      if (data.result.recordset.SchedeuleAssessmentPeriod.length > 0) {
        this.AssessmentPeriodDS = data.result.recordset.SchedeuleAssessmentPeriod;        
        if (this.copy.mode == 'edit') {
          let period = this.AssessmentPeriodDS.find((s:any) => s.SchedulePeriod == this.copy.SchedulePeriod);
          if (period == undefined) {
            this.AssessmentPeriodDS.push({ SchedulePeriod: this.copy.SchedulePeriod });
          }
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getReviewer(): void {

    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Reviewer fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "ReviewerID": 1,
              "UserGUID": "A9A14500-E163-ED11-AA60-000C2990EBB7",
              "Description": "test@lucidspire.com",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T10:29:41.717Z",
              "CreatedBy": "Base Script",
              "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
              "LastUpdatedBy": null,
              "UserName": "test@lucidspire.com",
              "FirstName": "test@lucidspire.com",
              "MiddleName": null,
              "LastName": "SEyes",
              "EmailID": "vinod.avala@secureyes.net"
            },
            {
              "ReviewerID": 2,
              "UserGUID": "AAA14500-E163-ED11-AA60-000C2990EBB7",
              "Description": "OpsSecurEyes02@lucidspire.com",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T10:29:41.717Z",
              "CreatedBy": "Base Script",
              "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
              "LastUpdatedBy": null,
              "UserName": "OpsSecurEyes02@lucidspire.com",
              "FirstName": "OpsSecurEyes02@lucidspire.com",
              "MiddleName": null,
              "LastName": "SEyes",
              "EmailID": "vinod.avala@secureyes.net"
            },
            {
              "ReviewerID": 3,
              "UserGUID": "F492A38B-8265-ED11-AA60-000C2990EBB7",
              "Description": "harish@lucidspire.com",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T10:29:41.717Z",
              "CreatedBy": "Base Script",
              "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
              "LastUpdatedBy": null,
              "UserName": "harish@lucidspire.com",
              "FirstName": "harish@lucidspire.com",
              "MiddleName": "Kumar",
              "LastName": "Garg",
              "EmailID": "harish.garg@secureyes.net"
            },
            {
              "ReviewerID": 4,
              "UserGUID": "DF260FCA-8565-ED11-AA60-000C2990EBB7",
              "Description": "vamshiv@lucidspire.com",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T10:29:41.717Z",
              "CreatedBy": "Base Script",
              "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
              "LastUpdatedBy": null,
              "UserName": "vamshiv@lucidspire.com",
              "FirstName": "vamshiv@lucidspire.com",
              "MiddleName": "",
              "LastName": "V",
              "EmailID": "vamshivenu.v@gmail.com"
            },
            {
              "ReviewerID": 5,
              "UserGUID": "233D96CC-8865-ED11-AA60-000C2990EBB7",
              "Description": "palanis@lucidspire.com",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T10:29:41.717Z",
              "CreatedBy": "Base Script",
              "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
              "LastUpdatedBy": null,
              "UserName": "palanis@lucidspire.com",
              "FirstName": "palanis@lucidspire.com",
              "MiddleName": "",
              "LastName": "S",
              "EmailID": "palanipalanisamp1990@gmail.com"
            },
            {
              "ReviewerID": 6,
              "UserGUID": "AE98A237-8965-ED11-AA60-000C2990EBB7",
              "Description": "sangeethar@lucidspire.com",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T10:29:41.717Z",
              "CreatedBy": "Base Script",
              "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
              "LastUpdatedBy": null,
              "UserName": "sangeethar@lucidspire.com",
              "FirstName": "sangeethar@lucidspire.com",
              "MiddleName": "",
              "LastName": "R",
              "EmailID": "sangeethaa.r.89@gmail.com"
            },
            {
              "ReviewerID": 7,
              "UserGUID": "5C8B264D-8E65-ED11-AA60-000C2990EBB7",
              "Description": "manohar@lucidspire.com",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T10:29:41.717Z",
              "CreatedBy": "Base Script",
              "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
              "LastUpdatedBy": null,
              "UserName": "manohar@lucidspire.com",
              "FirstName": "manohar@lucidspire.com",
              "MiddleName": "",
              "LastName": "R",
              "EmailID": "smruti.ranjan@secureyes.net"
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Reviewer fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processReviewer(data);
    } else {
      this.service.getActiveReviewer().subscribe(res => {
        next:
        this.processReviewer(res);
      });
    }
  }

  processReviewer(data: any): void {

    if (data.success == 1) {
      if (data.result.recordset.Reviewer.length > 0) {
        this.reviewerDS = data.result.recordset.Reviewer;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getError ():any {
    // this.saveerror = ;
    if (this.masterForm.get('ddlReviewer1')?.touched || this.masterForm.get('ddlReviewer2')?.touched) {
      if (this.masterForm.get('ddlReviewer1')?.value === this.masterForm.get('ddlReviewer2')?.value) {
        this.userSame = true;
        console.log('this.saveerror: '+this.userSame)
        return "Reviewer(s) cannot be same";
      } else {
        this.userSame = false;
        // return '';
      }
    }


  }

  validateSave(): void {
    let obj: any = {
      "schedulePeriod": this.masterForm.get('schedulePeriod')?.value,
      "proposedStartDate": this.utils.ignoreTimeZone(this.masterForm.get('txtProsessedStartDate')?.value),
      "proposedCompletionDate": this.utils.ignoreTimeZone(this.masterForm.get('txtProsessedEndDate')?.value),
      "primaryReviewerID": this.masterForm.get('ddlReviewer1')?.value,
      "secondaryReviewerID": this.masterForm.get('ddlReviewer2')?.value ,
      "scheduleAssessmentDescription": this.masterForm.get('txtDescription')?.value,
      "reminderDate": this.utils.ignoreTimeZone(this.masterForm.get('reminderDate')?.value)
    };
    // this.saveerror = "";
    //Add
    if (this.masterForm.get('txtRateId')?.value == "" || this.masterForm.get('txtRateId')?.value == null) {
      //check the reviewers - if same, show the error prompt
      // if (this.masterForm.get('ddlReviewer1')?.value === this.masterForm.get('ddlReviewer2')?.value) {
      //   this.saveerror = "Reviewer(s) cannot be same";
      // }

      //else {
        this.service.addNew(obj).subscribe(res => {
          next:
          if (res.success == 1) {
            this.dialogRef.close(true);
            this.saveSuccess(res.message);
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveerror = res.error.errorMessage;
          }
          error:
          console.log("err::", "error");
        });
      //}
    }
    else {
      //Edit
      // if (this.masterForm.get('ddlReviewer1')?.value === this.masterForm.get('ddlReviewer2')?.value) {
      //   this.saveerror = "Reviewer(s) cannot be same";
      // } else {

      console.log('obj: '+obj)
        obj.id = this.masterForm.get('txtRateId')?.value;
        this.service.updateData(obj).subscribe(res => {
          next:
          if (res.success == 1) {
            this.dialogRef.close(true);
            this.saveSuccess(res.message);
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveerror = res.error.errorMessage;
          }
          error:
          console.log("err::", "error");
        });
      //}
    }
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
        confirm.close();
      }, timeout)
    });
  }

  quaterDetailsData(): any {
    let year = this.selectedPeriodYearValue;
    let quarterValue = this.selectedPeriodQuarterValue;

    if (quarterValue === 1) {
      return {
        startQuaterDate: new Date(year, 0, 1),
        endQuaterDate: new Date(year, 3, 0)
      }
    }
    if (quarterValue === 2) {
      return {
        startQuaterDate: new Date(year, 3, 1),
        endQuaterDate: new Date(year, 6, 0)
      }
    }
    if (quarterValue === 3) {
      return {
        startQuaterDate: new Date(year, 6, 1),
        endQuaterDate: new Date(year, 9, 0)
      }
    }
    if (quarterValue === 4) {
      return {
        startQuaterDate: new Date(year, 9, 1),
        endQuaterDate: new Date(year, 12, 0)
      }
    }
  }

  selectRadio(){
    this.radioSelect = true
  }

}
