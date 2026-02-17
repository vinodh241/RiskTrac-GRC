import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { IncidentComponent } from './incident/incident.component';

export interface Incident {
    Index: number;
    IncidentCode: string;
    IncidentTitle: string;
    ReportingDate: string;
    IncidentDate: string;
    IncidentType: string;
    IncidentUnit: string;
    Criticality: string;
    IncidentStatus: string;
    NoOfRecommendation: string;
    Open: number;
    ClaimClosed: number;
    Closed: number;
}
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
    selector: 'app-incident-list',
    templateUrl: './incident-list.component.html',
    styleUrls: ['./incident-list.component.scss']
})
export class IncidentListComponent implements OnInit, AfterViewInit {
    campaignOne = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    data: any[] = [];
    role = ""
    displayedColumns: string[] = ['Index', 'IncidentCode', 'IncidentTitle', 'ReportingDate', 'IncidentDate', 'IncidentType', 'IncidentUnit', 'Criticality',
        'IncidentStatus', 'NoOfRecommendation', 'Open', 'ClaimClosed', 'Closed'];
    // dataSource!: MatTableDataSource<Incident>;
    dataSource: MatTableDataSource<Incident> = new MatTableDataSource();
    // @ts-ignore
    @ViewChild(MatPaginator) paginator: MatPaginator;
    codeFilter = new FormControl();
    titleFilter = new FormControl();
    reportingDateFilter = new FormControl();
    typeFilter = new FormControl();
    unitFilter = new FormControl();
    criticalityFilter = new FormControl();
    statusFilter = new FormControl();

    codeDropdownList: string[] = [];
    titleDropdownList: string[] = [];
    typeDropdownList: string[] = [];
    unitDropdownList: string[] = [];
    criticalityDropdownList: string[] = [];
    statusDropdownList: string[] = [];

    filteredValues = {
        code: '',
        title: '',
        reportingDate: '',
        type: '',
        unit: '',
        critical: '',
        status: '',
        open: false,
        claimClosed: false,
        closed: false,
        search: ''
    };
    totalIncidents = 0;
    totalRecommendations = 0;
    totalOpen = 0;
    totalClaimClosed = 0;
    totalClosed = 0;

    isOpenSelected = false;
    isClaimClosedSelected = false;
    isClosedSelected = false;

    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        public service: IncidentService,
        public utils: UtilsService,
        public dialog: MatDialog
    ) {
        service.gotIncidents.subscribe(value => {
            if (value) {
                this.dataSource.data = service.incidents;
                this.totalIncidents = JSON.parse(JSON.stringify(service.incidents || [])).length
                this.totalRecommendations = JSON.parse(JSON.stringify(service.incidents))
                    .filter((x: any) => x['NoOfRecommendation'] > 0)
                    .reduce((a: any, b: any) => a + b['NoOfRecommendation'], 0);

                this.totalOpen = JSON.parse(JSON.stringify(service.incidents))
                    .filter((x: any) => x['Open'] > 0)
                    .reduce((a: any, b: any) => a + b['Open'], 0);

                this.totalClaimClosed = JSON.parse(JSON.stringify(service.incidents))
                    .filter((x: any) => x['ClaimClosed'] > 0)
                    .reduce((a: any, b: any) => a + b['ClaimClosed'], 0);

                this.totalClosed = JSON.parse(JSON.stringify(service.incidents))
                    .filter((x: any) => x['Closed'] > 0)
                    .reduce((a: any, b: any) => a + b['Closed'], 0);
                this.codeDropdownList = JSON.parse(JSON.stringify(service.incidents.map((x: any) => x.IncidentCode)));

                this.titleDropdownList = JSON.parse(JSON.stringify(service.incidents
                    .map((x: any) => (x.IncidentTitle || '').trim())
                    .filter((item: any, index: number, arr: any) => item && arr.indexOf(item) === index)
                ));

                this.typeDropdownList = JSON.parse(JSON.stringify(service.incidents
                    .flatMap((x: any) => x.IncidentTypeData.map((x: any) => x.Name))
                    .filter((item: any, index: number, arr: any) => item && arr.indexOf(item) === index)
                ));

                this.unitDropdownList = JSON.parse(JSON.stringify(service.incidents
                    .map((x: any) => (x.UnitName || '').trim())
                    .filter((item: any, index: number, arr: any) => item && arr.indexOf(item) === index)
                ));

                this.criticalityDropdownList = JSON.parse(JSON.stringify(service.incidents
                    .map((x: any) => (x.CriticalityName || '').trim())
                    .filter((item: any, index: number, arr: any) => item && arr.indexOf(item) === index)
                ));

                this.statusDropdownList = JSON.parse(JSON.stringify(service.incidents
                    .map((x: any) => (x.StatusName || '').trim())
                    .filter((item: any, index: number, arr: any) => item && arr.indexOf(item) === index)
                ));

                this.data = this.dataSource.data;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                       case 'ReportingDate':
                        return new Date(item.ReportingDate);
                       case 'IncidentDate': 
                        return new Date(item.IncidentDate);
                       default: return (item as any)[property];
                    }
                };
            }
        })
    }

    ngOnInit(): void {
        this.role = localStorage.getItem('rorm') || "";
        this.service.getIncidents();

        this.codeFilter.valueChanges.subscribe((codeValue) => {
            this.filteredValues['code'] = (codeValue || '');
            this.onChangeSelection()
        });

        this.titleFilter.valueChanges.subscribe((titleValue) => {
            this.filteredValues['title'] = (titleValue || '');
            this.onChangeSelection()
        });

        this.typeFilter.valueChanges.subscribe((typeValue) => {
            this.filteredValues['type'] = (typeValue || '');
            this.onChangeSelection()
        });

        this.unitFilter.valueChanges.subscribe((unitValue) => {
            this.filteredValues['unit'] = (unitValue || '');
            this.onChangeSelection()
        });

        this.criticalityFilter.valueChanges.subscribe((criticalValue) => {
            this.filteredValues['critical'] = (criticalValue || '');
            this.onChangeSelection()
        });

        this.statusFilter.valueChanges.subscribe((statusValue) => {
            this.filteredValues['status'] = (statusValue || '');
            this.onChangeSelection()
        });

        this.reportingDateFilter.valueChanges.subscribe((value: any) => {
            this.filteredValues['reportingDate'] = value;
            this.onChangeSelection();
        });
    }

    openIncident(id: number): void {
        const dialog = this.dialog.open(IncidentComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: {
                id: id
            }
        });
        dialog.afterClosed().subscribe(result => {
            if(this.service) {
                this.service.gotIncidents.subscribe(value => {
                    if (value == true) {                        
                        this.onChangeSelection()
                    }
                })  
            }
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        this.filteredValues['search'] = (filterValue?.toLowerCase().trim() || '');
        this.onChangeSelection()
    }

    getBackgroundColor(index: any) {
        if (index === 1) {
            return '#fffde7'
        }
        return '';
    }

    getIncidentTypes(types: any): string {
        return types.map((type: any) => type.Name).join(", ")
    }

    ngAfterViewInit(): void {
        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    getDate(dataL: any) {
        let m = dataL.getMonth() + 1
        let dy = dataL.getDate()
        let y = dataL.getFullYear()
        let dl = dy + "-" + m + "-" + y
        return dl
    }

    reverseAndTimeStamp(dateString: string) {
        const reverse = new Date(dateString.split("-").reverse().join("-"));
        return reverse.getTime();
    }

    onChangeSelection() {
        let cloneData = JSON.parse(JSON.stringify(this.data));

        if(this.filteredValues['code']) {
            cloneData = cloneData.filter((item: any) => {
                return (item['IncidentCode'] || '').toLowerCase().trim().includes(this.filteredValues['code'].toLowerCase().trim())
            });
        }
        if(this.filteredValues['title']) {
            cloneData = cloneData.filter((item: any) => {
                return (item['IncidentTitle'] || '').toLowerCase().trim().includes(this.filteredValues['title'].toLowerCase().trim())
            });
        }
        if(this.filteredValues['type']) {
            cloneData = cloneData.filter((item: any) => {
                return (item['IncidentTypeData'] || []).flatMap((x: any) => x.Name.toLowerCase().trim()).some((y: any) => y.includes(this.filteredValues['type'].toLowerCase().trim()))
            });
        }
        if(this.filteredValues['unit']) {
            cloneData = cloneData.filter((item: any) => {
                return (item['UnitName'] || '').toLowerCase().trim().includes(this.filteredValues['unit'].toLowerCase().trim())
            });
        }
        if(this.filteredValues['critical']) {
            cloneData = cloneData.filter((item: any) => {
                return (item['CriticalityName'] || '').toLowerCase().trim().includes(this.filteredValues['critical'].toLowerCase().trim())
            });
        }
        if(this.filteredValues['status']) {
            cloneData = cloneData.filter((item: any) => {
                return (item['StatusName'] || '').toLowerCase().trim().includes(this.filteredValues['status'].toLowerCase().trim())
            });
        }
        if(this.filteredValues['search']) {
            cloneData = cloneData.filter((item: any) => {
                return Object.values(item)?.filter((x: any) => ![null, undefined].includes(x))
                .map((y: any) => typeof y == 'object' ? y.map((z: any) => z.Name).toString().toLowerCase() : y.toString().toLowerCase())
                .some(z => z.includes(this.filteredValues['search']))
            });
        }
        if (this.filteredValues['reportingDate']) {
            let reportDate = new Date(this.filteredValues['reportingDate']);
            let rd = this.getDate(reportDate);
            cloneData = cloneData.filter((item: any) => {
                let dxt = this.getDate(new Date(item.ReportingDate))
                if (this.reverseAndTimeStamp(rd) == this.reverseAndTimeStamp(dxt)) {
                    return item;
                }
            });
        }
        if (this.campaignOne.value.start && this.campaignOne.value.end) {
            let startDate = new Date(this.campaignOne.value.start);
            let lastDate = new Date(this.campaignOne.value.end);
            let sd = this.getDate(startDate)
            let ed = this.getDate(lastDate)

            cloneData = cloneData.filter((item: any) => {
                let dxt = this.getDate(new Date(item.IncidentDate))
                if (this.reverseAndTimeStamp(sd) <= this.reverseAndTimeStamp(dxt) && this.reverseAndTimeStamp(ed) >= this.reverseAndTimeStamp(dxt)) {
                    return item;
                }
            });
            // this.dataSource.data = dtValues.reverse();

            // for(let i = 0; i<this.dataSource.data?.length; i++){
            //     this.dataSource.data[i].Index = this.dataSource.data.length - i;
            // }
            // this.dataSource.filter = JSON.stringify(this.filteredValues);
        }
        this.totalOpen = JSON.parse(JSON.stringify(cloneData))
        .filter((x: any) => x['Open'] > 0)
        .reduce((a: any, b: any) => a + b['Open'], 0);

        this.totalClaimClosed = JSON.parse(JSON.stringify(cloneData))
        .filter((x: any) => x['ClaimClosed'] > 0)
        .reduce((a: any, b: any) => a + b['ClaimClosed'], 0);

        this.totalClosed = JSON.parse(JSON.stringify(cloneData))
        .filter((x: any) => x['Closed'] > 0)
        .reduce((a: any, b: any) => a + b['Closed'], 0);

        if (this.filteredValues['open'] || this.filteredValues['claimClosed'] || this.filteredValues['closed']) {
            cloneData = cloneData.filter((item: any) => {
                return ((this.filteredValues['open'] && item['Open'] > 0) || (this.filteredValues['claimClosed'] && item['ClaimClosed'] > 0) || (this.filteredValues['closed'] && item['Closed'] > 0))
            });
        }
        this.totalIncidents = JSON.parse(JSON.stringify(cloneData || [])).length;
        this.totalRecommendations = JSON.parse(JSON.stringify(cloneData))
        .filter((x: any) => x['NoOfRecommendation'] > 0)
        .reduce((a: any, b: any) => a + b['NoOfRecommendation'], 0);
        this.dataSource.data = JSON.parse(JSON.stringify(cloneData));
        
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onChangeOpen() {
        this.isOpenSelected = !this.isOpenSelected;
        this.filteredValues['open'] = this.isOpenSelected;
        this.onChangeSelection();
    }

    onChangeClaim() {
        this.isClaimClosedSelected = !this.isClaimClosedSelected;
        this.filteredValues['claimClosed'] = this.isClaimClosedSelected;
        this.onChangeSelection();
    }

    onChangeClosed() {
        this.isClosedSelected = !this.isClosedSelected;
        this.filteredValues['closed'] = this.isClosedSelected;
        this.onChangeSelection();
    }
}
