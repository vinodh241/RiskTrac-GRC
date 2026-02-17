import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatTableDataSource } from '@angular/material/table';
import { TitleStrategy } from '@angular/router';
import { KriService } from 'src/app/services/kri/kri.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'DD MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMM YYYY',
    },
};
@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ReportsComponent implements OnInit {
    displayedColumns: string[] = [
        'SNo', 'incidentCode', 'incidentTitle', 'reportingDate', 'incidentDate', 'incidentType', 'incidentUnit', 'criticality',
        'incidentStatus', 'recommendations', 'open', 'claimedClosed', 'closed'
    ];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    incidents: any;
    modules: any;
    tableData: any;
    selectedModule: any;
    incidentValues: any;
    assessmentUnits: any;
    assessmentStatus: any;
    minStartDate: any;
    maxEndDate: any;
    startDate: any;
    endDate: any;
    openCount: number = 0;
    closedCount: number = 0;
    claimClosedCount: number = 0;
    selectedCriticality: any = 'All';
    selectedAssesmentUnits: any = 'All';
    selectedIncidentStatus: any = 'All';
    selectedUnit: any = 'All';
    selectedStartDate: any;
    selectedEndDate: any;
    selectedStatus: any = 'All';
    selectedUnits: any = 'All';
    selectedMeasureFreq: any = 'All';
    selectedKriType: any = 'All';
    selectedKriValue: any = 'All';
    selectedKriStatus: any = 'All';
    selectedRCSUnit: any = 'All';
    selectedRCSStatus: any = 'All';
    selectedRCSScheduleInherentRiskStatusName = 'All';
    selectedInherentRating: any = 'All';
    selectedResidualRating: any = 'All';
    KRIValues: any;
    RCSValues: any;
    year: any = '';
    date: any = '';
    quarter: any = '';
    presentQuater: any;
    yearsList: any = [];
    quartersList: any = [];
    yearFilter: any;
    quarterFilter: any;
    incidentUnitData: any = [];
    raUnitData: any;
    rcsaUnitData: any;
    selectedYear: any;
    selectedQuarter: any;
    incidentUnit: any = [];
    raUnit: any= [];
    rcsaUnit: any= [];

    constructor(private service: ReportsService, public kriService: KriService, private datePipe: DatePipe
    ) {
        service.incidentValues.subscribe(res => {
            this.incidentValues = res;
            this.upDateFilters();
        })
        service.assessmentValues.subscribe(res => {
            this.upDateFilters();
        })
        service.KRIValues.subscribe(res => {
            this.KRIValues = res;
            this.upDateFilters();
        })
        service.RCSValues.subscribe(res => {
            this.RCSValues = res;
            this.upDateFilters();
        })
    }


    ngOnInit(): void {
        this.getQuarter(new Date());
        this.getModules();
        this.selectedModule = 'Incidents';
        this.getSelectedStartDate();
        this.getRAUnits();
        this.getIncidentUnit();
        this.getRaDynamicUinit();
        this.getRcsaUnit();

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        for (var i = 0; i < 7; i++) {
            this.yearsList.push(currentYear - i);
        }

    }

    getIncidentUnit() {       
        this.service.gotIncidents.subscribe((res: any) => {
            next:
            if(res == true) {
                this.incidentUnit = this.service.incidents.IncidentData;
            }
        })
    }

    getRaDynamicUinit() {
        console.log("inside ra");
        this.service.gotRA.subscribe((res: any) => {
            next:
            if(res == true) {
                this.raUnit = this.service.RAResults;
            }
        })
    }

    getRcsaUnit() {
        this.service.gotRCSA.subscribe((res: any) => {
            next:
            if(res == true) {
                this.rcsaUnit = this.service.RCSAResults;
            }
        })
    }


    getRAUnits() {
        this.assessmentUnits = [
            'Cyber Security',
            'Retail Credit',
            'Corporate Credit',
            'Collections',
            'Risk Management',
            'Information Technology',
            'Credit Administration & Control',
            'Operations',
            'Customer Care',
            'Compliance',
            'Governance',
            'Legal',
            'Accounting & Tax',
            'Financial Reporting',
            'Treasury',
            'Business Development & Marketing',
            'Strategy',
            'Human Resources',
            'Administration and Procurement',
            'Retail Group',
            'Corporate Group',
            'Internal Audit',
            'Remedial',
            'Credit-ALCO',
            'Credit',
            'Credit-ECL',
            'Credit-Prudential Returns'
        ];
        this.assessmentStatus = [
            'Approved',
            'Rejected',
            'Reviewed',
            'Not Started',
            'Submitted',
            'In Progress'
        ]
    }

    getFiltered():any{
        let Qutr = 'Q'+this.selectedQuarter+'-'+this.selectedYear.toString().substr(2, 2); 
        let period = 'Quarter '+this.selectedQuarter+ ", " +this.selectedYear.toString(); 
        if(this.incidentUnit.length) {
            let filteredINC = this.incidentUnit.filter((itr:any)=>itr.Quarter == Qutr);
            this.incidentUnitData = [...new Set(filteredINC.map((itr:any) => itr.IncidentUnitName))];    
        }          
        if(this.raUnit.length) {
            let filteredRA = this.raUnit.filter((itr:any)=>itr.Quater == Qutr);
            this.raUnitData  = [...new Set(filteredRA.map((itr:any) => itr.UnitName))];
        }
        if(this.rcsaUnit.length) {
            let filteredRA = this.rcsaUnit.filter((itr:any)=>itr.SchedulePeriod == period);
            this.rcsaUnitData  = [...new Set(filteredRA.map((itr:any) => itr.Unit))];
        }

    }  


    upDateFilters() {
        this.selectedCriticality = 'All';
        this.selectedAssesmentUnits = 'All';
        this.selectedIncidentStatus = 'All';
        this.selectedUnit = 'All';
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.selectedStatus = 'All';
        this.selectedUnits = 'All';
        this.selectedMeasureFreq = 'All';
        this.selectedKriType = 'All';
        this.selectedKriValue = 'All';
        this.selectedKriStatus = 'All';
        this.selectedRCSScheduleInherentRiskStatusName = 'All';
        this.selectedRCSUnit = 'All';
        this.selectedRCSStatus = 'All';
        this.selectedInherentRating = 'All';
        this.selectedResidualRating = 'All';
        this.yearFilter = new Date().getFullYear();
        this.checkYear(this.yearFilter);
    }
    getModules() {
        this.modules = ['Incidents', 'KRI', 'Risk Appetite', 'RCSA'];
    }
    getStatusCounts() {
        this.claimClosedCount = 0;
        this.closedCount = 0;
        this.openCount = 0;
        this.incidents.map((i: string | number) => {
            this.tableData[i].forEach((i: { ClaimClosed: number; Closed: number; OpenIncidents: number; }) => {
                this.claimClosedCount = this.claimClosedCount + i.ClaimClosed;
                this.closedCount = this.closedCount + i.Closed;
                this.openCount = this.openCount + i.OpenIncidents;
            })
        })
    }
    generateExcel() {
        this.kriService.exportAsExcelFile(this.dataSource.data, 'reportFIle');
    }
    clearDates() {
        this.startDate = null;
        this.endDate = null;
    }
    getQuarter(date: Date) {
        date = date || new Date();
        var month = Math.floor(date.getMonth() / 3) + 1;
        month -= month > 4 ? 4 : 0;
        this.year = date.getFullYear() //+ (month == 1 ? 1 : 0) + "";
        switch (month) {
            case 1:
                this.date = "Jan " + this.year;
                this.presentQuater = 1;
                this.quarter = "Jan " + this.year + " - Mar " + + this.year

                break;
            case 2:
                this.date = "Apr " + this.year;
                this.presentQuater = 2;
                this.quarter = "Apr " + this.year + " - Jun " + + this.year

                break;
            case 3:
                this.date = "Jul " + this.year;
                this.presentQuater = 3;
                this.quarter = "Jul " + this.year + " - Sep " + + this.year

                break;
            case 4:
                this.date = "Oct " + this.year;
                this.presentQuater = 4;
                this.quarter = "Oct " + this.year + " - Dec " + + this.year

                break;
            default:
                break;
        }
        this.yearFilter = Number(this.year);
        this.checkYear(this.yearFilter);
        this.selectedStartDate = this.minStartDate;
    }
    checkYear(yearValue: any) {
        this.selectedYear = yearValue;
        if (this.year == yearValue) {
            if (this.presentQuater == 1) {
                this.quartersList = [1];
                this.quarterFilter = 1;
            } else if (this.presentQuater == 2) {
                this.quartersList = [1, 2];
                this.quarterFilter = 2;
            } else if (this.presentQuater == 3) {
                this.quartersList = [1, 2, 3];
                this.quarterFilter = 3;
            } else if (this.presentQuater == 4) {
                this.quartersList = [1, 2, 3, 4];
                this.quarterFilter = 4;
            }
        } else {
            this.quartersList = [1, 2, 3, 4];
        }
        this.checkMonth(this.quarterFilter);
        this.getFiltered();
    }

    checkMonth(quarterValue: number) {
        this.selectedQuarter = quarterValue
        if (quarterValue == 1) {
            this.startDate = new Date(this.yearFilter, 0, 1);
            this.endDate = new Date(this.yearFilter, 2, 31);
        }
        else if (quarterValue == 2) {
            this.startDate = new Date(this.yearFilter, 3, 1);
            this.endDate = new Date(this.yearFilter, 5, 30);
        }
        else if (quarterValue == 3) {
            this.startDate = new Date(this.yearFilter, 6, 1);
            this.endDate = new Date(this.yearFilter, 8, 30);
        }
        else if (quarterValue == 4) {
            this.startDate = new Date(this.yearFilter, 9, 1);
            this.endDate = new Date(this.yearFilter, 11, 31);
        }
        this.minStartDate = this.selectedStartDate = this.startDate;
        this.maxEndDate = this.selectedEndDate = this.endDate;
        this.getFiltered();
    }

    getIncidentUnitNew() {
        // this.selectedQuarter

        // this.service.gotIncidents.subscribe((res: any) => {
        //     next:
        //     if(res == true) {
        //         this.incidentUnitData = this.service.incidents.Incident_Units;
        //     }
        // })
    }

    getSelectedStartDate() {
        let dateValues = this.minStartDate.toDateString().split(' ');
        return dateValues[2] + ' ' + dateValues[1] + ' ' + dateValues[3];
    }
    getSelectedEndDate() {
        let dateValues = this.maxEndDate.toDateString().split(' ');
        return dateValues[2] + ' ' + dateValues[1] + ' ' + dateValues[3];
    }
    updateSelecedStartDate(event: any) {
        this.selectedStartDate = new Date(event.value._d)
    }
    updateSelecedendDate(event: any) {
        this.selectedEndDate = new Date(event.value._d)
    }
}
