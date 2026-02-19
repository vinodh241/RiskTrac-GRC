import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formatedDate1 } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';

@Component({
  selector: 'app-bcms-test-details',
  templateUrl: './bcms-test-details.component.html',
  styleUrls: ['./bcms-test-details.component.scss']
})
export class BcmsTestDetailsComponent {
  testDetails: any;
  isDateTimeEditable: boolean = false;

  // start/end::date/time -- Declaration
  minDate: any = new Date();
  endTestDateError: boolean = false;
  actualStartDate: any;
  actualEndDate: any;
  actualStartTime: any;
  actualEndTime: any;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public service: BcmsTestingService
  ) { }

  ngOnInit(): void {
    this.service.gotBCMSTestDetails$.subscribe((value: any) => {
      if (value) {
        this.testDetails = this.service.testDetails;
      }
    });
  }

  getDateFormat(inputDateTime: any): string {
   return formatedDate1(inputDateTime);
  }

  // Set BCMS Testing date and time -- start
  setStartTestDate() {
    this.endTestDateError = false;
    let startDate = new Date(this.actualStartDate);
    let endDate = new Date(this.actualEndDate);
    if (endDate?.getTime() < startDate?.getTime())
      this.endTestDateError = true;
    else
      this.endTestDateError = false;
  }

  setEndTestDate() {
    this.endTestDateError = false;
    let startDate = new Date(this.actualStartDate);
    let endDate = new Date(this.actualEndDate);
    if (endDate?.getTime() < startDate?.getTime())
      this.endTestDateError = true;
    else
      this.endTestDateError = false;
  }
  // Set BCMS Testing date and time -- end
  //-------------------------------------------------------------------------------------------------------------

  getParticipantOptionValue() {
    if (this.testDetails?.ParticipantOptionID == 1) {
      return '';
    } else if (this.testDetails?.ParticipantOptionID == 2) {
      return this.testDetails.Sites.map((x: any) => x.SiteName).join(", ") + '.';
    } else if (this.testDetails?.ParticipantOptionID == 3) {
      return this.testDetails.BusinessFunctions.map((x: any) => x.BusinessFunctionsName).join(", ") + '.';
    } else if (this.testDetails?.ParticipantOptionID == 4) {
      return this.testDetails.Sites.map((x: any) => x.SiteName).join(", ") + '.';
    } else {
      return '';
    }
  }
}
