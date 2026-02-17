import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableUtil } from '../rcsa/inherent-risk/tableUtil';
import { KriService } from 'src/app/services/kri/kri.service';


@Component({
  selector: 'app-risk-register',
  templateUrl: './risk-register.component.html',
  styleUrls: ['./risk-register.component.scss']
})
export class RiskRegisterComponent implements OnInit {
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
  statusFilterValue: any = '';
  searchFilterValue: string = '';
  searchHeaderValue : string = '';
  headerName : string = '';
  filteredData: any[] = [];    
  scheduleAssessmentID: number=0 ;
  statusData:any
  riskRegisterData: any;
  totalPercentage: any;
  unitData: any;
  sort: any;
  allData: any;
  unitDataRisk: any;
  yearData :any[] =[]
  quarterData :any [] =[]
  selectedYear :any;
  selectedQuarter :any;
  actionPlanStatusData:any[] =[];
  currentYear: any;
  currentMonth: any;
  currentQuarter: any;
  statusFiltered : boolean = false;
  

  constructor(
    private configScoreRatingService: ConfigScoreRatingService,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private datepipe: DatePipe,
    public kriService: KriService
  ) { }

  ngOnInit(): void {
    this.scheduleAssessmentID = Number(this.activatedRoute.snapshot.params['ScheduleAssessmentID'] ?? 0);  
    this.currentYear = new Date().getFullYear(); 
    this.currentMonth = new Date().getMonth() + 1; 
    this.currentQuarter = Math.ceil(this.currentMonth / 3);
    this.selectedYear = [this.currentYear];
    // this.selectedQuarter = [this.currentQuarter];
    this.updateQuarterData(this.currentYear, this.currentQuarter)
    this.getRiskRegisterData()
  }

  getRiskRegisterData(): void {   
    this.configScoreRatingService.getRiskRegisterData(null, this.selectedYear?.join(","), this.statusFilterValue).subscribe(data => {
      next: {
        if (data.success == 1) {
          // this.statusData         = data.result?.statusData[0]
          this.allData            = data.result?.riskRegisterData
          this.dataSource         = data.result?.riskRegisterData
          this.groupsData         = data.result?.groupData
          this.unitData           = data.result?.unitData
          this.unitDataRisk       = data.result?.unitData
          this.yearData           = data.result?.yearsArray
          // this.quarterData        = data.result?.quarterArray
          this.filteredData       = [...this.allData];
          this.filteredUnitData   = [...this.unitDataRisk];
          this.actionPlanStatusData   = data.result?.actionPlanStatus;

          this.dataSource         = new MatTableDataSource(this.filteredData);
          const result            = data.result?.riskRegisterData.filter((s: any) => s.ScheduleInherentRiskStatusName == "Total");
          this.totalPercentage    = result[0]?.PercentageValue;
          // if(!this.statusFiltered) {
          //   this.statusFilterValue  = this.actionPlanStatusData.filter((status:any) => status.ActionPlanStatusID === 1)[0].ActionPlanStatusID
          // }
          this.applyFilters();

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

    if (this.selectedYear && this.selectedYear.length) {
      this.filteredData = this.filteredData.filter((ele: any) =>  this.selectedYear.includes(ele.ScheduleYear));
    }
  
    if (this.selectedQuarter && this.selectedQuarter.length) {
      this.filteredData = this.filteredData.filter((ele: any) => this.selectedQuarter.includes(ele.QuarterName));
    }

    if(this.statusFilterValue) {
      this.filteredData = this.filteredData.filter((ele: any) => this.statusFilterValue === ele.ActionPlanStatusID);
    }

    if(this.searchHeaderValue) {
      this.filteredData = this.searchBy(this.searchHeaderValue, [this.headerName], this.filteredData);
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

  yearFilter(value: any[]) {
    this.selectedYear = value;  
    this.getRiskRegisterData();
    this.updateQuarterData(this.currentYear, this.currentQuarter)
  }

  updateQuarterData(currentYear: number, currentQuarter: number) {
    if (this.selectedYear.includes(currentYear) && this.selectedYear.length === 1) {
      for (let i = 1; i <= currentQuarter; i++) {
        this.quarterData.push("Quarter "+i);
      }
    } else {
      this.quarterData = ["Quarter 1", "Quarter 2","Quarter 3","Quarter 4"];
    }
    this.quarterData = [...new Set(this.quarterData)]
  } 
  
  quarterFilter(value: any[]) {
    this.selectedQuarter = value;  
    this.applyFilters();
  }

  statusFilter(value:any) {   
    this.statusFiltered = true
    this.statusFilterValue = value;  
    this.getRiskRegisterData();
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

  searchBy(searchInput?: any, searchFields?: any, tableData?: any) {
    let cloneData = JSON.parse(JSON.stringify((tableData || [])));
    if (searchInput?.length > 0) {
      cloneData = cloneData.filter((item: any) => {
        return searchFields.some((field: any) => {
          return ((typeof item[field] == 'number') ? String(item[field]) : item[field] || '').toLowerCase().trim().includes(searchInput.toLowerCase().trim());
        });
      });
    };
    return cloneData;
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
          "Risk Age" : m.RiskAge//,
          //isActive: m.isActive
        });
      });
      this.kriService.exportRCSARiskRegisterAsExcelWithColorCode('rcsaTable', 'RiskRegisterConsolidated', this.dataSource.filteredData);
    }

  }

  searchInHeader(event: Event, field : any) {
    this.headerName  = field
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchHeaderValue = filterValue;
    this.applyFilters();
  }
}
