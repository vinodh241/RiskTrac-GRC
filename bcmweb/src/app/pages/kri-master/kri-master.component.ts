import { Component, OnInit, ViewChild } from '@angular/core';
import { KriService } from 'src/app/services/kri/kri.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
    selector: 'app-kri-master',
    templateUrl: './kri-master.component.html',
    styleUrls: ['./kri-master.component.scss'],
})
export class KriMasterComponent implements OnInit {
    displayedColumns: string[] = ['Index', 'Name', 'StatusType' ,'Action'];
    displayedColumnsStatus: string[] = ['StatusIndex', 'StatusName'];
    displayedColumns1: string[] = ['ThreIndex', 'Value', 'ColorCode', 'Action'];
    displayedColumns2: string[] = ['Index', 'Name', 'Period', 'Status'];
    displayedColumns3: string[] = ['UserIndex', 'FullName', 'IsActive'];
    displayedColumns4: string[] = ['Index', 'CurrentFrequency', 'NewFrequency', 'FullName', 'EffectiveDate'];

    days = [
        'Day 1',
        'Day 2',
        'Day 3',
        'Day 4',
        'Day 5',
        'Day 6',
        'Day 7',
        'Day 8',
        'Day 9',
        'Day 10',
        'Day 11',
        'Day 12',
        'Day 13',
        'Day 14',
        'Day 15',
        'Day 16',
        'Day 17',
        'Day 18',
        'Day 19',
        'Day 20',
        'Day 21',
        'Day 22',
        'Day 23',
        'Day 24',
        'Day 25',
    ];
    months = [`Month ${ new Date().getMonth() + 1}`];
    quarter = ['Month 1', 'Month 2', 'Month 3'];
    semianually = [
        'Month 1',
        'Month 2',
        'Month 3',
        'Month 4',
        'Month 5',
        'Month 6',
    ];
    anually = [
        'Month 1',
        'Month 2',
        'Month 3',
        'Month 4',
        'Month 5',
        'Month 6',
        'Month 7',
        'Month 8',
        'Month 9',
        'Month 10',
        'Month 11',
        'Month 12',
    ];
    yearData = [];

    isEdit: boolean = false;
    flag: number = 0;
    newEditMF: boolean = false;
    newEditKT: boolean = false;
    newEditRF: boolean = false;
    newEditStatus: boolean = false;
    newEditTV: boolean = false;
    newName: string = '';
    newDescription: number = 0;
    newValue: string = '';
    zone: string = '';
    newColorCode: string = '#FFFFFF';
    radioSelected: boolean = false;
    duplicate: boolean = false;
    activeMenu: any = 'measurement';
    // selectedDay: any
    selectedDay = 'Day 25';
    selectedMonth = 'Month 3';

    @ViewChild('paginatorMF') paginatorMF!: MatPaginator;
    @ViewChild('paginatorKT') paginatorKT!: MatPaginator;
    @ViewChild('paginatorRF') paginatorRF!: MatPaginator;
    @ViewChild('paginatorStatus') paginatorStatus!: MatPaginator;
    @ViewChild('paginatorTV') paginatorTV!: MatPaginator;
    @ViewChild('paginatorUpFreq') paginatorUpFreq!: MatPaginator;

    leftMenu: any;
    allMasterData: any;
    filterMonthlyData: any;
    filterQuarterlyData: any;
    filterSemiAnnualData: any;
    filterAnnuallyData: any;
    yearValues: any;
    header: any;
    monthSelect: any;
    monthFlag: boolean = false;
    filterEmailData: any;
    allMasterEmail: any;
    numericPart: any;
    numericMonth: any;
    newEditKF: boolean = false;
    selectedUser: string = "";
    notMonth: any;
    notDay: any;
    numericPartDay: any;
    numericMonthData: any;
    reportingFreq: any;
    updatedFrequencyData:any[] =[];
    constructor(public service: KriService, private _dialog: MatDialog, public utils: UtilsService,) {
        service.gotMaster.subscribe((value) => {
            if (value == true) {
                this.service.masterMF.paginator     = this.paginatorMF;
                this.service.masterKT.paginator     = this.paginatorKT;
                this.service.masterRF.paginator     = this.paginatorRF;
                this.service.masterStatus.paginator = this.paginatorStatus;
                this.service.masterTV.paginator     = this.paginatorTV;
                this.service.masterupFreq.paginator = this.paginatorUpFreq
            }
        });
    }

    ngOnInit(): void {
        this.activeMenu = localStorage.getItem('activeMenu');
        this.service.getKriMaster();
        this.service.gotMaster.subscribe((value) => {
            if (value)
                if (this.activeMenu == 'emailTrigger') {
                    // this.service.getKriMaster();
                    this.allMasterData          = this.service.master.reportingFrequencies;                    
                    this.allMasterEmail         = this.service.master.emailData;                    
                    this.filterMonthlyData      = this.allMasterData.filter((ele: any) => ele.InUse == true);
                    this.filterEmailData        = this.allMasterEmail.filter((ele: any) => ele.InUse == true);                    
                    this.selectedMonth          = this.filterEmailData[0].Month;
                    this.updatedFrequencyData   = this.service.master.updatedFrequency;
                    
                    if (this.filterMonthlyData[0].Name == 'Quarterly') {
                        this.header = 'Quarterly Reporting Frequency ';
                        this.yearValues = this.quarter;
                        
                    } else if (this.filterMonthlyData[0].Name == 'Monthly') {
                        this.header = 'Month Reporting Frequency ';
                       
                        this.yearValues = this.months;

                        // this.monthFlag = true;
                    } else if (
                        this.filterMonthlyData[0].Name == 'Semi Annual'
                    ) {
                        this.header = 'Semi Annual Reporting Frequency ';
                        this.yearValues = this.semianually;
                    } else if (this.filterMonthlyData[0].Name == 'Annually') {
                        this.header = 'Annuall Reporting Frequency ';
                        this.yearValues = this.anually;
                    }
                }
        });
    }

    ngOnChange() {}
    applyFilter(event: Event, tableName: string) {
        const filterValue = (event.target as HTMLInputElement).value;
        if (tableName == 'MeasureFreq') {
            this.service.masterMF.filter = filterValue.trim().toLowerCase();
            if (this.service.masterMF.paginator) {
                this.service.masterMF.paginator.firstPage();
            }
        } else if (tableName == 'KriType') {
            this.service.masterKT.filter = filterValue.trim().toLowerCase();
            if (this.service.masterKT.paginator) {
                this.service.masterKT.paginator.firstPage();
            }
        } else if (tableName == 'ReportFreq') {
            this.service.masterRF.filter = filterValue.trim().toLowerCase();
            if (this.service.masterRF.paginator) {
                this.service.masterRF.paginator.firstPage();
            }
        } else if (tableName == 'Status') {
            this.service.masterStatus.filter = filterValue.trim().toLowerCase();
            if (this.service.masterStatus.paginator) {
                this.service.masterStatus.paginator.firstPage();
            }
        } else if (tableName == 'ThresholdValue') {
            this.service.masterTV.filter = filterValue.trim().toLowerCase();
            if (this.service.masterTV.paginator) {
                this.service.masterTV.paginator.firstPage();
            }
        }
    }

    checkDuplicate(data: any, tableName: any) {
        let tableData: any = [];
        if (tableName == 'KriType') {
            tableData = this.service.masterKT;
            this.duplicate = Object.values(tableData.data)
                ?.filter((ele: any) => !ele.EditMode)
                .some(
                    (ele: any) =>
                        ele.Name.trim().toLowerCase() ==
                        data.trim().toLowerCase()
                );
        } else if (tableName == 'ThresholdValue') {
            tableData = this.service.masterTV;
            this.duplicate = Object.values(tableData.data)
                ?.filter((ele: any) => !ele.EditMode)
                .some(
                    (ele: any) =>
                        data?.Value == ele.Value ||
                        data?.ColorCode == ele.ColorCode ||
                        data?.Name.trim().toLowerCase() ==
                            ele.Name.trim().toLowerCase()
                );
        }
    }

    selectedRadio(rowData:any) {
        console.log('rowData: ', rowData);
        this.reportingFreq = rowData
        this.radioSelected = true;
    }

    approve(rowData: any, tableName: any) {
        this.isEdit = true;
        console.log(' this.flag : ',  this.flag );
        console.log("rowData",rowData)
        let data = [];
        if (tableName == 'MeasureFreq') {
            data.push({
                frequencyID: rowData.FrequencyID,
                name: rowData.Name,
                description: rowData.Description,
                isActive: rowData.IsActive,
            });
            this.service.setKriMaster(
                { measurementFrequency: data },
                this.isEdit
            );
        } else if (tableName == 'KriType') {
            // this.flag = 0;
            data.push({
                typeID: rowData.TypeID,
                name: rowData.Name,
                isActive: rowData.IsActive,
            });
            this.service.setKriMaster({ type: data }, this.isEdit);
        } else if (tableName == 'ReportFreq') {
            if (rowData.EditMode == false && rowData.InUse == false) {
                data.push({
                    frequencyID: rowData.FrequencyID,
                    name: rowData.Name,
                    description: rowData.Description,
                    inUse: !rowData.InUse,
                    isActive: rowData.IsActive,
                });
                // console.log("data::", data);
            } else if (rowData.EditMode == true) {
                if (rowData.InUse == true) {
                    data.push({
                        frequencyID: rowData.FrequencyID,
                        name: rowData.Name,
                        description: rowData.Description,
                        inUse: rowData.InUse,
                        isActive: rowData.IsActive,
                    });
                    // console.log("data::", data);
                } else {
                    if (this.radioSelected == true) {
                        data.push({
                            frequencyID: rowData.FrequencyID,
                            name: rowData.Name,
                            description: rowData.Description,
                            inUse: !rowData.InUse,
                            isActive: rowData.IsActive,
                        });
                    } else {
                        let inUseRowData =
                            this.service.masterRF.filteredData.filter(
                                (ele: any) => {
                                    return ele.InUse == true;
                                }
                            )[0];
                        data.push({
                            frequencyID: inUseRowData.FrequencyID,
                            name: inUseRowData.Name,
                            description: inUseRowData.Description,
                            inUse: inUseRowData.InUse,
                            isActive: inUseRowData.IsActive,
                        });
                        data.push({
                            frequencyID: rowData.FrequencyID,
                            name: rowData.Name,
                            description: rowData.Description,
                            inUse: rowData.InUse,
                            isActive: rowData.IsActive,
                        });
                    }
                    // console.log("data::", data);
                }
            }
            this.service.setKriMaster(
                { reportingFrequency: data },
                this.isEdit
            );
        } else if (tableName == 'Status') {
            data.push({
                statusID: rowData.StatusID,
                name: rowData.Name,
            });
            this.service.setKriMaster({ status: data }, this.isEdit);
        } else if (tableName == 'ThresholdValue') {
            // this.flag = 1;
            data.push({
                thresholdID: rowData.ThresholdID,
                name: rowData.Name,
                value: rowData.Value,
                colorCode: rowData.ColorCode,
                isActive: rowData.IsActive,
            });
            this.service.setKriMaster({ thresholdValue: data }, this.isEdit);
        }
        else if (tableName == 'KRIReviewers') {
            // this.flag = 0;
            data.push({
                reviewerID: rowData.ReviewerID,
                userGUID: rowData.UserGUID,
                isActive: rowData.IsActive,
            });
            this.service.setKriMaster({ KRIReviewers: data }, this.isEdit);
        }
        rowData.EditMode = false;
        this.flag = 0;
        
        this.duplicate = false;
    }

    toggleStatus(rowData: any) {
        let data = [];
        if (rowData.InUse == true) {
            data.push({
                frequencyID: rowData.FrequencyID,
                name: rowData.Name,
                description: rowData.Description,
                inUse: rowData.InUse,
                isActive: rowData.IsActive,
            });
        } else {
            let inUseRowData = this.service.masterRF.filteredData.filter(
                (ele: any) => {
                    return ele.InUse == true;
                }
            )[0];
            data.push({
                frequencyID: inUseRowData.FrequencyID,
                name: inUseRowData.Name,
                description: inUseRowData.Description,
                inUse: inUseRowData.InUse,
                isActive: inUseRowData.IsActive,
            });
            data.push({
                frequencyID: rowData.FrequencyID,
                name: rowData.Name,
                description: rowData.Description,
                inUse: rowData.InUse,
                isActive: rowData.IsActive,
            });
        }
        this.service.setKriMaster({ reportingFrequency: data }, this.isEdit);
    }

    edit(rowData: any, tableName: any) {
        this.flag++;
        if (tableName == 'MeasureFreq' && this.flag == 1) {
            rowData.EditMode = true;
        } else if (tableName == 'KriType' && this.flag == 1) {
            rowData.EditMode = true;
        } else if (tableName == 'ReportFreq' && this.flag == 1) {
            rowData.EditMode = true;
        } else if (tableName == 'Status' && this.flag == 1) {
            rowData.EditMode = true;
        } else if (tableName == 'ThresholdValue' && this.flag == 1) {
            rowData.EditMode = true;
        }  else if (tableName == 'KRIReviewers' && this.flag == 1) {
            rowData.EditMode = true;
        }
    }

    reject(rowData: any) {
        console.log('rowData: ', rowData);
        this.flag = 0;
        rowData.EditMode = false;
        this.duplicate = false;
        this.service.getKriMaster();
    }

    newDataApprove(tableName: string) {
        this.isEdit = false;
        let data = [];
        if (tableName == 'MeasureFreq') {
            this.newEditMF = false;
            data.push({
                name: this.newName,
                description: this.newDescription,
                isActive: true,
            });
            this.service.setKriMaster(
                { measurementFrequency: data },
                this.isEdit
            );
        } else if (tableName == 'KriType') {
            this.newEditKT = false;
            data.push({
                name: this.newName,
                isActive: true,
            });
            this.service.setKriMaster({ type: data }, this.isEdit);
        } else if (tableName == 'ReportFreq') {
            this.newEditRF = false;
            data.push({
                name: this.newName,
                description: this.newDescription,
                inUse: false,
                isActive: true,
            });
            this.service.setKriMaster(
                { reportingFrequency: data },
                this.isEdit
            );
        } else if (tableName == 'Status') {
            this.newEditStatus = false;
            data.push({
                name: this.newName,
            });
            this.service.setKriMaster({ status: data }, this.isEdit);
        } else if (tableName == 'ThresholdValue') {
            this.newEditTV = false;
            data.push({
                name: this.newName,
                value: this.newValue,
                colorCode: this.newColorCode,
                isActive: true,
            });
            this.service.setKriMaster({ thresholdValue: data }, this.isEdit);
        } else if (tableName == 'KRIReviewers') {
            let userGUID = this.service.masterUsers.filter((ele: any) => ele.FullName == this.selectedUser).map((ele: any) => ele.UserGUID);
            console.log("🚀 ~ file: kri-master.component.ts:456 ~ KriMasterComponent ~ newDataApprove ~ userGUID:", userGUID)
            this.newEditKF = false;
            data.push({
                "userGUID": userGUID[0],
                "isActive": true
            });
            this.service.setKriMaster({ KRIReviewers: data }, this.isEdit);
        }
        this.clear();
        this.duplicate = false;
    }

    newDataReject() {
        this.newEditKF = false;
        this.clear();
        this.service.getKriMaster();
    }

    clear() {
        this.flag = 0;
        this.newEditMF = false;
        this.newEditKT = false;
        this.newEditRF = false;
        this.newEditStatus = false;
        this.newEditTV = false;
        this.newColorCode = '';
        this.newName = '';
        this.newDescription = 0;
        this.newValue = '';
        this.newColorCode = '#FFFFFF';
        this.radioSelected = false;
    }

    addRow(tableName: string): void {
        this.flag = 0
        this.flag++;
        if (tableName == 'MeasureFreq' && this.flag == 1) {
            this.newEditMF = true;
        } else if (tableName == 'KriType' && this.flag == 1) {
            this.newEditKF = false;
            this.newEditKT = true;
        } else if (tableName == 'ReportFreq' && this.flag == 1) {
            this.newEditRF = true;
        } else if (tableName == 'Status' && this.flag == 1) {
            this.newEditStatus = true;
        } else if (tableName == 'ThresholdValue' && this.flag == 1) {
            this.newEditTV = true;
        } else if (tableName == 'KRIReviewers' && this.flag == 1) {
            this.newEditKT = false;          
            this.newEditKF = true;
        }
    }

    isActive(menu: string) {
        return this.activeMenu === menu;
    }

    openMenu(menu: string) {
        this.activeMenu = menu;
        this.flag = 0
        localStorage.setItem('activeMenu', this.activeMenu);
        if (menu !== 'kriType') this.newEditKT = false;
        if (menu !== 'kriReviwer') this.newEditKF = false;
        if (this.activeMenu == 'emailTrigger') {
            // this.service.getKriMaster();
            this.allMasterData      = this.service.master.reportingFrequencies;           
            this.allMasterEmail     = this.service.master.emailData;           
            this.filterMonthlyData  = this.allMasterData.filter((ele: any) => ele.InUse == true);
            this.filterEmailData    = this.allMasterEmail.filter((ele: any) => ele.InUse == true);
            this.selectedMonth      = this.filterEmailData[0].Month;

            if (this.filterMonthlyData[0].Name == 'Quarterly') {
                this.header = 'Quarterly Reporting Frequency ';
                this.yearValues = this.quarter;
            } else if (this.filterMonthlyData[0].Name == 'Monthly') {
                this.header = 'Month Reporting Frequency ';
                this.yearValues = this.months;
                // this.monthFlag = true;
            } else if (this.filterMonthlyData[0].Name == 'Semi Annual') {
                this.header = 'Semi Annual Reporting Frequency ';
                this.yearValues = this.semianually;
            } else if (this.filterMonthlyData[0].Name == 'Annually') {
                this.header = 'Annuall Reporting Frequency ';
                this.yearValues = this.anually;
            }
            console.log(
                '🚀 ~ file: kri-master.component.ts:347 ~ KriMasterComponent ~ openMenu ~  this.allMasterData:',
                this.allMasterData
            );
        }
    }

    onDaySelect(event: any) {
        this.selectedDay = event.value;
        this.numericPart = parseInt(this.selectedDay.replace(/\D/g, ''), 10);
    }

    submit() {
        for (const item of this.service.master.emailData) {
            if (item.InUse && item.IsActive) {
                this.notMonth = item.Month;
                this.notDay = item.Day
                break; // If you want to break the loop after finding the first match
            }
        }

        // this.notMonth = this.service.master.emailData[0].Month
        console.log('this.notMonth: ', this.notMonth);
        console.log('this.notDay: ', this.notDay);

        this.numericMonthData   = parseInt(this.notMonth.replace(/\D/g, ''), 10);
        this.numericPartDay     = parseInt(this.notDay.replace(/\D/g, ''), 10);
        
        let data: any = {
            emailfrequencyID: this.filterEmailData[0].EmailFrequencyID,
            reportingfrequencyID: this.filterMonthlyData[0].FrequencyID,
            month: this.numericMonth ? this.numericMonth: this.numericMonthData,
            day: this.numericPart ? this.numericPart : this.numericPartDay,
            description: this.filterMonthlyData[0].Description,
            inUse: 1,
            isActive: 1,
        };
        console.log("data",data)
        this.service.setKriMaster({ EmailData: data }, this.isEdit);
        // this.service.getKriMaster();
    }

    handleClick(month: any) {
        this.monthSelect = month;
        this.numericMonth = parseInt(this.monthSelect.replace(/\D/g, ''), 10);
    }

    isUserExists(rowData: any, tableName: any) {
        // console.log("tableName",tableName)
        if (tableName == 'KRIReviewers') {
            return !this.service.masterKR.data.filter(
                (ele: any) => ele.UserGUID == rowData.UserGUID
            )[0]?.IsActive;
        } else{
            return false
        }
    }

    submitReportingFreq(){
        this.isEdit = false

        let data: any = {
           "frequencyID": this.reportingFreq.FrequencyID,
           "name": this.reportingFreq.Name,
           "description": this.reportingFreq.Description,
           "inUse":1,
           "isActive":1
        };
            console.log("data",data)
        this.service.setKriMaster({ reportingFrequency: data }, this.isEdit);

    }

    close(){
        this.service.getKriMaster();
    }
}
