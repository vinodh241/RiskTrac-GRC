import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubmitReviewCommentsComponent } from 'src/app/core-shared/submit-review-comments/submit-review-comments.component';
import { formatTimeZone } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { BusinessFunctionProfileComponent } from './business-function-profile/business-function-profile.component';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { ProcessActivitiesDetailsComponent } from './process-activities-details/process-activities-details.component';
import { DependenciesComponent } from './dependencies/dependencies.component';
import { ImpactAssessmentComponent } from './impact-assessment/impact-assessment.component';
import { RiskMitigationComponent } from './risk-mitigation/risk-mitigation.component';
import { ResourceRequirementsComponent } from './resource-requirements/resource-requirements.component';

@Component({
  selector: 'app-review-business-function',
  templateUrl: './review-business-function.component.html',
  styleUrls: ['./review-business-function.component.scss']
})

export class ReviewBusinessFunctionComponent
{

  selectedSetions: any = 1
  tabsData: any = {}
  renderTabdata: any;
  listingBCP: any;
  dataSaved: any;
  businessFunName: any
  dataDepSaved: any;
  dataRiskSaved: any;
  dataStaffSaved: any
  allBusinessData: any;
  affiliationStatusData: any;
  profilingQuestions: any;
  allViewDetails: any;
  businessProcessList: any;
  customerList: any;
  businessActivities: any;
  section1: any;
  section2: any;
  section3: any;
  section4: any;
  workFlowStatus: any;
  workFlowStatusID: any;
  MTPDValue: any;
  RPOValue: any;
  RTOValue: any;
  MACValue: any;
  MNPRValue: any;
  allSectionSave1: any;
  allSectionSave2: any;
  allSectionSave3: any;
  allSectionSave4: any;
  allSectionSave5: any;
  allSectionSave6: any;
  allSectionSave7: any;
  allSectionSave8: any;
  selectedBCC: any;
  LastReviewed: any;
  currentStatus: any;
  IsBCManager: any;
  IsBusinessOwner: any;
  IsBCC: any;
  buttonName: any;
  IsBCCValidUser: any;
  currentStatusID: any;
  BIARating: any;
  BIARatingDropdownData: any[] = [];
  disableNext: boolean = false;
  dataProcessSaved: boolean = false;
  dataImpactSaved: boolean = false;
  dataResourceSaved: boolean = false;
  dataRecoverySaved: boolean = false;
  dependencyFlag: boolean = false
  riskMitigationFlag: boolean = false
  staffConFlag: boolean = false
  businessFunctionFlag: boolean = false
  processActivityFlag: boolean = false;
  impactAsseFlag: boolean = false;
  resourceFlag: boolean = false;
  recoveryFlag: boolean = false;

  constructor(
    private authService: AuthService,
    private route: Router,
    public businessContinuityService: BusinessContinuityPlansService,
    public router: Router,
    public dialog: MatDialog,
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("business-continuity-plan");
  }

  ngOnInit() {
    setTimeout(() => {
      this.IsBCCValidUser = Number(localStorage.getItem("IsBCCValidUser"))
      if (this.IsBCCValidUser == 1) {
        this.listingBCP = false;
      } else {
        this.listingBCP = true;
      }

      this.MTPDValue = localStorage.getItem("MTPDValue")
      this.RPOValue = localStorage.getItem("RPOValue")
      this.RTOValue = localStorage.getItem("RTOValue")
      this.MACValue = localStorage.getItem("MACValue")
      this.MNPRValue = localStorage.getItem("MNPRValue")

      this.dataSaved = this.businessContinuityService.dataSaved
      this.dataProcessSaved = this.businessContinuityService.dataProcessSaved
      this.dataDepSaved = this.businessContinuityService.dataDepSaved
      this.dataRiskSaved = this.businessContinuityService.dataRiskSaved
      this.dataImpactSaved = this.businessContinuityService.dataImpactSaved
      this.dataStaffSaved = this.businessContinuityService.dataStaffSaved
      this.dataResourceSaved = this.businessContinuityService.dataResourceSaved
      this.dataRecoverySaved = this.businessContinuityService.dataRecoverySaved
      this.businessFunName = localStorage.getItem("BusinessFunctionName")
      this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
      this.selectedBCC = localStorage.getItem("BCCNotFound");
      this.LastReviewed = localStorage.getItem("LastReviewed");
      this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")
    }, 1000)
  }

  ngOnChanges() {
    this.dataProcessSaved = this.businessContinuityService.dataProcessSaved
    this.dataDepSaved = this.businessContinuityService.dataDepSaved
    this.dataRiskSaved = this.businessContinuityService.dataRiskSaved
    this.dataImpactSaved = this.businessContinuityService.dataImpactSaved
    this.dataStaffSaved = this.businessContinuityService.dataStaffSaved
    this.dataResourceSaved = this.businessContinuityService.dataResourceSaved
    this.dataRecoverySaved = this.businessContinuityService.dataRecoverySaved
    this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
    this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")
  }

  selectSections(renderTab: any) {
    this.renderTabdata = renderTab
    this.selectedSetions = renderTab
  }

  nextSection(id: any) {
    if (this.selectedSetions == 1) {
      this.selectedSetions = 2
    } else if (this.selectedSetions == 2) {
      this.selectedSetions = 3
    } else if (this.selectedSetions == 3) {
      this.selectedSetions = 4
    } else if (this.selectedSetions == 4) {
      this.selectedSetions = 5
    } else if (this.selectedSetions == 5) {
      this.selectedSetions = 6
    } else if (this.selectedSetions == 6) {
      this.selectedSetions = 7
    } else if (this.selectedSetions == 7) {
      this.disableNext = true
      this.selectedSetions = 8
    }
  }

  previousSection(id: any) {
    if (this.selectedSetions == 2) {
      this.selectedSetions = 1
    } else if (this.selectedSetions == 3) {
      this.selectedSetions = 2
    } else if (this.selectedSetions == 4) {
      this.selectedSetions = 3
    } else if (this.selectedSetions == 5) {
      this.selectedSetions = 4
    } else if (this.selectedSetions == 6) {
      this.selectedSetions = 5
    } else if (this.selectedSetions == 7) {
      this.selectedSetions = 6
    } else if (this.selectedSetions == 8) {
      this.selectedSetions = 7
    }
  }

  onSubmit(id: any) {
    if (id == 1) {
      this.businessFunctionFlag = true
    } else if (id == 2) {
      this.processActivityFlag = true;
    } else if (id == 3) {
      this.dependencyFlag = true
    } else if (id == 4) {
      this.impactAsseFlag = true
    } else if (id == 5) {
      this.riskMitigationFlag = true
    } else if (id == 6) {
      this.resourceFlag = true;
    } else if (id == 7) {
      this.staffConFlag = true
    } else if (id == 8) {
      this.recoveryFlag = true
    }
  }

  // Navigation to the Listing Page
  navigateToListing() {
    this.route.navigate(['/business-continuity-plan/business-continuity-listing']);
  }

  profileData1() {
    this.businessContinuityService.allSectionDetails(Number(localStorage.getItem("BusinessContinuityPlanID")), Number(localStorage.getItem("BusinessFunctionID")))
    this.businessContinuityService.processBusinessMaster.subscribe((value) => {
      if (value) {
        this.allSectionSave1 = this.businessContinuityService.allSectionSave.Section1IsSaved;
        this.allSectionSave2 = this.businessContinuityService.allSectionSave.Section2IsSaved;
        this.allSectionSave3 = this.businessContinuityService.allSectionSave.Section3IsSaved;
        this.allSectionSave4 = this.businessContinuityService.allSectionSave.Section4IsSaved;
        this.allSectionSave5 = this.businessContinuityService.allSectionSave.Section5IsSaved;
        this.allSectionSave6 = this.businessContinuityService.allSectionSave.Section6IsSaved;
        this.allSectionSave7 = this.businessContinuityService.allSectionSave.Section7IsSaved;
        this.allSectionSave8 = this.businessContinuityService.allSectionSave.Section8IsSaved;
      }
    }
    )
  }

  profileData(event: boolean) {
    this.dataSaved = event;
  }

  getBusinessData(event: any) {
    if (event) {
      this.businessContinuityService.allSectionDetails(Number(localStorage.getItem("BusinessContinuityPlanID")), Number(localStorage.getItem("BusinessFunctionID")))
    }
  }

  processData(event: boolean) {
    this.dataProcessSaved = event;
  }

  getProcessData(event: any) {
    if (event) {
      this.businessContinuityService.allSectionDetails(Number(localStorage.getItem("BusinessContinuityPlanID")), Number(localStorage.getItem("BusinessFunctionID")))
    }
  }

  dependencyData(event: boolean) {
    this.dataDepSaved = event;
  }

  impactData(event: boolean) {
    this.dataImpactSaved = event;
  }

  riskData(event: boolean) {
    this.dataRiskSaved = event;
  }

  resourceData(event: boolean) {
    this.dataResourceSaved = event;
  }

  staffData(event: boolean) {
    this.dataStaffSaved = event;
  }

  recoveryData(event: boolean) {
    this.dataRecoverySaved = event;
    if (this.dataRecoverySaved == true) {
      this.displayButton()
    }
  }

  isAnyDataSaved(): boolean {
    return this.selectedSetions <= '7' &&
      (
        this.businessContinuityService.dataSaved ||
        this.businessContinuityService.dataProcessSaved ||
        this.businessContinuityService.dataDepSaved ||
        this.businessContinuityService.dataRiskSaved ||
        this.businessContinuityService.dataImpactSaved ||
        this.businessContinuityService.dataStaffSaved ||
        this.businessContinuityService.dataResourceSaved
      );
  }

  isNextEnable(): boolean {
    if (this.selectedSetions == 1 && this.dataSaved == true) {
      return true;
    } else if (this.selectedSetions == 2 && this.dataProcessSaved == true) {
      return true;
    } else if (this.selectedSetions == 3 && this.dataDepSaved == true) {
      return true;
    } else if (this.selectedSetions == 4 && this.dataImpactSaved == true) {
      return true;
    } else if (this.selectedSetions == 5 && this.dataRiskSaved == true) {
      return true;
    } else if (this.selectedSetions == 6 && this.dataResourceSaved == true) {
      return true;
    } else if (this.selectedSetions == 7 && this.dataStaffSaved == true) {
      return true;
    } else {
      return false;
    }
  }

  getTimeFormat(date: any) {
    let dateFormat = formatTimeZone(date)
    let dateData = dateFormat + "T00:00:00.000Z";
    return this.dateToYMd(dateData)
  }

  dateToYMd(date: string) {
    const inputDate = new Date(date);
    return inputDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
  }

  workflowDetails(event: any) {
    this.IsBCC = event.IsBCCUser;
    this.IsBCManager = event.IsBCManager;
    this.IsBusinessOwner = event.IsBusinessOwner;
    this.currentStatusID = event.currentWorkflowStatusID;
    this.currentStatus = event.currentWorkflowStatus;
    this.BIARating = event.BIARating;
  }

  displayButton() {
    if (this.IsBCC == true && (this.currentStatusID == 2 || this.currentStatusID == 7)) {
      this.buttonName = 'Submit for Review';
    } else if (this.IsBCManager == true && (this.currentStatusID == 3 || this.currentStatusID == 4)) {
      this.buttonName = 'Take Review Action';
    } else if (this.IsBusinessOwner == true && (this.currentStatusID == 5 || this.currentStatusID == 6)) {
      this.buttonName = 'Take Review Action';
    }
    return this.buttonName
  }

  enableButton() {
    if (this.IsBCC == true && (this.currentStatusID == 2 || this.currentStatusID == 7)) {
      return true;
    } else if (this.IsBCManager == true && (this.currentStatusID == 3 || this.currentStatusID == 4)) {
      return true;
    } else if (this.IsBusinessOwner == true && (this.currentStatusID == 5 || this.currentStatusID == 6)) {
      return true;
    } else if (this.currentStatusID == 8) {
      return false;
    } else {
      return false;
    }
  }

  async openSubmit() {
    // Fetch BIA Rating master data from API
    try {
      const response: any = await this.businessContinuityService.getBIARatingMasterData().toPromise();
      if (response && response.success === 1 && response.result?.biaRatingList) {
        this.BIARatingDropdownData = response.result.biaRatingList;
      } else {
        // Fallback to default values if API fails
        this.BIARatingDropdownData = [
          { id: 1, value: "Low", description: "" },
          { id: 2, value: "Medium", description: "" },
          { id: 3, value: "High", description: "" }
        ];
      }
    } catch (error) {
      console.error('Error fetching BIA Rating data:', error);
      // Fallback to default values if API fails
      this.BIARatingDropdownData = [
        { id: 1, value: "Low", description: "" },
        { id: 2, value: "Medium", description: "" },
        { id: 3, value: "High", description: "" }
      ];
    }

    let reviewData: any;
    if (this.IsBCC == true && (this.currentStatusID == 2 || this.currentStatusID == 7)) {
      reviewData = {
        isDecision: { required: false, isDropdown: { required: false } },
        dropdownLable: "Review Decision for",
        modalTitle: 'Submit for Review',
        modalBodyTitle: "Please submit the draft BCP document for BC Manager.",
        commentLabel: "Comment",
        buttonLabel: "Submit for Review",
        getCommentsURL: "/business-continuity-management/business-continuity-planning/get-business-continuity-plans-list",
        commentsPayload: {
          BusinessContinuityPlanID: Number(localStorage.getItem("BusinessContinuityPlanID")),
          BusinessFunctionID: Number(localStorage.getItem("BusinessFunctionID"))
        },
        submitReviewURL: "/business-continuity-management/business-continuity-planning/submit-review",
        payload: {
          BusinessContinuityPlanID: Number(localStorage.getItem("BusinessContinuityPlanID")),
          BusinessFunctionID: Number(localStorage.getItem("BusinessFunctionID")),
          dropdownValue: this.BIARating ? this.BIARating : '',
          IsCoordinator: this.IsBCCValidUser === 1 ? true : this.IsBCCValidUser === 0 ? false : '',
          IsBCManager: this.IsBCManager,
          IsBusinessOwner: this.IsBusinessOwner
        }
      }
    } else if (this.IsBCManager == true || this.IsBusinessOwner == true) {
      reviewData = {
        dropDownLable: "BIA Rating",
        isDropdown: {
          required: true,
          dropdownData: this.BIARatingDropdownData
        },
        dropdownLable: "Review Decision for",
        isDecision: {
          required: true,
          optionData: [{ id: 1, value: "Approve BCP Document", class: "greenRadio" },
          { id: 2, value: "Return with comment", class: "redRadio mt-2" }
          ],
        },
        modalTitle: 'Review BCP',
        modalBodyTitle: "Please provide review decision for this BCP. If approved, the BCP will be submitted to BC Manager. If returned, the BCC for the Business Function will receive a notification and will be able to make further changes and submit again",
        commentLabel: "Decision Justification / Comment",
        buttonLabel: "Submit",
        getCommentsURL: "/business-continuity-management/business-continuity-planning/get-business-continuity-plans-list",
        commentsPayload: {
          BusinessContinuityPlanID: Number(localStorage.getItem("BusinessContinuityPlanID")),
          BusinessFunctionID: Number(localStorage.getItem("BusinessFunctionID"))
        },
        submitReviewURL: "/business-continuity-management/business-continuity-planning/submit-review",
        payload: {
          BusinessContinuityPlanID: Number(localStorage.getItem("BusinessContinuityPlanID")),
          BusinessFunctionID: Number(localStorage.getItem("BusinessFunctionID")),
          IsCoordinator: this.IsBCCValidUser === 1 ? true : this.IsBCCValidUser === 0 ? false : '',
          IsBCManager: this.IsBCManager,
          IsBusinessOwner: this.IsBusinessOwner
        }
      }
    }

    const dialog = this.dialog.open(SubmitReviewCommentsComponent, {
      maxWidth: '100vw',
      width: '85vw',
      panelClass: ['bcp', 'full-screen-modal'],
      data: {
        data: reviewData,
        BIA: this.BIARating,
        currentStep: this.currentStatus,
        BCOwner: this.IsBusinessOwner
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.saveSuccessPopup("Submitted Successfully");
      }
    });
  }

  saveSuccessPopup(content: string): void {
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
        this.router.navigate(['business-impact-analysis/business-impact-analysis'])
      }, timeout)
    });
  }

  tabsEnableData(event: any) {
    this.tabsData = event;

    this.dataSaved = this.tabsData.Section1IsSaved;
    this.dataProcessSaved = this.tabsData.Section2IsSaved;
    this.dataDepSaved = this.tabsData.Section3IsSaved;
    this.dataImpactSaved = this.tabsData.Section4IsSaved;
    this.dataRiskSaved = this.tabsData.Section5IsSaved;
    this.dataResourceSaved = this.tabsData.Section6IsSaved;
    this.dataStaffSaved = this.tabsData.Section7IsSaved;
    this.dataRecoverySaved = this.tabsData.Section8IsSaved;

    this.allSectionSave1 = this.tabsData.Section1IsSaved;
    this.allSectionSave2 = this.tabsData.Section2IsSaved;
    this.allSectionSave3 = this.tabsData.Section3IsSaved;
    this.allSectionSave4 = this.tabsData.Section4IsSaved;
    this.allSectionSave5 = this.tabsData.Section5IsSaved;
    this.allSectionSave6 = this.tabsData.Section6IsSaved;
    this.allSectionSave7 = this.tabsData.Section7IsSaved;
    this.allSectionSave8 = this.tabsData.Section8IsSaved;
  }

  exportDraft() {
    this.businessContinuityService.exportDraft(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"))
  }
}