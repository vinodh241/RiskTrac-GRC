import { Inject, Injectable, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { RestService } from '../rest/rest.service';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT, formatDate } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { saveAs } from 'file-saver';
import { BehaviorSubject, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';



export interface incidentTypes {
    TypeID: number | null;
    Name: string;
    IsActive: number;
}

export interface sourceOfIdentifications {
    SourceID: number | null;
    Name: string;
    IsActive: number;
}

export interface criticality {
    CriticalityID: number | null;
    Name: string;
    IsActive: number;
}

export interface operationalRiskLossEventCategory {
    CategoryID: number | null;
    Name: string;
    IsActive: number;
}

export interface incidentReviewers {
    ReviewerID: number | null;
    UserGUID: string;
    FullName: string;
    IsActive: number;
}

export interface incidentApprovalUsers {
    ApproverID: number | null;
    UserGUID: string;
    FullName: string;
    IsActive: number;
}

export interface usersList {
    UserGUID: string;
    FullName: string;
}

export interface Evidence {
    EvidenceID: number;
    OriginalFileName: string;
    Remark: string;
    CreatedDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class IncidentService extends RestService {
    public isIncidentEditable: boolean = true
    public isReviewEditable: boolean = true
    public isReviewInEdit: boolean = true
    public master!: any;
    public reviewers!: any;
    public approvals!: any;
    public incidents!: any;
    public info!: any;
    public incidentSources!: any;
    public incidentCriticalities!: any;
    public usersGUIDS!: any;

    public inAppRCSA:any;
    public inAppRA:any;
    public inAppKRI:any;
    public inAppINC:any;
    
    public incident: any = { "Reportee": true };
    public auditTrail: any[] = [];
    public incidentTypes: any[] = [];
    public impactedUnits: any[] = [];
    public workflowActions: any[] = [];
    public workflowCheckerActions: any[] = [];
    public recommendations: any[] = [];
    public riskLossCategories: any[] = [];
    public incEvidences: MatTableDataSource<Evidence> = new MatTableDataSource();
    public rcaEvidences: MatTableDataSource<Evidence> = new MatTableDataSource();
    public recEvidences: any[] = [];

    public masterIT!: MatTableDataSource<incidentTypes>
    public masterSI!: MatTableDataSource<sourceOfIdentifications>
    public masterCriticality!: MatTableDataSource<criticality>
    public masterORLEC!: MatTableDataSource<operationalRiskLossEventCategory>
    public masterIR!: MatTableDataSource<incidentReviewers>
    public masterIA!: MatTableDataSource<incidentApprovalUsers>
    public masterCA!: MatTableDataSource<incidentApprovalUsers>
    public masterCAUserIds : any[] = []
    public checkerUser : any
    public masterUsers!: any;
    public checkerUsers!:any;
    public masterReviewersAvl: any[] = [];
    public masterApproversAvl: any[] = [];
    public masterCheckersAvl: any[] = [];
    public masterAddingCheckersAvlGroup: any[] = [];
    public masterAddingCheckersAvlUsers: any[] = [];
    public masterAddingCheckersAvlUnit: any[] = [];
    public isMasterReviwersActive!: any;
    public isMasterApproversActive!: any;
    public isMasterCheckerActive!: any;
    public isMasterReviwerAssigned!: any;
    public isMasterApproverAssigned!: any;
    public isMasterCheckerAssigned!: any;
    public filterUnitData: any;
    public filterGroupData: any;

    public gotInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotIncident: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotIncidents: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public expandedRecommendationIDs: any[] = [];

    constructor(
        private utils: UtilsService,
        private _http: HttpClient,
        private _dialog: MatDialog,
        private _datePipe: DatePipe,
        @Inject(DOCUMENT) private _document: any) {
        super(_http, _dialog);
    }

    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this._dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: message
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
                // this.router.navigate(['']);
            }, timeout)
        });
    }

    getIncidentMaster(): void {
        if (environment.dummyData) {
            this.processIncidentMaster({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "incidentTypes": [
                        {
                            "TypeID": 802,
                            "Name": "Bvsfgnuwv",
                            "IsActive": 1
                        }
                    ],
                    "sourceOfIdentifications": [
                        {
                            "SourceID": 256,
                            "Name": "Ygafbjxtm Cuok Wdoj Sya",
                            "IsActive": 1
                        }
                    ],
                    "criticality": [
                        {
                            "CriticalityID": 945,
                            "Name": "Lfawprezc Vbxr Kljkmgdxiu",
                            "IsActive": 1
                        }
                    ],
                    "operationalRiskLossEventCategory": [
                        {
                            "CategoryID": 815,
                            "Name": "Dekknm Lulhkpxdwt",
                            "IsActive": 1
                        }
                    ],
                    "incidentReviewers": [
                        {
                            "ReviewerID": 873,
                            "UserGUID": "XekailohHgiZzonuQzxdhdirkXaofnilyva",
                            "IsActive": false
                        },
                        {
                            "ApproverID": 694,
                            "UserGUID": "XekailohHgiZzonuQzxdhdirkXaofnilyvb",
                            "IsActive": true
                        }
                    ],
                    "incidentApprovalUsers": [
                        {
                            "ApproverID": 695,
                            "UserGUID": "XekailohHgiZzonuQzxdhdirkXaofnilyve",
                            "IsActive": true
                        },
                        {
                            "ReviewerID": 873,
                            "UserGUID": "XekailohHgiZzonuQzxdhdirkXaofnilyva",
                            "IsActive": false
                        }
                    ],
                    "usersList": [
                        {
                            "UserGUID": "XekailohHgiZzonuQzxdhdirkXaofnilyve",
                            "FullName": "User-1"
                        },
                        {
                            "UserGUID": "XekailohHgiZzonuQzxdhdirkXaofnilyva",
                            "FullName": "User-2"
                        },
                        {
                            "UserGUID": "XekailohHgiZzonuQzxdhdirkXaofnilyvb",
                            "FullName": "User-3"
                        },
                        {
                            "UserGUID": "XekailohHgiZzonuQzxdhdirkXaofnilyvc",
                            "FullName": "User-4"
                        }
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "eyJ0eXAiOiJKV"
            })
        } else {
            this.post("/operational-risk-management/incidents/get-incident-master-data", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.processIncidentMaster(res)
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    indexIncidentMaster(docs: any) {
        let Index = 1;
        docs.forEach((data: any) => {
            data.Index = Index;
            data.EditMode = false;
            Index++;
        });
        return docs
    }

    getMasterUserDetails(docs: any) {
        let userName = "";
        docs.forEach((element: any) => {
            userName = this.masterUsers.filter((ele: any) => ele.UserGUID == element.UserGUID).map((ele: any) => ele.FullName);
            element['FullName'] = !!userName ? userName : "";
        });
        // docs = JSON.parse(JSON.stringify(docs.filter((ele: any) => ele.FullName != "")))
        console.log("🚀 ~ file: incident.service.ts:272 ~ IncidentService ~ getMasterUserDetails ~ docs:", docs)

        return docs;
    }

    getMasterCheckerDetails(docs: any) {
        let userName = "";
        // docs.forEach((element: any) => {
        //     userName = this.checkerUsers.filter((ele: any) => ele.UserGUID == element.UserGUID).map((ele: any) => ele.FullName);
        //     element['FullName'] = !!userName ? userName : "";
        // });
        docs.forEach((element: any) => {
            const user = this.checkerUsers.find((ele: any) => ele.UserGUID === element.UserGUID);

            if (user) {
                element['FullName'] = user.FullName;
                element['Group'] = user.GroupName;
                element['Unit'] = user.UnitName;
            } else {
                element['FullName'] = "";
                element['Group'] = "";
                element['Unit'] = "";
            }
        });
        docs = JSON.parse(JSON.stringify(docs.filter((ele: any) => ele.FullName != "")))
        console.log("🚀 ~ file: incident.service.ts:272 ~ IncidentService ~ getMasterUserDetails ~ docs:", docs)
        return docs;
    }

    filterMasterUsers(allUsers: any, activeUsers: any) {
        let userGUIDs: any = [];
        userGUIDs = allUsers.map((ele1: any) => ele1.UserGUID).concat(activeUsers.map((ele2: any) => ele2.UserGUID));

        let requiredUser: any = [];
        requiredUser = this.masterUsers.filter((ele: any) => !(userGUIDs.includes(ele.UserGUID)));

        return requiredUser;
    }

    filterUnitUsers(docs:any){
        docs.forEach((element: any) => {
           // Assuming `this.masterAddingCheckersAvl` is an array of objects with a property `UnitName`
            const uniqueUnitNames = new Set(this.masterAddingCheckersAvlUsers.map(item => item.UnitName));

            this.filterUnitData = Array.from(uniqueUnitNames).map(unitName => ({ UnitName: unitName }));

            if (this.filterUnitData) {
                element['Unit'] = this.filterUnitData.UnitName;
            } else {
                element['Unit'] = "";
            }
        });
        console.log("this.filterUnitData",this.filterUnitData)
        return this.filterUnitData;
    }

    filterGroupUsers(docs:any){
        docs.forEach((element: any) => {
           // Assuming `this.masterAddingCheckersAvl` is an array of objects with a property `UnitName`
            const uniqueGroupNames = new Set(this.masterAddingCheckersAvlGroup.map(item => item.GroupName));

            this.filterGroupData = Array.from(uniqueGroupNames).map(GroupName => ({ GroupName: GroupName }));

            if (this.filterGroupData) {
                element['Group'] = this.filterGroupData.GroupName;
            } else {
                element['Group'] = "";
            }
        });
        console.log("this.filterGroupData",this.filterGroupData)
        return this.filterGroupData;
    }


    isAllActive(users: any) {
        return users.every((ele: any) => !ele.IsActive);
    }

    processIncidentMaster(response: any): void {
        this.master = response.result;
        console.log(" this.master ", this.master )
        this.masterUsers = response.result.usersList;
        this.checkerUsers = response.result.AddingIncidentCheckersUsers
        this.masterReviewersAvl = this.filterMasterUsers(this.master.incidentReviewers, this.master.incidentApprovalUsers.filter((ele: any) => ele.IsActive));
        this.masterApproversAvl = this.filterMasterUsers(this.master.incidentApprovalUsers, this.master.incidentReviewers.filter((ele: any) => ele.IsActive));
        this.masterCheckersAvl = this.filterMasterUsers(this.master.IncidentCheckers, this.master.IncidentCheckers.filter((ele: any) => ele.IsActive));
        this.masterAddingCheckersAvlGroup =  this.master.AddingIncidentCheckersGroup;
        this.masterAddingCheckersAvlUnit = this.master.AddingIncidentCheckersUnit;
        this.masterAddingCheckersAvlUsers = this.master.AddingIncidentCheckersUsers;
        this.masterIT = new MatTableDataSource(this.indexIncidentMaster(response.result.incidentTypes));
        this.masterSI = new MatTableDataSource(this.indexIncidentMaster(response.result.sourceOfIdentifications));
        this.masterCriticality = new MatTableDataSource(this.indexIncidentMaster(response.result.criticality));
        this.masterORLEC = new MatTableDataSource(this.indexIncidentMaster(response.result.operationalRiskLossEventCategory));
        this.masterIR = new MatTableDataSource(this.indexIncidentMaster((response.result.incidentReviewers)));
        this.masterIA = new MatTableDataSource(this.indexIncidentMaster((response.result.incidentApprovalUsers)));
        this.masterCA = new MatTableDataSource(this.indexIncidentMaster((response.result.IncidentCheckers)));
        this.checkerUser = response.result.IncidentCheckers
        this.masterCAUserIds = response.result.IncidentCheckers.map((x:any) => x.UserGUID)
        this.isMasterReviwersActive = this.isAllActive(this.masterIR.data);
        this.isMasterApproversActive = this.isAllActive(this.masterIA.data);
        this.isMasterCheckerActive = this.isAllActive(this.masterCA.data);
        console.log("this.masterCA.data",this.masterCA.data)
        console.log("this.ismasterchecker",this.isMasterCheckerActive)
        this.isMasterReviwerAssigned = this.masterIR.data.length > 0;
        this.isMasterApproverAssigned = this.masterIA.data.length > 0;
        this.isMasterCheckerAssigned = this.masterCA.data.length > 0;
        this.filterUnitData =  (this.indexIncidentMaster(this.filterUnitUsers(this.masterAddingCheckersAvlUnit)));
        this.filterGroupData =  (this.indexIncidentMaster(this.filterGroupUsers(this.masterAddingCheckersAvlGroup)));
        console.log("🚀 ~ file: incident.service.ts:369 ~ IncidentService ~ processIncidentMaster ~ this.filterGroupData:", this.filterGroupData)
        this.gotMaster.next(true);
    }

    setIncidentMaster(data: any, isEdit: any): void {
        this.post("/operational-risk-management/incidents/set-incident-master-data", data, false).subscribe(res => {
            if (res.success == 1) {
                this.processIncidentMaster(res)
                // this.popupInfo("Success", "Data updated successfully")
                if (isEdit) {
                    this.popupInfo("Success", "Record updated successfully");
                } else {
                    this.popupInfo("Success", "Record added successfully");
                }
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document)
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    getIncidents(): void {
        if (environment.dummyData) {
            this.processIncidents({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "incidents": [
                        {
                            "IncidentID": 882,
                            "IncidentCode": "AntWdwhuuixvePtbRtq",
                            "ReportingDate": "2022-11-18T12:59:00.000Z",
                            "IncidentDate": "2022-11-18T12:59:00.000Z",
                            "IncidentTypeData": [
                                {
                                    "IncidentTypeLNID": 887,
                                    "IncidentTypeID": 848,
                                    "Name": "MpyijqaevVjkVtjjdgbwus"
                                },
                                {
                                    "IncidentTypeLNID": 905,
                                    "IncidentTypeID": 199,
                                    "Name": "XcylyaKetnnnwJzvz"
                                }
                            ],
                            "IncidentUnitData": [
                                {
                                    "IncidentUnitLNID": 75,
                                    "IncidentUnitID": 468,
                                    "UnitName": "TgwokvphjneHkvrcozhnrpMmjluqyqwq"
                                },
                                {
                                    "IncidentUnitLNID": 829,
                                    "IncidentUnitID": 622,
                                    "UnitName": "WzxmhqbXydowccgtJkdzrhdowptWcwrcTehssykrfhh"
                                }
                            ],
                            "CriticalityID": "OmPjnztlyrslxKapr",
                            "CriticalityName": 684,
                            "StatusID": 983,
                            "StatusName": "IoxVryiuuf",
                            "NoOfRecommendation": 10,
                            "Open": 2,
                            "ClaimClosed": 6,
                            "Closed": 2
                        },
                        {
                            "IncidentID": 648,
                            "IncidentCode": "Svixxqbpyv",
                            "ReportingDate": "2022-11-18T12:59:00.000Z",
                            "IncidentDate": "2022-11-18T12:59:00.000Z",
                            "IncidentTypeData": [
                                {
                                    "IncidentTypeLNID": 887,
                                    "IncidentTypeID": 848,
                                    "Name": "MpyijqaevVjkVtjjdgbwus"
                                },
                                {
                                    "IncidentTypeLNID": 905,
                                    "IncidentTypeID": 199,
                                    "Name": "XcylyaKetnnnwJzvz"
                                }
                            ],
                            "IncidentUnitData": [
                                {
                                    "IncidentUnitLNID": 75,
                                    "IncidentUnitID": 468,
                                    "UnitName": "TgwokvphjneHkvrcozhnrpMmjluqyqwq"
                                },
                                {
                                    "IncidentUnitLNID": 829,
                                    "IncidentUnitID": 622,
                                    "UnitName": "WzxmhqbXydowccgtJkdzrhdowptWcwrcTehssykrfhh"
                                }
                            ],
                            "CriticalityID": "Zhcwoucmwx",
                            "CriticalityName": 751,
                            "StatusID": 572,
                            "StatusName": "WohVmbvoooghhGcnzskk",
                            "NoOfRecommendation": 10,
                            "Open": 2,
                            "ClaimClosed": 6,
                            "Closed": 2
                        }
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            })
        } else {
            this.post("/operational-risk-management/incidents/get-incidents", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.processIncidents(res)
                   
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    indexIncidents(docs: any) {
        let Index = 1;
        docs.forEach((data: any) => {
            data.Index = Index;
            data.editMode = false;
            Index++;
        });
        return docs
    }


    
    processIncidents(response: any): void {
        console.log('response ---')
        this.incidents = response.result.incidents
        this.inAppRCSA = response.result.RCSAInApp
        this.inAppKRI = response.result.KRIInApp
        this.inAppRA = response.result.RAInApp
        this.inAppINC = response.result.INCInApp 
        let index:any = 0;
        
        this.incidents.forEach((row: any) => {
            row.Index = ++index
            // row.IncidentDate = this._datePipe.transform(row.IncidentDate, 'dd MMMM yyyy');
            // row.ReportingDate = this._datePipe.transform(row.ReportingDate, 'dd MMMM yyyy');
            row.IncidentDate  = this.utils.formatedDate(row.IncidentDate)
            row.ReportingDate = this.utils.formatedDate(row.ReportingDate)
        });
        this.gotIncidents.next(true)
        let inAppResp :any [] = [...this.inAppRCSA,...this.inAppINC,...this.inAppRA,...this.inAppKRI];
        let inAppReadCount:any = inAppResp.filter((ob: any) => ob.IsRead === false).length;
        localStorage.setItem('inAppReadCountLength', inAppReadCount)

    }



    getIncident(incidentID: number): any {
        let response = {}
        if (environment.dummyData) {
            this.processIncident({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "incidentData": [
                        {
                            "IncidentCode": "DqoyNfbp",
                            "IncidentID": 898,
                            "GroupID": 383,
                            "GroupName": "CwepiftiAksLfrwntlAxWmhaxsaygxv",
                            "UnitID": 637,
                            "UnitName": "CwcwdtvIunhjzmzPxnxafdcly",
                            "UserGUID": "KaatzPysekkcvApjdvtxdr",
                            "LocationName": 622,
                            "LocationTypeID": 998,
                            "IncidentTeam": "BqezaPrnbpVosjwyw",
                            "IncidentDate": "2022-11-18T12:59:00.000Z",
                            "MobileNumber": 637,
                            "EmailID": "OxxzyreqiheIozyfdzuqaRf",
                            "Description": "MzwhukmDhgqk",
                            "Recommendation": "Go",
                            "Action": "SfngzlmhLe",
                            "IncidentSourceID": 183,
                            "LossAmount": 407,
                            "ReportingDate": "2022-11-18T12:59:00.000Z",
                            "AggPartyDetails": "PzgDzaehiuxDkiputszLyqexaxyd",
                            "CriticalityID": 954,
                            "RiskLossCategoryIDs": "BytgoKr",
                            "EvidenceIDs": "ErnehoapwCjgaLpvrlyqfrwWdbw",
                            "StatusID": 129,
                            "StatusName": "Submitted by Reportee",
                            "StatusCode": "1",
                            "WorkflowActionBy": "Reviewer",
                            "RiskApproverUserName": "BkOfzlimigfbrAilWipop",
                            "RiskApprovalDate": "YhBjm",
                            "RiskClosureUserName": "BjnvyxluCkeglwYxpbTdhztsotq",
                            "RiskClosureDate": "UcFsd",
                            "Comment": "EtxtxurthGiuigqct",
                            "RCA": "TtiySrfonlgNscgtqyugjmBrfhvxvt",
                            "IsReviewed": 1,
                            "IsApproved": 1
                        }
                    ],
                    "incidentTypesData": [
                        {
                            "TypeID": 100,
                            "Name": "Uzbhjgyqvnr"
                        },
                        {
                            "TypeID": 746,
                            "Name": "QzfqftboceCsmjgbFztiamblwnuTxcZoqjdu"
                        }
                    ],
                    "impactedUnitsData": [
                        {
                            "UnitID": 165,
                            "Name": "QhieyubQdztvyy",
                            "LossValue": 990
                        },
                        {
                            "UnitID": 4,
                            "Name": "Ixtzd",
                            "LossValue": 616
                        }
                    ],
                    "incidentWorkflowActionData": [
                        {
                            "StatusID": 818,
                            "StatusCode": "CODE-2",
                            "StatusName": "kjkjfdf",
                            "NextWorkflowAction": "Reject Review"
                        },
                        {
                            "StatusID": 819,
                            "StatusCode": "CODE-2",
                            "StatusName": "djfdlkfj",
                            "NextWorkflowAction": "Submit to Approver"
                        }
                    ],
                    "auditTrail": [
                        {
                            "CreatedDate": "2022-11-18T12:59:00.000Z",
                            "Code": "BafbMmgOyckehdvjcCxyMqzyp",
                            "Action": "LpvpThtosphusur",
                            "FullName": "LjmueYwfgtXwsoanbbm",
                            "Comment": "DmgdyahpBqoxnrqBhbvtozmsyjEwjpvpzmhhl"
                        },
                        {
                            "CreatedDate": "2022-11-18T12:59:00.000Z",
                            "Code": "IkwfIfnhjqAjqYibBokcpcpwob",
                            "Action": "MwvbmrRgyyvbwvsQiuzwfr",
                            "FullName": "TlHjVptdlqxrDmlkg",
                            "Comment": "QeqsvrtCwgbsCfmoygbhcyPgxse"
                        }
                    ],
                    "recommendations": [
                        {
                            "RecommendationID": 875,
                            "IncidentID": 362,
                            "RecommendationCode": "UlvCfqnhhufImcbgjj",
                            "Description": "OkUnNugmihcqeohAhngtqtaVoh",
                            "UnitID": 709,
                            "UnitName": "DaktrpdJmyDjkjuueitzZtlu",
                            "TargetDate": "2022-11-18T12:59:00.000Z",
                            "IsApproved": 1,
                            "StatusID": 704,
                            "StatusCode": "TxmgnmqjbEjokxmltgps",
                            "StatusName": "Hyjhmqwsv",
                            "Action": "KiwlmxhvMvrXnhhlvp"
                        },
                        {
                            "RecommendationID": 172,
                            "IncidentID": 521,
                            "RecommendationCode": "BgncozraiqNkgxerrzhzmJfmmmbdyntnYgwabyyvdeGexvjsac",
                            "Description": "JvwaliluglfTo",
                            "UnitID": 285,
                            "UnitName": "Eidqnlp",
                            "TargetDate": "2022-11-18T12:59:00.000Z",
                            "IsApproved": 1,
                            "StatusID": 150,
                            "StatusCode": "UomdgkoPyyxmavlwrqQfhyidl",
                            "StatusName": "BbtPoLdJmaxxeinhsNhcpbt",
                            "Action": "SduhuoaxbKjyvsb"
                        }
                    ],
                    "incidentEvidences": [
                        {
                            "EvidenceID": 187,
                            "IncidentID": 685,
                            "OriginalFileName": "DmyYcsoaOzidaUgnjmaVstzoafzyh",
                            "FileType": "YoojgejkDoivomzbTrvcqzhvfWbxcwakcmvcFhvbzoaswp",
                            "Remark": "Xpcocjald"
                        },
                        {
                            "EvidenceID": 333,
                            "IncidentID": 430,
                            "OriginalFileName": "Buvgvysm",
                            "FileType": "OcsuyRcnegzkojdVspgplymzJloei",
                            "Remark": "GttuklhlBncrongwo"
                        }
                    ],
                    "rcaEvidences": [
                        {
                            "EvidenceID": 790,
                            "IncidentID": 885,
                            "OriginalFileName": "XlghqVbncryyJfh",
                            "FileType": "LsxSbuxCjonxhxarKlLpap",
                            "Remarks": "LrlOsykefXzdmkYg"
                        },
                        {
                            "EvidenceID": 124,
                            "IncidentID": 584,
                            "OriginalFileName": "FgCmqfigaeMwqpunxzvy",
                            "FileType": "LnNbEbnzfleOrpn",
                            "Remarks": "PcqDliwnguskrmOgwokbnwrw"
                        }
                    ],
                    "recommendationEvidences": [
                        {
                            "EvidenceID": 735,
                            "RecommendationID": 731,
                            "OriginalFileName": "Gjeoqdtuvs",
                            "FileType": "NqenKivwKkruRgcmq",
                            "CreatedDate": "2022-11-18T12:59:00.000Z"
                        },
                        {
                            "EvidenceID": 198,
                            "RecommendationID": 615,
                            "OriginalFileName": "Rbosifnb",
                            "FileType": "GexEzfOqw",
                            "CreatedDate": "2022-11-18T12:59:00.000Z"
                        }
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            })
        } else {
            let data = { "incidentID": incidentID }
            this.post("/operational-risk-management/incidents/get-incident", { "data": data }).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.processIncident(res)
                    this.getIncidentInfo(true)
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    setIncident(data: any): any {
        this.post("/operational-risk-management/incidents/set-incident", { data }).subscribe(res => {
            if (res.success == 1) {
                this.processIncident(res, true);
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    setIncidentReview(data: any): any {
        this.post("/operational-risk-management/incidents/set-incident-review", { data }).subscribe(res => {
            if (res.success == 1) {
                this.processIncident(res);
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    processIncident(response: any, populate: boolean = false): void {
        this.incident = response.result.incidentData[0]
        this.incidentTypes = response.result.incidentTypesData;
        this.incidentSources = response.result.incidentSources;
        this.incidentCriticalities = response.result.incidentCriticalities;
        this.riskLossCategories = response.result.riskLossCategory;
        this.usersGUIDS = response.result.users;
        this.impactedUnits = response.result.impactedUnitsData;
        this.workflowActions = response.result.incidentWorkflowActionData.map((ele: any) => {
            if (ele.NextWorkflowAction === "Reject Review") {
                return { ...ele, NextWorkflowAction: "Return to Update" };
            } else {
                return ele;
            }
        });

        this.workflowCheckerActions = response.result.incidentWorkflowActionCheckerData.map((ele: any) => {
            if (ele.NextWorkflowAction === "Reject Review") {
                return { ...ele, NextWorkflowAction: "Return to Update" };
            } else {
                return ele;
            }
        });

        this.auditTrail = response.result.auditTrail
        this.recommendations = response.result.recommendations
        this.incEvidences = new MatTableDataSource(response.result.incidentEvidences)
        this.rcaEvidences = new MatTableDataSource(response.result.rcaEvidences)
        this.recEvidences = response.result.recommendationEvidences
        console.log("isReviewEditable",this.isReviewEditable)
        this.isIncidentEditable = false
        this.isReviewEditable = false
        this.isReviewInEdit = false
        this.recommendations.forEach(reco => {
            reco.OldAction = reco.Action || ""
            reco.OldFiles = this.recEvidences.filter(evdn => evdn.RecommendationID == reco.RecommendationID).map(evdn => evdn.EvidenceID).toString()
        })
        if (populate)
            this.populateIncident();
        this.gotIncident.next(true)
    }

    formatIncidentTypesData(data: any) {
        data.map((type: any) => type.checked = false);
        return data;
    }

    cleanIncident(): void {
        this.incident = { "Reportee": true }
        this.auditTrail = []
        this.incidentTypes = []
        this.impactedUnits = []
        this.workflowActions = []
        this.recommendations = []
        this.riskLossCategories = []
        this.isIncidentEditable = true
        this.isReviewEditable = false
        this.isReviewInEdit = false
        this.incEvidences = new MatTableDataSource()
        this.rcaEvidences = new MatTableDataSource()
        this.recEvidences = []
    }

    getIncidentInfo(populate: boolean = false): void {
        if (environment.dummyData) {
            this.processIncidentInfo({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "groups": [
                        {
                            "GroupID": 732,
                            "Name": "Qqozq"
                        },
                        {
                            "GroupID": 548,
                            "Name": "NvVyzjJzwhstxnvrn"
                        }
                    ],
                    "units": [
                        {
                            "UnitID": 273,
                            "Name": "VtuvmvyJwqecjubZvotkj"
                        },
                        {
                            "UnitID": 227,
                            "Name": "BuwxjwvrMtgcfxnvkxcWpwrorpqy"
                        }
                    ],
                    "locationTypes": [
                        {
                            "LocationTypeID": 893,
                            "Name": "QaXkcxfziliYhmwUtvzlti"
                        },
                        {
                            "LocationTypeID": 392,
                            "Name": "TspzdcfnsEpa"
                        }
                    ],
                    "incidentTypes": [
                        {
                            "TypeID": 235,
                            "Name": "YzwCg"
                        },
                        {
                            "TypeID": 616,
                            "Name": "VgHtpjwfxYr"
                        }
                    ],
                    "incidentSources": [
                        {
                            "SourceID": 382,
                            "Name": "XstxxjBdyycasipaDmsbzelgotdDrxpmDdt"
                        },
                        {
                            "SourceID": 952,
                            "Name": "MzIdncqKjzoqXalxwj"
                        }
                    ],
                    "incidentCriticalities": [
                        {
                            "CriticalityID": 647,
                            "Name": "Imjwjbo"
                        },
                        {
                            "CriticalityID": 554,
                            "Name": "Xsfsit"
                        }
                    ],
                    "lossCatagories": [
                        {
                            "CategoryID": 773,
                            "Name": "QsszjuuBzbjwjzoMzcizasczSoktuktSekkririarh"
                        },
                        {
                            "CategoryID": 597,
                            "Name": "VbgzqxnLuiklhfdccCrtdzhh"
                        }
                    ],
                    "users": [
                        {
                            "UserGUID": "QsszjuuB-zbjwjzoMzci-zasczSoktuktSekkri-riarh",
                            "FullName": "Harish Kumar Garg"
                        },
                        {
                            "UserGUID": "QsszjuuB-zbjwjzoMzci-zasczSoktuktSekkri-riarh",
                            "FullName": "Harish Kumar Garg"
                        }
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            })
        } else {
            this.post("/operational-risk-management/incidents/get-incident-info", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.processIncidentInfo(res, populate);
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    processIncidentInfo(response: any, populate: boolean = false): void {
        this.info = this.getSelectedIncidentTypes(response.result);
        this.gotInfo.next(true)
        if (populate)
            this.populateIncident();
    }

    populateIncident(): void {
        this.incident.ReporteeUser = this.info?.users.filter((obj: any) => obj.UserGUID == this.incident.UserGUID).map((ele: any) => ele.FullName);
        this.incident.Identification = this.info.incidentSources.filter((obj: any) => obj.SourceID == this.incident.IncidentSourceID).map((ele: any) => ele.Name);
        console.log('this.incident.Identification: ', this.incident.Identification);
        this.incident.Criticality = this.info.incidentCriticalities.filter((obj: any) => obj.CriticalityID == this.incident.CriticalityID).map((ele: any) => ele.Name);
        console.log('this.incident.Criticality: ', this.incident.Criticality);

        // this.getSelectedIncidentTypes();
        // this.getEventLossCats();
    }

    getSelectedIncidentTypes(data: any): void {
        if (this.incidentTypes) {
            data.incidentTypes.map((type: any) => {
                this.incidentTypes.map((incType: any) => {
                    if (incType.TypeID === type.TypeID) {
                        type.checked = true;
                    }
                });
            })
        } else {
            data.incidentTypes.map((type: any) => {
                type.checked = false;
            })
        }
        return this.getEventLossCats(data);
    }

    getEventLossCats(data: any) {
        if (this.riskLossCategories) {
            data.lossCatagories.map((type: any) => {
                this.riskLossCategories.map((riskLoss: any) => {
                    if (riskLoss.RiskLossCategoryID === type.CategoryID) {
                        type.checked = true;
                    }
                })
            })
        } else {
            data.lossCatagories.map((type: any) => {
                type.checked = false;
            })
        }
        return data;
    }

    setIncidentStatus(data: any): void {
        this.post("/operational-risk-management/incidents/set-incident-status", { data }).subscribe(res => {
            if (res.success == 1) {
                this.processIncident(res,true);
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage);
            }
        });
    }

    setRecommendationAction(data: any): void {
        this.post("/operational-risk-management/incidents/set-recommendation-action", { data }).subscribe(res => {
            if (res.success == 1) {
                this.processIncident(res);
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage);
            }
        });
    }

    setRecommendationStatus(data: any): void {
        this.post("/operational-risk-management/incidents/set-recommendation-status", { data }).subscribe(res => {
            if (res.success == 1) {
                this.processIncident(res);
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage);
            }
        });
    }

    uploadIncidentEvidence(data: FormData, remarks: string) {
        this.upload("/operational-risk-management/incidents/upload-incident-evidence", data, remarks).subscribe(res => {
            if (res.success == 1) {
                let evd = res.result.fileData[0]
                this.incEvidences.data.push({ "EvidenceID": evd.EvidenceID, "OriginalFileName": evd.OriginalFileName, "Remark": evd.Remark, "CreatedDate": "" });
                this.incEvidences.data = [...this.incEvidences.data];
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage);
            }
        });
    }

    uploadRCAEvidence(data: FormData, remarks: string) {
        this.upload("/operational-risk-management/incidents/upload-rca-evidence", data, remarks).subscribe(res => {
            if (res.success == 1) {
                let evd = res.result.fileData[0]
                this.rcaEvidences.data.push({ "EvidenceID": evd.EvidenceID, "OriginalFileName": evd.OriginalFileName, "Remark": evd.Remark, "CreatedDate": "" });
                this.rcaEvidences.data = [...this.rcaEvidences.data];
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage);
            }
        });
    }

    uploadRecommendationEvidence(data: FormData) {
        return this.upload("/operational-risk-management/incidents/upload-recommendation-evidence", data)
    }

    downloadFile(row: any, eviName: any) {
        let data = { "evidenceID": row.EvidenceID }
        eviName = eviName.toLowerCase();
        this.post(`/operational-risk-management/incidents/download-${eviName}-evidence`, { data }).subscribe(res => {
            if (res.success == 1) {
                const FileType = res["result"].fileData[0].FileContent.type;
                const TYPED_ARRAY = new Uint8Array(res.result.fileData[0].FileContent.data);
                const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
                    return data + String.fromCharCode(byte);
                }, ''));
                const fileMetaType = res.FileType;
                const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
                const blob = new Blob([blobData], { type: fileMetaType });
                // [".xlsx", ".pdf",".docx",".jpeg"],
                // saveAs(blob, row.OriginalFileName.split('.')[0] + fileMetaType);
                saveAs(blob, res.result.fileData[0].OriginalFileName)
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage);
            }
        });
    }

    convertBase64ToBlobData(base64Data: any, contentType: string) {
        contentType = contentType || '';
        let sliceSize = 1024;
        let byteCharacters = window.atob(decodeURIComponent(base64Data));
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);

            let bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }


    // deleteFile(row: any, eviName: any) {
    //     let data = { "evidenceID": row.EvidenceID }
    //     this.post(`/operational-risk-management/incidents/delete-${eviName}-evidence`, { data }).subscribe(res => {
    //         if (res.success == 1) {
    //             if (eviName == 'Incident') {
    //                 const index = this.incEvidences.data.indexOf(row.EvidenceID);
    //                 this.incEvidences.data.splice(index, 1);
    //                 this.incEvidences.data = [...this.incEvidences.data];
    //             } else if (eviName == 'RCA') {
    //                 const index = this.rcaEvidences.data.indexOf(row.EvidenceID);
    //                 this.rcaEvidences.data.splice(index, 1);
    //                 this.rcaEvidences.data = [...this.rcaEvidences.data];
    //             } else {
    //                 const index = this.recEvidences.indexOf(row.EvidenceID);
    //                 this.recEvidences.splice(index, 1);
    //                 this.recEvidences = [...this.recEvidences];
    //             }
    //         } else {
    //             // if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
    //             //     this.utils.relogin(this._document);
    //             // else
    //             //     this.popupInfo("Unsuccessful", res.error.errorMessage);
    //         }
    //     });
    // }
}
