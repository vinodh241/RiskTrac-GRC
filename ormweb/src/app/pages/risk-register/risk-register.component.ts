import { Component, Inject, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { KriService } from 'src/app/services/kri/kri.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-risk-register',
  templateUrl: './risk-register.component.html',
  styleUrls: ['./risk-register.component.scss']
})
export class RiskRegisterComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'RCSACode', 'SLNO', 'GroupName', 'UnitName', 'SchedulePeriod',
    'OverallInherentRiskRating', 'OverallControlEnvironmentRiskRating', 'ResidualRiskRating',
    'ScheduleInherentRiskStatusName', 'riskAge'
  ];
  dataSource!: MatTableDataSource<any>;
  groupsData: any[] = [];
  filteredUnitData: any[] = [];
  groupFilterValue: any = '';
  unitFilterValue: any = '';
  statusFilterValue: any = '';
  searchFilterValue: string = '';
  filteredData: any[] = [];
  allData: any[] = [];
  yearData: any[] = [];
  quarterData: any[] = [];
  selectedYear: any[] = [];
  selectedQuarter: any[] = [];
  currentYear = new Date().getFullYear();
  currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
  // summary selection
  public selectedRisk: any = null;
  // Angular Material paginator & sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // template ref for dialog
  @ViewChild('summaryDialog') summaryDialog!: TemplateRef<any>;
  lastApiResult: any = null;

  constructor(
    private configScoreRatingService: ConfigScoreRatingService,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    private activatedRoute: ActivatedRoute,
    public kriService: KriService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.selectedYear = [this.currentYear];
    this.updateQuarterData(this.currentYear, this.currentQuarter);
    this.getRiskRegisterData();
  }

  ngAfterViewInit(): void {

  }

  getRiskRegisterData(): void {
    this.configScoreRatingService.getRiskRegisterData(null, this.selectedYear?.join(","), this.statusFilterValue)
      .subscribe((data: any) => {
        if (data?.success === 1) {
          this.lastApiResult = data.result;
          this.allData = data.result?.riskRegisterData || [];
          this.groupsData = data.result?.groupData || [];
          this.filteredUnitData = data.result?.unitData || [];
          this.yearData = data.result?.yearsArray || [];
          this.allData = (this.allData || []).map((row: any) => {
            row._parsedControls = this.safeParseArray(row.ControlData ?? row.ControlDataJson ?? row.ControlDataString);
            row._parsedActionPlans = this.safeParseArray(row.ActionPlanData ?? row.ActionPlanDataJson ?? row.ActionPlans);
            row._postRiskTreatment = this.buildPostTreatmentObject(row);
            row.RiskOwner = row.ResidualRiskResponsiblePersonName ?? row.ActionResponsiblePersonName ?? row.ResidualRiskResponsiblePersonName;
            row.Controls = this.formatControls(row.ControlData ?? row.ControlDataJson ?? null);
            row.ActionPlans = this.formatActionPlans(row.ActionPlanData ?? row.ActionPlanDataJson ?? null);
            row.PostRiskTreatment = this.formatPostRiskTreatment(row);
            return row;
          });

          this.filteredData = [...this.allData];
          this.dataSource = new MatTableDataSource(this.filteredData);
          // attach paginator and sort if available
          setTimeout(() => {
            if (this.paginator) this.dataSource.paginator = this.paginator;
            if (this.sort) this.dataSource.sort = this.sort;
          });
          this.applyFilters();
        } else {
          if (data?.error?.errorCode === "TOKEN_EXPIRED") {
            this.utils.relogin(this._document);
          }
        }
      });
  }

  // ---------- parsers & formatters ----------
  private safeParseArray(input: any): any[] {
    if (input == null || input === '' || typeof input === 'undefined') return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
      } catch (e) {
        return [];
      }
    }
    if (typeof input === 'object') return [input];
    return [];
  }

  private formatControls(controlInput: any): string {
    const arr = this.safeParseArray(controlInput);
    return arr.map((c: any) => {
      const code = (c?.ControlCode ?? c?.ControlCodeName ?? c?.ControlId ?? '') + '';
      const desc = (c?.ControlDescription ?? c?.Description ?? '') + '';
      const type = (c?.ControlType ?? c?.ControlTypeName ?? '') + '';
      return `Code: ${code}${desc ? ' , Desc: ' + desc : ''}${type ? ' , Type: ' + type : ''}`;
    }).join(' || ');
  }

  private formatActionPlans(actionInput: any): string {
    const arr = this.safeParseArray(actionInput);
    return arr.map((a: any) => {
      const id = a?.ScheduleActionPlanID ?? '';
      const identifiedAction = a?.IdentifiedAction ?? a?.IdentifiedActionTitle ?? '';
      const controlType = a?.ControlType ?? '';
      const timelineSource = a?.Timeline ?? a?.TimelineDate ?? null;
      const timeline = timelineSource ? this.datePipe.transform(timelineSource, 'dd-MM-yyyy') : '';
      const status = a?.ActionPlanStatusName ?? a?.ActionPlanStatus ?? '';
      const owner = a?.ActionResponsiblePersonName ?? a?.ActionResponsible ?? '';
      const verification = a?.ControlVerificationClosureName ?? '';
      const totalCost = a?.TotalCost ?? '';
      const totalBenefit = a?.TotalBenefit ?? '';
      const totalNetBenefit = a?.TotalNetBenefit ?? '';
      const totalPresentValueCost = a?.TotalPresentValueCost ?? '';
      const totalPresentValueBenefit = a?.TotalPresentValueBenefit ?? '';
      const benefitCostRatio = a?.BenefitCostRatio ?? '';
      const comments = a?.ActionPlanComments ?? '';
      return [`ID: ${id}`, `Identified Action: ${identifiedAction}`, `controlType: ${controlType}`, `Timeline: ${timeline}`, `status: ${status}`, `Responsible Person: ${owner}`,
      `Confirmation/Verification of Closure: ${verification}`, `Total Cost: ${totalCost}`, `Total Benefit: ${totalBenefit}`, `Total Net Benefit: ${totalNetBenefit}`,
      `PV Cost: ${totalPresentValueCost}`, `PV Benefit: ${totalPresentValueBenefit}`, `BCR: ${benefitCostRatio}`, `comments: ${comments}`].join(' , ');
    }).join(' || ');
  }


  private buildPostTreatmentObject(row: any) {
    const obj: any = {
      Description: row.PostTreatmentDescription ?? row.PostTreatmentDescription,
      ControlInPaceName: row.PostTreatmentControlInPaceName ?? row.PostTreatmentControlInPace,
      ControlAutomationName: row.PostTreatmentControlAutomationName ?? row.PostTreatmentControlAutomationName,
      ControlNatureName: row.PostTreatmentControlNatureName ?? row.PostTreatmentControlNatureName,
      ControlFrequencyName: row.PostTreatmentControlFrequencyName ?? row.PostTreatmentControlFrequencyName,
      ControlEnvironmentRiskRating: row.PostTreatmentControlEnvironmentRiskRating ?? row.PostTreatmentControlEnvironmentRiskRating,
      ResidualRiskRatingColourCode: row.ResidualRiskRatingColourCode ?? row.ResidualRiskRatingColourCode,
      ResidualRiskRating: row.PostTreatmentResidualRiskRating ?? row.PostTreatmentResidualRiskRating
    };
    Object.keys(obj).forEach(k => { if (obj[k] === null || typeof obj[k] === 'undefined') delete obj[k]; });
    return Object.keys(obj).length ? [obj] : [];
  }

  private formatPostRiskTreatment(row: any): string {
    if (!row) return '';
    const parts: string[] = [];
    if (row.PostTreatmentDescription) parts.push(`Description: ${row.PostTreatmentDescription}`);
    if (row.PostTreatmentControlInPaceName) parts.push(`ControlInPace: ${row.PostTreatmentControlInPaceName}`);
    if (row.PostTreatmentControlAutomationName) parts.push(`Automation: ${row.PostTreatmentControlAutomationName}`);
    if (row.PostTreatmentControlNatureName) parts.push(`Nature: ${row.PostTreatmentControlNatureName}`);
    if (row.PostTreatmentControlFrequencyName) parts.push(`Frequency: ${row.PostTreatmentControlFrequencyName}`);
    if (row.PostTreatmentControlEnvironmentRiskRating) parts.push(`ControlRating: ${row.PostTreatmentControlEnvironmentRiskRating}`);
    if (row.PostTreatmentResidualRiskRating) parts.push(`Residual: ${row.PostTreatmentResidualRiskRating}`);
    return parts.join(' || ');
  }

  // ---------- filters ----------
  applyFilters() {
    let data = [...(this.allData || [])];
    if (this.groupFilterValue) data = data.filter(d => d.GroupID == this.groupFilterValue);
    if (this.unitFilterValue) data = data.filter(d => d.UnitID == this.unitFilterValue);
    if (this.selectedYear && this.selectedYear.length) data = data.filter(d => this.selectedYear.includes(d.ScheduleYear));
    if (this.selectedQuarter && this.selectedQuarter.length) data = data.filter(d => this.selectedQuarter.includes(d.QuarterName || d.Quarter));
    if (this.searchFilterValue) {
      const q = this.searchFilterValue.toLowerCase();
      data = data.filter(item => (
        (item.Risk || '').toString().toLowerCase().includes(q)
        || (item.RCSACode || '').toString().toLowerCase().includes(q)
        || (item.SLNO || '').toString().toLowerCase().includes(q)
      ));
    }
    this.filteredData = data;
    if (!this.dataSource) this.dataSource = new MatTableDataSource(this.filteredData);
    else this.dataSource.data = this.filteredData;
    // reattach paginator & sort after filtering
    setTimeout(() => {
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    });
  }

  get filteredCount(): number {
    // number of currently visible inherent risks
    return this.dataSource?.filteredData?.length ?? 0;
  }

  groupFilter(value: any) {
    this.groupFilterValue = value;
    if (this.groupFilterValue) {
      this.filteredUnitData = (this.filteredUnitData || []).filter((u: any) => u.GroupID == this.groupFilterValue);
    }
    this.unitFilterValue = '';
    this.applyFilters();
  }

  unitFilter(value: any) {
    this.unitFilterValue = value;
    this.applyFilters();
  }

  yearFilter(value: any[]) {
    this.selectedYear = value;
    this.getRiskRegisterData();
    this.updateQuarterData(this.currentYear, this.currentQuarter);
  }

  quarterFilter(value: any[]) {
    this.selectedQuarter = value;
    this.applyFilters();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchFilterValue = filterValue;
    this.applyFilters();
  }

  updateQuarterData(currentYear: number, currentQuarter: number) {
    if (this.selectedYear?.length === 1 && this.selectedYear.includes(currentYear)) {
      this.quarterData = [];
      for (let i = 1; i <= currentQuarter; i++) this.quarterData.push(`Quarter ${i}`);
    } else {
      this.quarterData = ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];
    }
  }

  // ---------- summary dialog ----------
  openSummary(row: any) {
    this.selectedRisk = row;
    this.selectedRisk._parsedControls = this.selectedRisk._parsedControls ?? this.safeParseArray(this.selectedRisk.ControlData);
    this.selectedRisk._parsedActionPlans = this.selectedRisk._parsedActionPlans ?? this.safeParseArray(this.selectedRisk.ActionPlanData);
    this.selectedRisk._postRiskTreatment = this.selectedRisk._postRiskTreatment ?? this.buildPostTreatmentObject(this.selectedRisk);
    // dialog sizing: full screen on small devices
    const isSmall = (window.innerWidth || screen.width) < 700;
    const config: any = {
      data: this.selectedRisk,
      width: isSmall ? '100vw' : '95vw',
      maxWidth: isSmall ? '100vw' : '94%',
      height: isSmall ? '100vh' : '90vh',
      panelClass: isSmall ? 'full-screen-dialog' : 'large-dialog'
    };
    this.dialog.open(this.summaryDialog, config);
  }

  closeSummaryDialog() {
    this.dialog.closeAll();
    this.selectedRisk = null;
  }

  exportAsXLSX() {
    const columnsdata: any[] = [];
    const ColumnColorsdata: any[] = [];
    const source = this.lastApiResult?.riskRegisterData ?? [];
    if (!Array.isArray(source) || source.length === 0) {
      return;
    }
    source.forEach((m: any) => {
      const controls = this.formatControls(m.ControlData ?? m.ControlDataJson ?? m.Controls ?? m.ControlsData ?? null);
      const actionPlans = this.formatActionPlans(m.ActionPlanData ?? m.ActionPlanDataJson ?? m.ActionPlans ?? null);
      const postRisk = this.formatPostRiskTreatment(m);
      const riskAgeVal = m.RiskAge ?? m.riskAge ?? m.Risk_Age ?? '';
      ColumnColorsdata.push({
        "RCSA Code": m.RCSACode ?? '',
        "Overall Inherent Risk Rating": m.OverallInherentRiskRating ?? '',
        "OverallInherentRiskColor": m.OverallInherentRiskColor ?? '#eee',
        "Overall Control Environment Risk Rating": m.OverallControlEnvironmentRiskRating ?? '',
        "OverallControlEnvironmentRatingColourCode": m.OverallControlEnvironmentRatingColourCode ?? '#ddd',
        "Residual Risk Rating": m.ResidualRiskRating ?? '',
        "ResidualRiskRatingColourCode": m.ResidualRiskRatingColourCode ?? '#ddd',
      })
      columnsdata.push({
        "Risk Code": m.RCSACode ?? '',
        "Group": m.GroupName ?? m.Group ?? '',
        "Unit": m.UnitName ?? m.Unit ?? '',
        "Period": m.SchedulePeriod ?? m.SchedulePeriodName ?? '',
        "Status": m.ScheduleInherentRiskStatusName ?? m.ScheduleInherentRiskStatus ?? '',
        "Risk Category": m.RiskCategoryName ?? m.RiskCategory ?? '',
        "Process": m.ProcessName ?? m.Process ?? '',
        "Risk": m.Risk ?? '',
        "Likelihood Rating": m.InherentLikelihoodName ?? m.LikelihoodName ?? '',
        "Impact Rating": m.InherentImpactRatingName ?? m.ImpactRatingName ?? '',
        "Overall Inherent Risk Rating": m.OverallInherentRiskRating ?? '',
        "Controls": controls ?? '',
        "Control In Place": m.ControlInPaceName ?? m.ControlInPace ?? m.ControlInPlace ?? '',
        "Control Nature": m.ControlNatureName ?? m.ControlNature ?? '',
        "Control Automation": m.ControlAutomationName ?? m.ControlAutomation ?? '',
        "Control Frequency": m.ControlFrequencyName ?? m.ControlFrequency ?? '',
        "Overall Control Environment Risk Rating": m.OverallControlEnvironmentRiskRating ?? '',
        "Residual Risk Rating": m.ResidualRiskRating ?? '',
        "Residual Risk Response": m.ResidualRiskResponseName ?? m.ResidualRiskResponse ?? '',
        "Residual Risk Responsible Person": m.ResidualRiskResponsiblePersonName ?? m.ResidualRiskResponsiblePerson ?? '',
        "Action Plans": actionPlans ?? '',
        "Post Risk Treatment": postRisk ?? '',
        // "Confirmation/Verification of Closure": m.ControlVerificationClosureName ?? m.ControlVerificationClosure ?? '',
        "Control Testing Result": m.ControlTestingResultName ?? m.ControlTestingResult ?? '',
        "Control Testing Result Comment": m.ControlTestingResultComment ?? '',
        "Comment": m.SelfComment ?? m.Comment ?? '',
        "Reviewer Comment": m.ReviewerComment ?? '',
        "Risk Age": riskAgeVal
      });
    });
    this.exportToExcel(columnsdata, ColumnColorsdata, 'RiskRegisterConsolidated');
  }

  exportToExcel(columnsdata: any[], ColumnColorsdata: any[], fileName: string) {
    if (!Array.isArray(columnsdata) || columnsdata.length === 0) {
      console.warn('columnsdata is empty or not an array.');
      return;
    }
    // Build headers from first object (keeps insertion order of keys as declared)
    const headers = Object.keys(columnsdata[0]);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');
    // Add header row
    worksheet.addRow(headers);
    // Style header row (row 1)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      // Background color #E7E7E7 → ARGB FFE7E7E7
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7E7E7' }
      };

      // Bold black text
      cell.font = {
        bold: true,
        color: { argb: 'FF000000' },
        size: 12
      };

      // Add BORDER to avoid "merged cell look"
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFB0B0B0' } },
        left: { style: 'thin', color: { argb: 'FFB0B0B0' } },
        bottom: { style: 'thin', color: { argb: 'FFB0B0B0' } },
        right: { style: 'thin', color: { argb: 'FFB0B0B0' } }
      };

      // Center vertically/horizontally
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    headerRow.height = 22;
    headerRow.commit();

    // Add data rows - ensure same column count per row (fill missing with '')
    for (const rowObj of columnsdata) {
      const rowArray = headers.map(h => rowObj[h] ?? '');
      worksheet.addRow(rowArray);
    }
    // Build a quick lookup map from ColumnColorsdata by RCSA Code for fast access
    const colorMap = new Map<string, any>();
    for (const c of ColumnColorsdata || []) {
      const key = (c['RCSA Code'] ?? '').toString();
      if (key) colorMap.set(key, c);
    }
    // Find column indices (1-based) for the three columns we want to fill using their header text.
    // Make sure these match the exact header names in your columnsdata keys.
    const findColIndex = (headerName: string) => {
      const idx = headers.findIndex(h => h.trim() === headerName);
      return idx >= 0 ? idx + 1 : -1;
    };
    const overallInherentCol = findColIndex('Overall Inherent Risk Rating');
    const overallControlEnvCol = findColIndex('Overall Control Environment Risk Rating');
    const residualRiskCol = findColIndex('Residual Risk Rating');
    // Helper: convert '#RRGGBB' or 'RRGGBB' to 'AARRGGBB' (ExcelJS expects ARGB)
    const toARGB = (hex?: string) => {
      if (!hex) return undefined;
      let h = (hex + '').trim();
      if (h.startsWith('#')) h = h.slice(1);
      if (h.length === 3) h = h.split('').map(ch => ch + ch).join(''); // expand short hex
      if (h.length !== 6) return undefined;
      return 'FF' + h.toUpperCase();
    };
    // Color rows by matching RCSA Code column value in the worksheet with ColumnColorsdata
    // Worksheet data rows start at row 2 (row 1 is header)
    for (let r = 0; r < columnsdata.length; r++) {
      const excelRowNumber = r + 2;
      const row = worksheet.getRow(excelRowNumber);
      // Determine RCSA Code value for this data row
      const rcsaVal = (columnsdata[r]['RCSA Code'] ?? '').toString();
      const colorEntry = colorMap.get(rcsaVal);
      // use colorEntry fields if present
      if (colorEntry) {
        // Overall Inherent Risk Rating column
        if (overallInherentCol > 0) {
          const colorHex = toARGB(colorEntry.OverallInherentRiskColor ?? colorEntry.OverallInherentRiskColour ?? colorEntry.OverallInherentRiskColourCode);
          if (colorHex) {
            const cell = row.getCell(overallInherentCol);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: colorHex },
            };
          }
        }
        // Overall Control Environment Risk Rating column
        if (overallControlEnvCol > 0) {
          const colorHex = toARGB(colorEntry.OverallControlEnvironmentRatingColourCode ?? colorEntry.OverallControlEnvironmentColour ?? colorEntry.OverallControlEnvironmentRatingColour);
          if (colorHex) {
            const cell = row.getCell(overallControlEnvCol);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: colorHex },
            };
          }
        }
        // Residual Risk Rating column
        if (residualRiskCol > 0) {
          const colorHex = toARGB(colorEntry.ResidualRiskRatingColourCode ?? colorEntry.ResidualRiskColour ?? colorEntry.ResidualRiskRatingColour);
          if (colorHex) {
            const cell = row.getCell(residualRiskCol);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: colorHex },
            };
          }
        }
      }
      row.commit();
    }

    worksheet.columns.forEach((col, idx) => {
      const colValues = col.values ?? [];
      const maxLength = Math.max(
        ...colValues
          .filter(v => v !== null && v !== undefined)
          .map(v => String(v).length),
        10
      );
      col.width = Math.min(Math.max(maxLength, 10), 50);
    });
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  getContrastColor(hex: string): string {
    // Remove hash (#) if present
    hex = hex.replace('#', '');

    // Convert shorthand colors (#000 -> #000000)
    if (hex.length === 3) {
      hex = hex.split('').map(x => x + x).join('');
    }

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate brightness (perceived luminance)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return white text for dark backgrounds, black text for light backgrounds
    return brightness > 128 ? '#000000' : '#ffffff';
  }


}