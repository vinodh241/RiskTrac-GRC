import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { SelfAssessmentsService } from 'src/app/services/rcsa/self-assessments/self-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { TableUtil } from "src/app/pages/rcsa/inherent-risk/tableUtil";
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { AdhocriskformComponent } from './adhocriskform/adhocriskform.component';

export interface DataModel {
  RowNumber?: number,
  RCSACode: string;
  Period: string;
  Description: string;
  ProposedStartDate: Date;
  ProposedEndDate: Date;
  Reviewer1: string;
  Reviewer1ID: number;
  Reviewer2: string;
  Reviewer2ID: number;
  Status: string;
  IsActive: boolean;
  ScheduleAssesmentID?: number;
}
@Component({
  selector: 'app-self-assessments',
  templateUrl: './self-assessments.component.html',
  styleUrls: ['./self-assessments.component.scss']
})
export class SelfAssessmentsComponent implements OnInit {
  displayedColumns: string[] = [
    'SLNo',
    'Group',
    'Unit',
    'Risk',
    'ScheduleInherentRiskStatus',
    'OverallInherentRiskRating',
    'OverallControlEnvironment',
    'ResidualRiskRating',
    'ActionPlanRequired',      // <— new
    'TotalActionPlans'        // <— new
    // 'Comments'
  ];
  dataSource!: MatTableDataSource<DataModel>;
  dataSourceAssessmentCard: any;
  saveerror: string = "";
  summaryGroupHeadText: string = "In Progress";
  summaryGroupHeadSubText: string = "Details";
  showRiskStatus: boolean = false;
  showInherentRiskStatus: boolean = false;
  showInherentRatingStatus: boolean = false;
  showInherentProcessStatus: boolean = false;
  showcontrolFrequencyStatus: boolean = false;
  showControlAssessmentStatus: boolean = false;
  showcontrolTestingStatus: boolean = false;
  showActionPlanStatus: boolean = false;
  showActionPlanCommentStatus: boolean = false;
  percentageValue: any;
  scheduleAssessmentID: any;
  scheduleAssessmentData: any;
  controlAssessmentSpan!: number;
  inherentRateSpan!: number;
  showexportData: boolean = false;
  actionPlanStatusSpan!: number;
  rcsaSelfAssessmentHeader: any;
  datanotFound!: string;
  isFunctionalAdmin: boolean = false;
  isShowSubmitbtn: boolean = false;
  indexData: any = 0;
  UnitNames: boolean = false;
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  SelfAssessmentSummaryList: any = [];


  constructor(private service: ScheduleAssessmentsService,
    private selfAssessmentsService: SelfAssessmentsService,
    private configScoreRatingService: ConfigScoreRatingService,
    public utils: UtilsService,
    public dialog: MatDialog,
    private router: Router,
    private datepipe: DatePipe,
    @Inject(DOCUMENT) private _document: any,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.scheduleAssessmentID = Number(this.activatedRoute.snapshot.params['id'] ?? 0);
    this.getPageLoad();
    this.controlAssessmentSpan = this.showControlAssessmentStatus ? 2 : 7;
    this.inherentRateSpan = this.showInherentRiskStatus ? 3 : 10;
    this.actionPlanStatusSpan = this.showActionPlanStatus ? 1 : 6;
    this.isFunctionalAdmin = this.utils.isFunctionalAdmin();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this.dataSource.data.map((item: any) => {
      let filteredItem = { ...item };
      delete filteredItem.UnitIDs
      return filteredItem;
    });

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.showexportData = this.dataSource.filteredData && this.dataSource.filteredData.length > 0;
  }

  getTooltip(row: any, value: any) {
    if (row[value])
      return row[value];
    else
      return "";
  }

  exportAsXLSX() {
    let obj: any = [];
    if (!this.dataSource.filteredData.length) return;

    const safeParseArray = (jsonStr: any) => {
      if (jsonStr == null || jsonStr === '' || typeof jsonStr === 'undefined') return [];
      try {
        const parsed = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') return [parsed];
        return [];
      } catch {
        // not valid JSON -> return empty
        return [];
      }
    };

    const formatControlsForExcel = (controlArr: any[]) => {
      if (!controlArr || !controlArr.length) return 'NA';
      const formatted = controlArr.map((c: any) => {
        const code = (c?.ControlCode ?? c?.ControlCodeName ?? c?.ControlId ?? '') + '';
        const desc = (c?.ControlDescription ?? c?.Description ?? '') + '';
        const type = (c?.ControlType ?? c?.ControlTypeName ?? c?.ControlTypeDesc ?? '') + '';
        // Key: Value, Key: Value, Key: Value  (no brackets)
        return [`ControlCode: ${code}`, `ControlDescription: ${desc}`, `ControlType: ${type}`].join(', ');
      });
      // separate multiple control objects with " | "
      return formatted.join(' | ');
    };

    const formatActionPlansForExcel = (actionArr: any[]) => {
      if (!actionArr || !actionArr.length) return 'NA';
      const formatted = actionArr.map((a: any) => {
        const identifiedAction = (a?.IdentifiedAction ?? a?.Action ?? '') + '';
        const actionResp = (a?.ActionResponsiblePersonName ?? a?.ResponsiblePerson ?? '') + '';
        const timelineRaw = a?.Timeline ?? a?.TimelineDate ?? a?.PlannedDate ?? null;
        const timeline = timelineRaw ? this.datepipe.transform(new Date(timelineRaw), 'dd MMM yyyy') : '';
        const statusName = (a?.ActionPlanStatusName ?? a?.Status ?? '') + '';
        const comments = (a?.ActionPlanComments ?? a?.Comments ?? '') + '';
        const controlVerification = (a?.ControlVerificationClosureName ?? a?.ControlVerificationClosure ?? '') + '';

        const totalCost = (typeof a?.TotalCost === 'number') ? a.TotalCost : (a?.TotalCost ? Number(a.TotalCost) : 0);
        const totalBenefit = (typeof a?.TotalBenefit === 'number') ? a.TotalBenefit : (a?.TotalBenefit ? Number(a.TotalBenefit) : 0);
        const totalNetBenefit = (typeof a?.TotalNetBenefit === 'number') ? a.TotalNetBenefit : (a?.TotalNetBenefit ? Number(a.TotalNetBenefit) : (totalBenefit - totalCost));
        const totalPVCost = (typeof a?.TotalPresentValueCost === 'number') ? a.TotalPresentValueCost : (a?.TotalPresentValueCost ? Number(a.TotalPresentValueCost) : 0);
        const totalPVBEN = (typeof a?.TotalPresentValueBenefit === 'number') ? a.TotalPresentValueBenefit : (a?.TotalPresentValueBenefit ? Number(a.TotalPresentValueBenefit) : 0);
        const benefitCostRatioVal = (typeof a?.BenefitCostRatio === 'number') ? a.BenefitCostRatio : (a?.BenefitCostRatio ? Number(a.BenefitCostRatio) : null);

        // compute ProjectViability as specified
        let ProjectViability: string | null = null;
        if (benefitCostRatioVal === null || typeof benefitCostRatioVal === 'undefined' || isNaN(benefitCostRatioVal)) {
          ProjectViability = null;
        } else if (benefitCostRatioVal > 1) {
          ProjectViability = 'project is viable';
        } else if (benefitCostRatioVal < 1) {
          ProjectViability = 'project is not viable';
        } else {
          ProjectViability = 'Break-even';
        }

        const ctrlType = (a?.ControlType ?? a?.ControlTypeName ?? '') + '';

        // Build comma-separated Key: Value pairs for ActionPlan
        const parts: string[] = [
          `IdentifiedAction: ${identifiedAction}`,
          `ControlType: ${ctrlType}`,
          `ActionResponsiblePersonName: ${actionResp}`,
          `Timeline: ${timeline}`,
          `ActionPlanStatusName: ${statusName}`,
          `ActionPlanComments: ${comments}`,
          `ControlVerificationClosureName: ${controlVerification}`,
          `TotalCost: ${totalCost}`,
          `TotalBenefit: ${totalBenefit}`,
          `TotalNetBenefit: ${totalNetBenefit}`,
          `TotalPresentValueCost: ${totalPVCost}`,
          `TotalPresentValueBenefit: ${totalPVBEN}`,
          `BenefitCostRatio: ${benefitCostRatioVal === null ? '' : benefitCostRatioVal}`,
          `ProjectViability: ${ProjectViability === null ? '' : ProjectViability}`
        ];

        return parts.join(', ');
      });

      // separate multiple action plan objects with " | "
      return formatted.join(' | ');
    };

    this.dataSource.filteredData.forEach((m: any) => {
      const parsedControlData = safeParseArray(m.ControlData ?? m.ControlDataJson ?? null);
      const parsedActionData = safeParseArray(m.ActionPlanData ?? m.ActionPlanDataJson ?? null);

      const controlsString = formatControlsForExcel(parsedControlData);
      const actionPlansString = formatActionPlansForExcel(parsedActionData);

      obj.push({
        "RCSA Code": m.RCSACode,
        "SLNO": m.SLNO,
        "Group": m.GroupName,
        "Unit": m.UnitName,
        "Status": m.ScheduleInherentRiskStatusName,
        "Risk Category": m.RiskCategoryName,
        "Process": m.ProcessName,
        "Risk": m.Risk,
        "Likelihood Rating": m.InherentLikelihoodName,
        "Impact Rating": m.InherentImpactRatingName,
        "Overall Inherent Risk Rating": m.OverallInherentRiskRating,

        // Replaced old separate columns with combined formatted columns
        "Controls": controlsString,
        "Control In Pace": m.ControlInPaceName,
        "Control Nature": m.ControlNatureName,
        "Control Automation": m.ControlAutomationName,
        "Control Frequency": m.ControlFrequencyName,
        "Overall Control Environment Risk Rating": m.OverallControlEnvironmentRiskRating,

        "Residual Risk Rating": m.ResidualRiskRating,
        "Residual Risk Response": m.ResidualRiskResponseName,
        "Residual Risk Responsible Person": m.ResidualRiskResponsiblePersonName,

        // Combined ActionPlans column (includes ProjectViability)
        "ActionPlans": actionPlansString,

        "Confirmation/Verification of Closure": m.ControlVerificationClosureName,
        "Control Testing Result": m.ControlTestingResultName,
        "Control Testing Result Comment": m.ControlTestingResultComment,
        "Comment": m.SelfComment,

        // "PostTreatmentComputedControlInPace": m.PostTreatmentComputedControlInPace,
        // "PostTreatmentComputedControlNatureofControl": m.PostTreatmentComputedControlNatureofControl,
        "PT Description": m.PostTreatmentDescription,
        "PT Control InPace Name": m.PostTreatmentControlInPaceName,
        "PT Control Automation Name": m.PostTreatmentControlAutomationName,
        "PT Control Nature Name": m.PostTreatmentControlNatureName,
        "PT Control Frequency Name": m.PostTreatmentControlFrequencyName,
        "PT Control Environment Risk Rating": m.PostTreatmentControlEnvironmentRiskRating,
        "PT Residual Risk Rating": m.PostTreatmentResidualRiskRating
      });
    });

    TableUtil.exportArrayToExcel(obj, "Self_Schedule_Assessment");
  }

  getPageLoad(): void {
    this.isShowSubmitbtn = false;
    let obj = { "id": this.scheduleAssessmentID };
    this.configScoreRatingService.getSelfAssessmentDashboardScreen(obj).subscribe({
      next: (data: any) => {
        if (data.success == 1) {
          this.processScheduleAssessments(data, false);
          this.processAssessmentCard(data);
        } else {
          if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
        }
      }
    });
  }

  submitScheduleAssessment(): void {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: "Confirm Risk",
        content: "Are you sure you want to submit all the Risks in draft status?"
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        let req = {
          id: this.scheduleAssessmentID
        };
        this.selfAssessmentsService.submitSelfAssessment(req).subscribe(res => {
          if (res.success == 1) {
            next:
            this.saveSuccess(res.message);
            this.getPageLoad();
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveError(res.error.errorMessage);
          }

        });
      }
    });

  }

  createAdHocRisk(): void {
    const dialogRef = this.dialog.open(AdhocriskformComponent, {
      disableClose: true,
      width: "120vh",
      minHeight: "80vh",
      data: {
        mode: "add",
        scheduleAssessmentID: this.scheduleAssessmentID
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPageLoad();
      }
    });
  }


  processScheduleAssessments(gridData: any, isfilter: boolean = false): void {
    if (gridData.success == 1) {
      if (!isfilter && gridData.result.recordset.ScheduleAssessment?.length > 0) {
        let assessmentData = gridData.result.recordset.ScheduleAssessment[0];
        this.SelfAssessmentSummaryList = gridData.result.recordset.SelfAssessmentSummary;
        if (this.SelfAssessmentSummaryList.length) {
          let unitData = [...new Set(this.SelfAssessmentSummaryList.map((n: any) => n.UnitName))];
          console.log('processScheduleAssessments::SA::unitsData:', unitData);
          let userLoggedData = this.utils.isLoggedInUserUnitData();
          console.log('processScheduleAssessments::user:UnitsData:', userLoggedData);
          if (userLoggedData.some((item: any) => unitData.includes(item.UnitName))) {
            this.UnitNames = true;
          }
        } else {
          this.UnitNames = false;
        }
        this.rcsaSelfAssessmentHeader = {
          RCSACode: assessmentData.RCSACode,
          ProposedStartDate: assessmentData.ProposedStartDate,
          ProposedCompletionDate: assessmentData.ProposedCompletionDate,
          Status: assessmentData.RCSAStatusName,
          Period: assessmentData.SchedulePeriod
        }
        this.isShowSubmitbtn = !assessmentData.ISReviewer;
      }
      else if (!isfilter) {
        this.rcsaSelfAssessmentHeader = {
          RCSACode: '-',
          ProposedStartDate: null,
          ProposedCompletionDate: null,
          Status: "-",
          Period: " - "
        }
      }
      if (gridData.result.recordset.SelfAssessmentSummary.length > 0) {
        let docs = gridData.result.recordset.SelfAssessmentSummary;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
            this.scheduleAssessmentID = doc.ScheduleAssessmentID;

            if (doc.ScheduleInherentRiskStatusID == 1) {
              doc.TotalActionPlans = '';
              doc.ActionPlanRequiredText = '';
            } else {
              doc.TotalActionPlans = this.parseActionPlanLen(doc.ActionPlanData);
              doc.ActionPlanRequiredText = doc.IsActionPlanRequired == null ? '' : doc.IsActionPlanRequired == 1 ? 'Yes' : 'No';
            }

          })

          this.dataSource = new MatTableDataSource(docs);
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        }
      }
      else {
        this.dataSource = new MatTableDataSource();
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }
      this.showexportData = this.dataSource.filteredData.length > 0 ? true : false;
    } else {
      if (gridData.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
      else {
        this.rcsaSelfAssessmentHeader = {
          RCSACode: '-',
          ProposedStartDate: null,
          ProposedCompletionDate: null,
          Status: "-",
          Period: " - "
        }
      }
    }
    if (this.rcsaSelfAssessmentHeader.RCSACode == '-') {
      this.datanotFound = "No RCSA is in In-progress";
    } else if ((gridData.result.recordset.ScheduleAssessment.length > 0 && gridData.result.recordset.SelfAssessmentSummary.length == 0)) {
      this.datanotFound = "No Relevant Inherent Risk found.";
    }
    else {
      this.datanotFound = "";
    }
  }

  navigateDetails(data: any): void {
    this.manageSelfAssessmentDetails(data);
  }

  CollapseShowRiskStatus() {
    this.showRiskStatus = !this.showRiskStatus;
    this.CollapseShowInherentRiskStatus();
  }

  CollapseShowInherentRiskStatus() {
    this.showInherentRiskStatus = this.showInherentRatingStatus = this.showInherentProcessStatus = this.showRiskStatus = !this.showInherentRiskStatus;
    this.inherentRateSpan = this.showInherentRiskStatus ? 3 : 10;
  }

  CollapseShowInherentRatingStatus() {
    this.showInherentRatingStatus = !this.showInherentRatingStatus;
    this.inherentRateSpan = this.showInherentRatingStatus ? 8 : 10;
  }

  CollapseShowInherentProcessStatus() {
    this.showInherentRatingStatus = this.showInherentProcessStatus = !this.showInherentProcessStatus;
    this.inherentRateSpan = this.showInherentProcessStatus ? 6 : 10;
  }

  CollapseShowControlFrequencyStatus() {
    this.showcontrolFrequencyStatus = !this.showcontrolFrequencyStatus;
    this.controlAssessmentSpan = this.showcontrolFrequencyStatus ? 3 : 7;
  }

  CollapseShowControlAssessmentStatus() {
    this.showControlAssessmentStatus = this.showcontrolFrequencyStatus = !this.showControlAssessmentStatus;
    this.controlAssessmentSpan = this.showControlAssessmentStatus ? 2 : 7;
  }

  CollapseShowControlTestingStatus() {
    this.showcontrolTestingStatus = !this.showcontrolTestingStatus;
  }

  CollapseShowActionPlanCommentStatus() {
    this.showActionPlanCommentStatus = !this.showActionPlanCommentStatus;
    this.actionPlanStatusSpan = this.showActionPlanCommentStatus ? 3 : 6;
  }

  CollapseShowActionPlanStatus() {
    this.showActionPlanStatus = this.showActionPlanCommentStatus = !this.showActionPlanStatus;
    this.actionPlanStatusSpan = this.showActionPlanStatus ? 1 : 6;
  }

  changed(data: any): void {
    let obj = {
      "id": data.ControlAutomationID,
      "isActive": !data.IsActive
    }
    this.service.updateStatus(obj).subscribe({
      next: (res: any) => {
        if (res.success == 1) {
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveerror = res.error.errorMessage;
        }
      },
      error: (error: any) => {
        console.log("err::", error);
      }
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

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();

        this.getPageLoad();
      }, timeout)
    });
  }

  saveError(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "error",
      data: {
        title: "Failed",
        content: content
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();

        this.getPageLoad();
      }, timeout)
    });
  }

  manageSelfAssessmentDetails(data: any): void {
    let req = this.dataSource.filteredData.map((item: any) => item.ScheduleInherentRiskID);
    localStorage.setItem('SelfAssessmentDetailsScheduleInherentRiskIDs', JSON.stringify(req));
    this.router.navigate(['self-assessments', 'self-assessments-details', data.ScheduleInherentRiskID]);
  }

  getAssessmentCard(data: any) {
    let obj = { id: data };
    this.service.getAssessmentCard(obj).subscribe(res => {
      next:
      this.processAssessmentCard(res);
    });

  }

  processAssessmentCard(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ScheduleAssessmentCard.length > 0) {
        let docs = data.result.recordset.ScheduleAssessmentCard;
        if (docs) {

          const result = data.result.recordset.ScheduleAssessmentCard.filter((s: any) => s.ScheduleInherentRiskStatusName == "Total");
          this.rcsaSelfAssessmentHeader.TotalPercentage = result[0].PercentageValue;
          this.dataSourceAssessmentCard = data.result.recordset.ScheduleAssessmentCard;
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getStatusFilter(id: any, index: any) {
    if (id !== undefined && id !== null) {
      let req = {
        id: this.scheduleAssessmentID,
        scheduleInherentRiskStatusID: id
      };
      this.selfAssessmentsService.getSelfAssessmentByStatus(req).subscribe(res => {
        next:
        this.processScheduleAssessments(res, true);
      });
    }
    this.indexData = index;
  }

  navigateToPreviousPage() {
    this.router.navigateByUrl('schedule-assessments')
  }

  canSubmitAccess(): boolean {
    let result = false;
    if (this.utils.isStandardUser() && this.utils.isRiskManagementUnit()
    ) {
      result = false
    } else if (this.utils.isPowerUser()) {
      result = true
    }
    return result;
  }


  get isRiskManagementUnit() {
    return this.utils.isRiskManagementUnit();
  }

  private parseActionPlanLen(apData: any): number {
    try {
      const arr = typeof apData === 'string' ? JSON.parse(apData || '[]') : (apData ?? []);
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  }

  canSubmitByActionPlan(): boolean {
    const rows: any[] = this.dataSource?.data ?? this.SelfAssessmentSummaryList ?? [];
    if (!rows.length) return false;
    return rows.every(r => this.rowConditionOk(r));
  }

  private rowConditionOk(row: any): boolean {
    const total = (row.TotalActionPlans ?? this.parseActionPlanLen(row.ActionPlanData));
    return !row.IsActionPlanRequired || total > 0;
  }

  canSubmitByStatus(): boolean {
    const rows = this.dataSource?.data ?? this.SelfAssessmentSummaryList ?? [];
    if (!rows.length) return false;
    const ids = rows.map((r: any) => r.ScheduleInherentRiskStatusID);
    const hasDraft = ids.includes(2);
    const hasNew = ids.includes(1);
    return hasDraft && !hasNew;
  }

  get canShowAdHocRiskbtn(): boolean {
    return this.rcsaSelfAssessmentHeader?.Status === 'In-Progress'
      && this.scheduleAssessmentID != null
      // && !!this.UnitNames
      && this.isRiskManagementUnit;
  }


  /**
   * Returns '#000000' or '#ffffff' depending on which provides better contrast
   * for the provided color (supports hex, shorthand hex, rgb(), rgba(), and named colors).
   */
  getContrastColor(inputColor: string | null | undefined): string {
    const hex = this._toHex(inputColor || '#eee');
    if (!hex) { return '#000000'; } // fallback

    // parse hex to r,g,b
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    // Perceived luminance formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Bright backgrounds -> dark text; dark backgrounds -> light text
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  /**
   * Converts a color string (hex, #abc, rgb(...), rgba(...), or named color) to a 7-char hex string like '#rrggbb'.
   * Returns null if conversion fails.
   */
  private _toHex(color: string | null | undefined): string | null {
    if (!color) { return null; }
    color = color.trim();

    // Already hex (#rrggbb or #rgb)
    if (color[0] === '#') {
      let hex = color.slice(1);
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        return '#' + hex.toLowerCase();
      }
      return null;
    }

    // rgb() or rgba()
    const rgbMatch = color.match(/rgba?\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*([01]?\.?\d*))?\s*\)/i);
    if (rgbMatch) {
      const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1], 10)));
      const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2], 10)));
      const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3], 10)));
      return '#' + this._componentToHex(r) + this._componentToHex(g) + this._componentToHex(b);
    }

    // Named color (like 'black', 'red', etc.) — resolve using canvas or a temporary DOM element.
    try {
      // Use canvas to resolve to a hex-like value (works in browsers)
      const ctx = document.createElement('canvas').getContext && document.createElement('canvas').getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        const resolved = ctx.fillStyle; // normalized to rgb(...) or hex
        // if resolved is rgb(...) let above parse it
        if (resolved.startsWith('rgb')) {
          const m = resolved.match(/rgba?\s*\(\s*(\d+),\s*(\d+),\s*(\d+)/i);
          if (m) {
            return '#' + this._componentToHex(parseInt(m[1], 10))
              + this._componentToHex(parseInt(m[2], 10))
              + this._componentToHex(parseInt(m[3], 10));
          }
        } else if (resolved[0] === '#') {
          // canvas may return e.g. '#rrggbb'
          let hex = resolved.slice(1);
          if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
          if (/^[0-9a-fA-F]{6}$/.test(hex)) {
            return '#' + hex.toLowerCase();
          }
        }
      }
    } catch (e) {
      // ignore and fall through to null
    }

    return null;
  }

  private _componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }




}
