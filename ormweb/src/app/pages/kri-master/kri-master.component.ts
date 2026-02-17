import { Component, OnInit, ViewChild } from '@angular/core';
import { KriService } from 'src/app/services/kri/kri.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-kri-master',
    templateUrl: './kri-master.component.html',
    styleUrls: ['./kri-master.component.scss'],
})
export class KriMasterComponent implements OnInit {
    displayedColumns: string[] = ['Index', 'Name', 'StatusType', 'Action'];
    displayedColumnsStatus: string[] = ['StatusIndex', 'StatusName'];
    displayedColumns1: string[] = ['ThreIndex', 'Value', 'ColorCode', 'Action'];
    displayedColumns2: string[] = ['Index', 'Name', 'Period', 'Status'];
    // New column list used only for Reporting Frequency table
    displayedColumnsRF: string[] = ['Index', 'Name', 'GracePeriodDays', 'reminderdays', 'Period', 'LastUpdatedDate', 'Status'];
    displayedColumns3: string[] = ['UserIndex', 'FullName', 'IsActive'];
    displayedColumns4: string[] = ['Index', 'CurrentFrequency', 'NewFrequency','OldBufferDays', 'NewBufferDays', 'EffectiveDate', 'FullName' ];

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
    months = [`Month ${new Date().getMonth() + 1}`];
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
    updatedFrequencyData: any[] = [];
    selectedFrequencyId: number | string | null = null;

    constructor(
        public service: KriService,
        private _dialog: MatDialog,
        public utils: UtilsService,
        private cdRef: ChangeDetectorRef
    ) {
        service.gotMaster.subscribe((value) => {
            if (value == true) {
                this.service.masterMF.paginator = this.paginatorMF;
                this.service.masterKT.paginator = this.paginatorKT;
                this.service.masterRF.paginator = this.paginatorRF;
                this.service.masterStatus.paginator = this.paginatorStatus;
                this.service.masterTV.paginator = this.paginatorTV;
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
                    this.allMasterData = this.service.master.reportingFrequencies;
                    this.allMasterEmail = this.service.master.emailData;
                    this.filterMonthlyData = this.allMasterData.filter((ele: any) => ele.InUse == true);
                    this.filterEmailData = this.allMasterEmail.filter((ele: any) => ele.InUse == true);
                    this.selectedMonth = this.filterEmailData[0].Month;
                    this.updatedFrequencyData = this.service.master.updatedFrequency;
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

            this.normalizeMasterRF();
            this.initSelectedFrequency();
        });
    }

    ngOnChange() { }
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

    selectedRadio(rowData: any) {
        this.reportingFreq = rowData
        this.radioSelected = true;
    }

    approve(rowData: any, tableName: any) {
        this.isEdit = true;
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
            } else if (rowData.EditMode == true) {
                if (rowData.InUse == true) {
                    data.push({
                        frequencyID: rowData.FrequencyID,
                        name: rowData.Name,
                        description: rowData.Description,
                        inUse: rowData.InUse,
                        isActive: rowData.IsActive,
                    });
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
        } else if (tableName == 'KRIReviewers' && this.flag == 1) {
            rowData.EditMode = true;
        }
    }

    reject(rowData: any) {
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
            this.allMasterData = this.service.master.reportingFrequencies;
            this.allMasterEmail = this.service.master.emailData;
            this.filterMonthlyData = this.allMasterData.filter((ele: any) => ele.InUse == true);
            this.filterEmailData = this.allMasterEmail.filter((ele: any) => ele.InUse == true);
            this.selectedMonth = this.filterEmailData[0].Month;

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
        this.numericMonthData = parseInt(this.notMonth.replace(/\D/g, ''), 10);
        this.numericPartDay = parseInt(this.notDay.replace(/\D/g, ''), 10);

        let data: any = {
            emailfrequencyID: this.filterEmailData[0].EmailFrequencyID,
            reportingfrequencyID: this.filterMonthlyData[0].FrequencyID,
            month: this.numericMonth ? this.numericMonth : this.numericMonthData,
            day: this.numericPart ? this.numericPart : this.numericPartDay,
            description: this.filterMonthlyData[0].Description,
            inUse: 1,
            isActive: 1,
        };
        this.service.setKriMaster({ EmailData: data }, this.isEdit);
        // this.service.getKriMaster();
    }

    handleClick(month: any) {
        this.monthSelect = month;
        this.numericMonth = parseInt(this.monthSelect.replace(/\D/g, ''), 10);
    }

    isUserExists(rowData: any, tableName: any) {
        if (tableName == 'KRIReviewers') {
            return !this.service.masterKR.data.filter(
                (ele: any) => ele.UserGUID == rowData.UserGUID
            )[0]?.IsActive;
        } else {
            return false
        }
    }

    submitReportingFreq() {
        this.isEdit = false;
        // ensure table rows are normalized first
        this.normalizeMasterRF();            // safe-guard
        this.initSelectedFrequency();        // optional: usually not required here

        // helper to read rows from service.masterRF whether it's MatTableDataSource or plain array
        const getRows = (): any[] => {
            if (!this.service || this.service.masterRF == null) return [];
            if (this.service.masterRF instanceof MatTableDataSource) {
                return Array.isArray(this.service.masterRF.data) ? this.service.masterRF.data : [];
            }
            return Array.isArray(this.service.masterRF) ? this.service.masterRF : [];
        };

        // helper to get a normalized id from a row
        const rowId = (r: any) => r?.FrequencyID ?? r?.FrequencyId ?? r?.Id ?? r?.index ?? r?.Index ?? null;

        // helper to clamp the grace value
        const clampGrace = (v: any) => {
            let n = Number(v);
            if (isNaN(n)) n = 0;
            n = Math.round(n);
            if (n < 0) n = 0;
            if (n > 30) n = 30;
            return n;
        };

        // Attempt 1: prefer this.reportingFreq (if available)
        let selected = this.reportingFreq;

        // Attempt 2: fallback to selectedFrequencyId (if you maintain it)
        if (!selected && this.selectedFrequencyId != null) {
            const rows = getRows();
            selected = rows.find(r => rowId(r) === this.selectedFrequencyId) || undefined;
        }

        // Attempt 3: fallback to any row with InUse truthy
        if (!selected) {
            const rows = getRows();
            selected = rows.find(r => r.InUse === true || r.InUse === 1 || r.InUse === '1') || undefined;
        }

        // Attempt 4: fallback to first row (last resort)
        if (!selected) {
            const rows = getRows();
            if (rows.length) {
                console.warn('submitReportingFreq: no reportingFreq object or selected id found — using first row as fallback', rows);
                selected = rows[0];
            }
        }

        // If still not found, abort gracefully and inform developer/user
        if (!selected) {
            console.error('submitReportingFreq: no reporting frequency row available to submit.');
            // optionally show a user-friendly toast/message here
            return;
        }

        // Ensure reportingFreq is set so future calls don't run into undefined
        this.reportingFreq = this.reportingFreq || { ...selected };

        // Build payload using values from reportingFreq (prefer reportingFreq, then selected row)
        const freqId = this.reportingFreq?.FrequencyID ?? rowId(selected);
        const name = this.reportingFreq?.Name ?? selected?.Name ?? '';
        const description = this.reportingFreq?.Description ?? selected?.Description ?? '';
        // Choose GracePeriodDays from reportingFreq if present, otherwise from selected row
        const graceRaw = this.reportingFreq?.GracePeriodDays ?? selected?.GracePeriodDays ?? 0;
        const graceValue = clampGrace(graceRaw);

        const reminderdaysRaw = this.reportingFreq?.reminderdays ?? selected?.reminderdays ?? 0;
        const reminderdaysalue = clampGrace(reminderdaysRaw);

        const data: any = {
            "frequencyID": freqId,
            "name": name,
            "description": description,
            "inUse": 1,
            "isActive": 1,
            "bufferdays": graceValue,   // use the key your backend expects; change case if needed
            "reminderdays": reminderdaysalue
        };
        // Call your existing service method (unchanged)
        this.service.setKriMaster({ reportingFrequency: data }, this.isEdit);
    }


    close() {
        this.service.getKriMaster();
    }

    // call this after you load/normalize masterRF
    initSelectedFrequency(): void {
        const rows: any[] = this.service.masterRF instanceof MatTableDataSource
            ? (this.service.masterRF.data || [])
            : (Array.isArray(this.service.masterRF) ? this.service.masterRF : []);

        const inUseRow = rows.find(r => r.InUse === true);

        if (inUseRow) {
            this.selectedFrequencyId = inUseRow.FrequencyID ?? inUseRow.Id ?? inUseRow.Index ?? null;
            // keep a shallow copy for editing/saving if you use reportingFreq elsewhere
            this.reportingFreq = { ...inUseRow };
        } else {
            this.selectedFrequencyId = null;
        }

        // reassign data to trigger Material table change detection
        if (this.service.masterRF instanceof MatTableDataSource) {
            this.service.masterRF.data = [...rows];
        }

        // ensure view updates immediately
        this.cdRef.detectChanges?.();
    }




    /**
     * Called when user selects a radio for a row.
     * Ensures only one row has InUse true and stores selectedFrequencyId.
     */
    onSelectFrequency(row: any) {
        const id = row.FrequencyID ?? row.Id ?? row.Index ?? null;
        this.selectedFrequencyId = id;

        // update InUse on rows so UI reflects new selection
        const rows: any[] = this.service.masterRF instanceof MatTableDataSource
            ? (this.service.masterRF.data || [])
            : (Array.isArray(this.service.masterRF) ? this.service.masterRF : []);

        rows.forEach(r => {
            const rid = r.FrequencyID ?? r.Id ?? r.Index ?? null;
            r.InUse = (rid === id);
        });

        if (this.service.masterRF instanceof MatTableDataSource) {
            this.service.masterRF.data = [...rows];
        }
    }


    /** returns true when GracePeriodDays should be editable for this row */
    isGraceEditable(row: any): boolean {
        if (!row) return false;
        const id = row.FrequencyID ?? row.Id ?? row.Index ?? null;
        const inUse = !!row.InUse;
        return inUse && this.selectedFrequencyId !== null && this.selectedFrequencyId === id;
    }

    /** called while typing to show live error (does not auto-correct yet) */
    validateGrace(row: any) {
        const v = Number(row.GracePeriodDays);
        // show validation feedback but don't clamp yet
        row.invalidGrace = isNaN(v) || v < 0 || v > 15;
    }

    /** called when user leaves the field to enforce clamp */
    onGraceBlur(row: any) {
        let v = Number(row.GracePeriodDays);
        if (isNaN(v)) v = 0;
        v = Math.round(v);
        v = Math.max(0, Math.min(15, v)); // clamp to [0,15]
        row.GracePeriodDays = v;

        // trigger table update when using MatTableDataSource
        if (this.service.masterRF instanceof MatTableDataSource) {
            this.service.masterRF.data = [...this.service.masterRF.data];
        }
    }


    private normalizeMasterRF(): void {
        const normalizeArray = (arr: any[]): any[] => {
            return (arr || []).map((r: any, idx: number) => {
                if (!r) r = {};
                // GracePeriodDays defaults and clamp
                let gpds = (r.GracePeriodDays === undefined || r.GracePeriodDays === null) ? 0 : Number(r.GracePeriodDays);
                if (isNaN(gpds)) gpds = 0;
                gpds = Math.round(gpds);
                gpds = Math.max(0, Math.min(30, gpds));
                r.GracePeriodDays = gpds;

                // // reminderdays defaults and clamp
                let remds = (r.reminderdays === undefined || r.reminderdays === null) ? 0 : Number(r.reminderdays);
                if (isNaN(remds)) remds = 0;
                remds = Math.round(remds);
                remds = Math.max(0, Math.min(30, remds));
                r.reminderdays = remds;

                // normalize InUse to boolean
                r.InUse = (r.InUse === true) || (r.InUse === 1) || (r.InUse === '1') || (!!r.InUse && r.InUse !== 0 && r.InUse !== '0');

                // ensure Index (optional)
                if (r.Index === undefined || r.Index === null) r.Index = idx + 1;

                return r;
            });
        };

        if (this.service.masterRF instanceof MatTableDataSource) {
            const raw = Array.isArray(this.service.masterRF.data) ? this.service.masterRF.data : [];
            this.service.masterRF.data = normalizeArray(raw);
            return;
        }

        if (Array.isArray(this.service.masterRF)) {
            this.service.masterRF = new MatTableDataSource<any>(normalizeArray(this.service.masterRF));
            return;
        }

        // fallback
        this.service.masterRF = new MatTableDataSource<any>(normalizeArray([]));
    }

    isreminderdaysEditable(row: any): boolean {
        if (!row) return false;
        const id = row.FrequencyID ?? row.Id ?? row.Index ?? null;
        const inUse = !!row.InUse;
        return inUse && this.selectedFrequencyId !== null && this.selectedFrequencyId === id;
    }

    /** live validation while typing (does not mutate value) */
    validateReminderdays(row: any) {
        const v = Number(row.reminderdays);
        row.invalidReminderdays = isNaN(v) || v < 0 || v > 30;
    }

    /** on blur — enforce integer and clamp to [0,30] */
    onReminderdaysBlur(row: any) {
        let v = Number(row.reminderdays);
        if (isNaN(v)) v = 0;
        v = Math.round(v);
        v = Math.max(0, Math.min(30, v));
        row.reminderdays = v;

        // trigger table update when using MatTableDataSource
        if (this.service.masterRF instanceof MatTableDataSource) {
            this.service.masterRF.data = [...this.service.masterRF.data];
        }
    }
}
