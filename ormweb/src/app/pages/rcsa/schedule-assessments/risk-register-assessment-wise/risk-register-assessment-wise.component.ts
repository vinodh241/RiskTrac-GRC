
import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableUtil } from '../../inherent-risk/tableUtil';
import { KriService } from 'src/app/services/kri/kri.service';
// import { TableUtil } from '../rcsa/inherent-risk/tableUtil';


@Component({
  selector: 'app-risk-register-assessment-wise',
  templateUrl: './risk-register-assessment-wise.component.html',
  styleUrls: ['./risk-register-assessment-wise.component.scss']
})
export class RiskRegisterAssessmentWiseComponent implements OnInit {

  displayedColumns: string[] = [
    'RCSACode',
    'SLNO',
    'Group',
    'Unit',
    'SchedulePeriod',
    'ScheduleInherentRiskStatusName',
    'RiskCategoryName',
    'ProcessName',
    'Risk',
    'InherentLikelihoodName',
    'InherentImpactRatingName',
    'OverallInherentRiskRating',
    'ControlDescription',
    'ControlInPaceName',
    'ControlTypeName',
    'ControlNatureName',
    'ControlAutomationName',
    'ControlFrequencyName',
    'OverallControlEnvironmentRiskRating',
    'ResidualRiskRating',
    'ResidualRiskResponseName',
    'ResidualRiskResponsiblePersonName',
    'IdentifiedAction',
    'ActionResponsiblePersonName',
    'Timeline',
    'ActionPlanStatusName',
    'ActionPlanComments',
    'ControlVerificationClosureName',
    'ControlTestingResultName',
    'ControlTestingResultComment',
    'SelfComment',
    'ReviewerComment',
    'RiskAge'
  ];
  dataSource!: MatTableDataSource<any>;
  groupsData :any [] =[];
  filteredUnitData : any[] =[];
  groupFilterValue: string = '';
  unitFilterValue: string = '';
  statusFilterValue: string = '';
  searchFilterValue: string = '';
  filteredData: any[] = [];    
  scheduleAssessmentID: number=0 ;
  statusData:any
  riskRegisterData: any;
  totalPercentage: any;
  unitData: any;
  sort: any;
  paginator: any;
  allData: any;
  unitDataRisk: any;
  yearData :any[] =[]
  quarterData :any [] =[]
  selectedYear :any;
  selectedQuarter :any;
  actionPlanStatusData:any[] =[];
  
  constructor(
    private configScoreRatingService: ConfigScoreRatingService,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private datepipe: DatePipe,
    private kriService : KriService
  ) { }

  ngOnInit(): void {
    this.scheduleAssessmentID = Number(this.activatedRoute.snapshot.params['ScheduleAssessmentID'] ?? 0);   
    this.getRiskRegisterData()
  }

  getRiskRegisterData(): void {
    
    this.configScoreRatingService.getRiskRegisterData(this.scheduleAssessmentID, null, null).subscribe(data => {
      next: {
        if (data.success == 1) {
          this.statusData         = data.result?.statusData[0]
          this.allData            = data.result?.riskRegisterData
          this.dataSource         = data.result?.riskRegisterData
          this.groupsData         = data.result?.groupData
          this.unitData           = data.result?.unitData
          this.unitDataRisk       = data.result?.unitData
          this.yearData           = data.result?.yearsArray
          this.quarterData        = data.result?.quarterArray
          this.filteredData       = [...this.allData];
          this.filteredUnitData   = [...this.unitDataRisk];
          this.actionPlanStatusData   = data.result?.actionPlanStatus;

          this.dataSource         = new MatTableDataSource(this.filteredData);
          const result            = data.result?.riskRegisterData.filter((s: any) => s.ScheduleInherentRiskStatusName == "Total");
          this.totalPercentage    = result[0]?.PercentageValue;
        } else {
          if (data.error.errorCode == "TOKEN_EXPIRED") {
            this.utils.relogin(this._document);          
          }
        }
      }
    });    
  }

  applyFilters() {
    this.filteredData = this.allData;

    if (this.groupFilterValue) {
      this.filteredData = this.filteredData.filter((ele: any) => ele.GroupID == this.groupFilterValue);
    }

    if (this.unitFilterValue) {
      this.filteredData = this.filteredData.filter((ele: any) => ele.UnitID == this.unitFilterValue);
    }

    if (this.searchFilterValue) {
      const searchFields = this.displayedColumns;
      this.filteredData = this.searchBy(this.searchFilterValue, searchFields, this.filteredData);
    }

    if (this.selectedYear) {
      this.filteredData = this.filteredData.filter((ele: any) => ele.year == this.selectedYear);
    }
  
    if (this.selectedQuarter) {
      this.filteredData = this.filteredData.filter((ele: any) => ele.quarter == this.selectedQuarter);
    }

    if(this.statusFilterValue) {
      this.filteredData = this.filteredData.filter((ele: any) => this.statusFilterValue === ele.ActionPlanStatusID);
    }

    this.dataSource = new MatTableDataSource(this.filteredData);
  }

  groupFilter(value: any) {
    this.groupFilterValue = value;
    if (this.groupFilterValue) {
      this.filteredUnitData = this.unitDataRisk.filter((unit: any) => unit.GroupID == this.groupFilterValue);
    } else {
      this.filteredUnitData = [...this.unitDataRisk];
    }

    this.unitFilterValue = '';
    this.applyFilters();
  }

  unitFilter(value: any) {
    this.unitFilterValue = value;
    this.applyFilters();
  }

  statusFilter(value:any) {
    this.statusFilterValue = value;
    this.applyFilters();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchFilterValue = filterValue;
    this.applyFilters();
  }

  addIndex(docs?: any, addEditMode?: any) {
    let Index = 1;
    (docs || []).forEach((data: any) => {
      data.Index = Index;
      if (addEditMode) {
        data.isEdit = false;
      }
      Index++;
    });
    return docs;
  }

  searchBy(searchInput?: any, searchFields?: any, tableData?: any, filterColumn?: any, filterColumnIds?: any, headerFilterColumns?: any, enteredColumnText?: any) {
    let cloneData = JSON.parse(JSON.stringify((tableData || [])));

    if (searchInput?.length > 0) {
      cloneData = cloneData.filter((item: any) => {
        return searchFields.some((field: any) => {
          return ((typeof item[field] == 'number') ? String(item[field]) : item[field] || '').toLowerCase().trim().includes(searchInput.toLowerCase().trim());
        });
      });
    };

    if (filterColumnIds?.length > 0) {
      cloneData = cloneData.filter((row: any) => {
        return filterColumn.some((col: any) => {
          return filterColumnIds.includes(row[col]);
        });
      });
    };

    if (headerFilterColumns && headerFilterColumns?.length > 0) {
      headerFilterColumns.forEach((x: any) => {
        if (enteredColumnText[x] !== '') {
          cloneData = cloneData.filter((row: any) => {
            return ((typeof row[x] == 'number') ? String(row[x]) : row[x] || '').toLowerCase().trim().includes(enteredColumnText[x].toLowerCase().trim());
          });
        };
      });
    };

    return cloneData;
  }

  yearFilter(value: any) {
    this.selectedYear = value;  
    this.applyFilters();
  }
  
  quarterFilter(value: any) {
    this.selectedQuarter = value;  
    this.applyFilters();
  }
  navigateToPreviousPage() {
    this.router.navigateByUrl('schedule-assessments')
  }

  exportAsXLSX() {
    let obj: any = [];
    if (this.dataSource.filteredData.length > 0) {
      this.dataSource.filteredData.forEach((m: any) => {
        obj.push({
          "RCSA Code": m.RCSACode,
          SLNO: m.SLNO,
          Group: m.GroupName,
          Unit: m.UnitName,
          Period: m.SchedulePeriod,
          Status: m.ScheduleInherentRiskStatusName,
          "Risk Category": m.RiskCategoryName,
          Process: m.ProcessName,
          Risk: m.Risk,
          "Likelihood Rating": m.InherentLikelihoodName,
          "Impact Rating": m.InherentImpactRatingName,
          //OverallInherentRisk: m.OverallInherentRiskID,
          "Overall Inherent Risk Rating": m.OverallInherentRiskRating,         
          "Control Description": m.ControlDescription,
          "Control In Pace": m.ControlInPaceName,
          "Control Type": m.ControlTypeName,
          "Control Nature": m.ControlNatureName,
          "Control Automation": m.ControlAutomationName,
          "Control Frequency": m.ControlFrequencyName,
          "Overall Control Environment Risk Rating" : m.OverallControlEnvironmentRiskRating,
          "Residual Risk Rating": m.ResidualRiskRating,
          "Residual Risk Response": m.ResidualRiskResponseName,
          "Residual Risk Responsible Person": m.ResidualRiskResponsiblePersonName,
          "Identified Action": m.IdentifiedAction,
          "Action Responsible Person": m.ActionResponsiblePersonName,
          Timeline: m.Timeline != null ? this.datepipe.transform(new Date(m.Timeline), 'dd MMM yyyy') : '',
          "Action Plan Status": m.ActionPlanStatusName,
          "Action Plan Comments": m.ActionPlanComments,
          "Confirmation/Verification of Closure": m.ControlVerificationClosureName,
          "Control Testing Result": m.ControlTestingResultName,
          "Control Testing Result Comment": m.ControlTestingResultComment,
          Comment: m.SelfComment,
          "Reviewer Comment" : m.ReviewerComment,
          "Risk Age" : m.RiskAge
        });
      });
      this.kriService.exportRCSARiskRegisterAsExcelWithColorCode('rcsaTable', 'RiskRegisterConsolidated', this.dataSource.filteredData);
    }

  }
}
