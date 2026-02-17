import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { IncidentService } from 'src/app/services/incident/incident.service';

@Component({
    selector: 'app-incident-master',
    templateUrl: './incident-master.component.html',
    styleUrls: ['./incident-master.component.scss']
})
export class IncidentMasterComponent implements OnInit {
    displayedColumns: string[] = ['Index', 'Name',  'IsActive'];// 'Action',
    displayedColumns1: string[] = ['UserIndex', 'FullName', 'IsActive'];
    displayedColumns2: string[] = ['UserIndex', 'Group', 'Unit', 'FullName', 'IsActive'];
    newRowName: string = "";
    isEdit: boolean = false;
    flag: number = 0;
    duplicate: boolean = false;
    newEditIT: boolean = false;
    newEditSI: boolean = false;
    newEditCri: boolean = false;
    newEditOR: boolean = false;
    newEditIR: boolean = false;
    newEditIA: boolean = false;
    newEditCA: boolean = false;
    enableUser: boolean = false;
    selectedUser: string = "";
    selectedUnit: string = "";
    selectedGroup: string = "";
    filterGroup: any;
    previousNameIT: string = "";
    previousNameSI: string = "";
    previousNameCrit: string = "";
    previousNameOR: string = "";
    previousNameIR: string = "";
    previousNameIA: string = "";
    previousNameCA: string = "";
    @ViewChild('paginatorIT') paginatorIT!: MatPaginator;
    @ViewChild('paginatorSI') paginatorSI!: MatPaginator;
    @ViewChild('paginatorCrit') paginatorCrit!: MatPaginator;
    @ViewChild('paginatorOR') paginatorOR!: MatPaginator;
    @ViewChild('paginatorIR') paginatorIR!: MatPaginator;
    @ViewChild('paginatorIA') paginatorIA!: MatPaginator;
    @ViewChild('paginatorCA') paginatorCA!: MatPaginator;
    disableEdit: boolean = false;
    filterUnitData: any;
    filteredUserData: any;
    filterGroupData: any
    filteredUnit: any;
    filterTableData: any;
    filterUnitRecords: any;
    unitData: any;
    filteredUsers: any;
    filteredUserData1: any;
    filteredUsersData: any;

    constructor(public service: IncidentService) {
        service.gotMaster.subscribe(value => {
            if (value == true) {
                this.service.masterIT.paginator = this.paginatorIT;
                this.service.masterSI.paginator = this.paginatorSI;
                this.service.masterCriticality.paginator = this.paginatorCrit;
                this.service.masterORLEC.paginator = this.paginatorOR;
                this.service.masterIR.paginator = this.paginatorIR;
                this.service.masterIA.paginator = this.paginatorIA;
                this.service.masterCA.paginator = this.paginatorCA;
            }
        });
    }

    ngOnInit(): void {
        this.service.getIncidentMaster();
    }

    applyFilter(event: Event, tableName: string) {
        const filterValue = (event.target as HTMLInputElement).value;
        if (tableName == "incidentTable") {
            this.service.masterIT.filter = filterValue.trim().toLowerCase();
            if (this.service.masterIT.paginator) {
                this.service.masterIT.paginator.firstPage();
            }
        }
        else if (tableName == "SourceOfIdentification") {
            this.service.masterSI.filter = filterValue.trim().toLowerCase();
            if (this.service.masterSI.paginator) {
                this.service.masterSI.paginator.firstPage();
            }
        }
        else if (tableName == "Criticality") {
            this.service.masterCriticality.filter = filterValue.trim().toLowerCase();
            if (this.service.masterCriticality.paginator) {
                this.service.masterCriticality.paginator.firstPage();
            }
        }
        else if (tableName == "OperationalRiskLoss") {
            this.service.masterORLEC.filter = filterValue.trim().toLowerCase();
            if (this.service.masterORLEC.paginator) {
                this.service.masterORLEC.paginator.firstPage();
            }
        }
        else if (tableName == "IncidentReviewers") {
            this.service.masterIR.filter = filterValue.trim().toLowerCase();
            if (this.service.masterIR.paginator) {
                this.service.masterIR.paginator.firstPage();
            }
        }
        else if (tableName == "IncidentApprovalUsers") {
            this.service.masterIA.filter = filterValue.trim().toLowerCase();
            if (this.service.masterIA.paginator) {
                this.service.masterIA.paginator.firstPage();
            }
        }
        else if (tableName == "IncidentCheckers") {
            this.service.masterCA.filter = filterValue.trim().toLowerCase();
            if (this.service.masterCA.paginator) {
                this.service.masterCA.paginator.firstPage();
            }
        }
    }

    addRow(tableName: string): void {
        this.flag++;
        if (tableName == "incidentTable" && this.flag == 1) {
            this.newEditIT = true;
        } else if (tableName == "SourceOfIdentification" && this.flag == 1) {
            this.newEditSI = true;
        } else if (tableName == "Criticality" && this.flag == 1) {
            this.newEditCri = true;
        } else if (tableName == "OperationalRiskLoss" && this.flag == 1) {
            this.newEditOR = true;
        } else if (tableName == "IncidentReviewers" && this.flag == 1) {
            this.newEditIR = true;
        } else if (tableName == "IncidentApprovalUsers" && this.flag == 1) {
            this.newEditIA = true;
        } else if (tableName == "IncidentCheckers" && this.flag == 1) {
            this.newEditCA = true;
            this.enableUser = false
        }
    }

    checkDuplicate(data: any, tableName: any) {
        let tableData: any = [];
        if (tableName == "incidentTable") {
            tableData = this.service.masterIT;
        } else if (tableName == "SourceOfIdentification") {
            tableData = this.service.masterSI;
        } else if (tableName == "Criticality") {
            tableData = this.service.masterCriticality;
        } else if (tableName == "OperationalRiskLoss") {
            tableData = this.service.masterORLEC;
        }
        this.duplicate = Object.values(tableData.data)?.filter((ele: any) => !ele.EditMode)
            .some((ele: any) => ele.Name.trim().toLowerCase() == data.trim().toLowerCase());
    }

    approve(rowData: any, tableName: any) {
        this.isEdit = true;
        let data = [];
        if (tableName == "incidentTable") {
            data.push({
                "typeID": rowData.TypeID,
                "name": rowData.Name,
                "isActive": rowData.IsActive
            })
            this.service.setIncidentMaster({ "incidentTypes": data }, this.isEdit);
        } else if (tableName == "SourceOfIdentification") {
            data.push({
                "sourceID": rowData.SourceID,
                "name": rowData.Name,
                "isActive": rowData.IsActive
            })
            this.service.setIncidentMaster({ "sourceOfIdentifications": data }, this.isEdit);
        } else if (tableName == "Criticality") {
            data.push({
                "criticalityID": rowData.CriticalityID,
                "name": rowData.Name,
                "isActive": rowData.IsActive
            })
            this.service.setIncidentMaster({ "criticality": data }, this.isEdit);
        } else if (tableName == "OperationalRiskLoss") {
            data.push({
                "categoryID": rowData.CategoryID,
                "name": rowData.Name,
                "isActive": rowData.IsActive
            })
            this.service.setIncidentMaster({ "operationalRiskLossEventCategory": data }, this.isEdit);
        } else if (tableName == "IncidentReviewers") {
            data.push({
                "approverID": rowData.ReviewerID,
                "userGUID": rowData.UserGUID,
                "isActive": rowData.IsActive
            })
            this.service.setIncidentMaster({ "incidentReviewers": data }, this.isEdit);
        } else if (tableName == "IncidentApprovalUsers") {
            data.push({
                "approverID": rowData.ApproverID,
                "userGUID": rowData.UserGUID,
                "isActive": rowData.IsActive
            })
            this.service.setIncidentMaster({ "incidentApprovalUsers": data }, this.isEdit);
        } else if (tableName == "IncidentCheckers") {
            data.push({
                "checkerID": rowData.CheckerID,
                "userGUID": rowData.UserGUID,
                "isActive": rowData.IsActive,
                "unitID": rowData.UnitID
            })
            this.service.setIncidentMaster({ "IncidentCheckers": data }, this.isEdit);
        }
        rowData.EditMode = false;
        this.flag = 0;
        this.selectedUser = "";
        this.selectedUnit = "";
        this.selectedGroup = "";
        this.duplicate = false;
    }

    newDataApprove(tableName: any) {
        this.isEdit = false;
        let data = [];
        if (tableName == "incidentTable") {
            this.newEditIT = false;
            data.push({
                "name": this.newRowName,
                "isActive": true
            });
            this.service.setIncidentMaster({ "incidentTypes": data }, this.isEdit);
        } else if (tableName == "SourceOfIdentification") {
            this.newEditSI = false
            data.push({
                "name": this.newRowName,
                "isActive": true
            });
            this.service.setIncidentMaster({ "sourceOfIdentifications": data }, this.isEdit);
        } else if (tableName == "Criticality") {
            this.newEditCri = false;
            data.push({
                "name": this.newRowName,
                "isActive": true
            });
            this.service.setIncidentMaster({ "criticality": data }, this.isEdit);
        } else if (tableName == "OperationalRiskLoss") {
            this.newEditOR = false;
            data.push({
                "name": this.newRowName,
                "isActive": true
            });
            this.service.setIncidentMaster({ "operationalRiskLossEventCategory": data }, this.isEdit);
        } else if (tableName == "IncidentReviewers") {
            this.newEditIR = false;
            let userGUID = this.service.masterUsers.filter((ele: any) => ele.FullName == this.selectedUser).map((ele: any) => ele.UserGUID);
            data.push({
                "userGUID": userGUID[0],
                "isActive": true
            });
            this.service.setIncidentMaster({ "incidentReviewers": data }, this.isEdit);
        } else if (tableName == "IncidentApprovalUsers") {
            this.newEditIA = false;
            let userGUID = this.service.masterUsers.filter((ele: any) => ele.FullName == this.selectedUser).map((ele: any) => ele.UserGUID);
            data.push({
                "userGUID": userGUID[0],
                "isActive": true
            });
            this.service.setIncidentMaster({ "incidentApprovalUsers": data }, this.isEdit);
        } else if (tableName == "IncidentCheckers") {
            this.newEditCA = false;
            let userGUID = this.service.masterAddingCheckersAvlUsers.filter((ele: any) => ele.FullName == this.selectedUser).map((ele: any) => ele.UserGUID);
            let UnitID = this.service.masterAddingCheckersAvlUnit.filter((ele: any) => ele.Name === this.selectedUnit)
            let GroupID = this.service.masterAddingCheckersAvlGroup.filter((ele: any) => ele.GroupName == this.selectedGroup).map((ele: any) => ele.GroupID);
            data.push({
                "userGUID": userGUID[0],
                "unitID": UnitID[0].UnitID,
                "group": GroupID[0],
                "isActive": true
            });
            this.service.setIncidentMaster({ "IncidentCheckers": data }, this.isEdit);
        }
        this.flag = 0;
        this.newRowName = "";
        this.selectedUser = "";
        this.selectedUnit = "";
        this.selectedGroup = "";
        this.duplicate = false;
    }

    isAllDisabled(tableName: any) {
        if (tableName == "incidentTable") {
            return this.service.masterIT.data.filter((ele: any) => ele.IsActive).length <= 1 ? true : false;
        } else if (tableName == "SourceOfIdentification") {
            return this.service.masterSI.data.filter((ele: any) => ele.IsActive).length <= 1 ? true : false;
        } else if (tableName == "Criticality") {
            return this.service.masterCriticality.data.filter((ele: any) => ele.IsActive).length <= 1 ? true : false;
        } else if (tableName == "OperationalRiskLoss") {
            return this.service.masterORLEC.data.filter((ele: any) => ele.IsActive).length <= 1 ? true : false;
        }
        return false
    }

    isUserExists(rowData: any, tableName: any) {
        if (tableName == 'IncidentReviewers') {
            return !this.service.masterIA.data.filter((ele: any) => ele.UserGUID == rowData.UserGUID)[0]?.IsActive;
        } else if (tableName == 'IncidentApprovalUsers') {
            return !this.service.masterIR.data.filter((ele: any) => ele.UserGUID == rowData.UserGUID)[0]?.IsActive;
        } else if (tableName == 'IncidentCheckers') {
            return !this.service.masterCA.data.filter((ele: any) => ele.UserGUID == rowData.UserGUID)[0]?.IsActive;
        }
        return false
    }

    reject(rowData: any, tableName: any) {
        this.flag = 0;
        if (tableName == "incidentTable") {
            rowData.Name = this.previousNameIT;
            this.previousNameIT = "";
            rowData.EditMode = false;
        } else if (tableName == "SourceOfIdentification") {
            rowData.Name = this.previousNameSI;
            this.previousNameSI = "";
            rowData.EditMode = false;
        } else if (tableName == "Criticality") {
            rowData.Name = this.previousNameCrit;
            this.previousNameCrit = "";
            rowData.EditMode = false;
        } else if (tableName == "OperationalRiskLoss") {
            rowData.Name = this.previousNameOR;
            this.previousNameOR = "";
            rowData.EditMode = false;
        } else if (tableName == "IncidentReviewers") {
            rowData.Name = this.previousNameIR;
            this.previousNameIR = "";
            rowData.EditMode = false;
        } else if (tableName == "IncidentApprovalUsers") {
            rowData.Name = this.previousNameIA;
            this.previousNameIA = "";
            rowData.EditMode = false;
        } else if (tableName == "IncidentCheckers") {
            rowData.Name = this.previousNameCA;
            this.previousNameCA = "";
            rowData.EditMode = false;
        }
        this.selectedUser = "";
        this.selectedUnit = "";
        this.selectedGroup = "";
        this.duplicate = false;
    }

    newDataReject(tableName: any) {
        this.flag = 0;
        this.newEditIT = false;
        this.newEditSI = false;
        this.newEditCri = false;
        this.newEditOR = false;
        this.newEditIR = false;
        this.newEditIA = false;
        this.newEditCA = false;
        this.newRowName = "";
        this.selectedUser = "";
        this.selectedUnit = "";
        this.selectedGroup = "";
        this.duplicate = false;
    }

    edit(rowData: any, tableName: any) {
        this.flag++;
        if (tableName == "incidentTable" && this.flag == 1) {
            this.previousNameIT = rowData.Name;
            rowData.EditMode = true;
        } else if (tableName == "SourceOfIdentification" && this.flag == 1) {
            this.previousNameSI = rowData.Name;
            rowData.EditMode = true;
        } else if (tableName == "Criticality" && this.flag == 1) {
            this.previousNameCrit = rowData.Name;
            rowData.EditMode = true;
        } else if (tableName == "OperationalRiskLoss" && this.flag == 1) {
            this.previousNameOR = rowData.Name;
            rowData.EditMode = true;
        } else if (tableName == "IncidentReviewers" && this.flag == 1) {
            this.previousNameIR = rowData.Name;
            rowData.EditMode = true;
        } else if (tableName == "IncidentApprovalUsers" && this.flag == 1) {
            this.previousNameIA = rowData.Name;
            rowData.EditMode = true;
        } else if (tableName == "IncidentCheckers" && this.flag == 1) {
            this.previousNameCA = rowData.Name;
            rowData.EditMode = true;
        }
    }
    
    onSelectChange() {
        this.filterGroup = (this.service.masterAddingCheckersAvlGroup.filter((item: any) => item.GroupName === this.selectedGroup))
        this.unitData = this.service.masterAddingCheckersAvlUnit.filter((item: any) => item.GroupID === this.filterGroup[0].GroupID)
        this.filteredUsersData = this.service.masterAddingCheckersAvlUsers.filter((item: any) => {
            if (item.UnitName === this.selectedUnit) {
                const mastercaMatch = this.service.masterCA.data.find((masterItem: any) =>
                    masterItem.UnitName === item.UnitName &&
                    masterItem.GroupName === item.GroupName &&
                    masterItem.FullName === item.FullName
                );
                const groupMatch = this.filterGroup.find((groupItem: any) =>
                    groupItem.GroupName === item.GroupName
                );
                const unitMatch = this.unitData.find((unitItem: any) =>
                    unitItem.GroupID === groupMatch?.GroupID
                );
                return !mastercaMatch && groupMatch && unitMatch;
            }
            return true;
        });
        this.filteredUsers = this.filteredUsersData.filter((item: any) => item.UnitName === this.selectedUnit);
    }
}