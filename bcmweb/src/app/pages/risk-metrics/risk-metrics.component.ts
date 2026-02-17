import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

@Component({
    selector: 'app-risk-metrics',
    templateUrl: './risk-metrics.component.html',
    styleUrls: ['./risk-metrics.component.scss']
})
export class RiskMetricsComponent implements OnInit {
    isMax=false
    isHistory:boolean = false
    mode: string = '';
    role: string = '';
    notpart: string = '';
    container: any[] = [];
    apidata: any;
    dumData: any[] = []
    reports: any[] = []
    colors: any[] = []
    frameworkName = ""
    frameworkEndDate = ""
    frameworkStartDate : any
    frameworkRemainingDays = ""
    preheader: any;
    remainderDate:any
    CollectionScheduleID = ""
    chartData: any = {
        "total": 0,
        "reviewed": 0,
        "notstarted": 0,
        "submitted": 0,
        "notsubmitted":0,
        "inprogress": 0,
        "completed": 0,
        "approved": 0,
        "rejected": 0
    }
    currDate: any;
    assessmentFlag: boolean = false
    convertedDate: any;
    saveerror: string = "";
    remainderEnable: boolean = false
    buttondisable: boolean = true
    statusdata: any;
    riskMetrics: any;
    completed: any;
    dateComparisonResult: boolean = false;
    completedAssessmentResult: boolean = false;
    isReviewerUser:boolean = false;
    isMakerUser:boolean = false;
    isReviewerAsUser : boolean = false;
    isReviewerAsUnit : boolean = false;
    constructor(
        // private dialogRef: MatDialogRef<RiskMetricsComponent>,
        private service: RiskAssessmentService,
        public utils: UtilsService,
        public dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any,
        @Optional() @Inject(MAT_DIALOG_DATA) public history: any,
    ) {
        if(history && history.mode == 'history')
            this.isHistory = true
    }

    ngOnInit(): void {
        localStorage.removeItem('RAChartStatus')

        this.mode = localStorage.getItem('risk-assessments') || ""
        if(this.isHistory)
            this.mode = "history"
        this.role = localStorage.getItem('rorm') || ""
        this.getRiskMetricUnits();
        localStorage.setItem('SubmitRiskPanelState', JSON.stringify([]));
        localStorage.setItem('PanelStateReviewer', JSON.stringify([]));
        // this.minimize()
    }

    getRiskMetricUnits() {
        if (environment.dummyData) {
            this.apidata = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "frameworkData": [{
                        "Name": "Framework test 1",
                        "CollectionScheduleID": "24",
                        "StartDate" : "2022-07-20T13:23:28.490Z",
                        "EndDate" : "2022-07-20T13:23:28.490Z",
                        "RemainingDays":0
                    }],
                    "previousScoringHeader": [
                        {
                            "Caption": "Q2-21",
                            "Year": "2021",
                            "Quater": "2"
                        },
                        {
                            "Caption": "Q3-21",
                            "Year": "2021",
                            "Quater": "3"
                        },
                        {
                            "Caption": "Q4-21",
                            "Year": "2021",
                            "Quater": "4"
                        }
                    ],
                    "riskMetricData": [
                        {
                            "Risk":"Enterprise Wide Risk",
                            "NodeID": "25",
                            "CaptionData": "Leverage (Debt / Equity)",
                            "Limit1": "<3",
                            "Limit2": ">3 and <4",
                            "Limit3": ">5",
                            "MetricScore": "3.8",
                            "Remarks": "xyz",
                            "ActionPlan": "asdasd",
                            "UnitID": "10",
                            "UnitName": "Management",
                            "Status": "2",
                            "StatusName": "In Progress",
                            "IsReviewer" : "0",
                            "IsMaker" : "1",
                            "CommentData": [
                                {
                                    "CommentBody": "sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam.",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                },
                                {
                                    "CommentBody": "dasdasdas",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                },
                                {
                                    "CommentBody": "dasdasdas",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                }
                            ],
                            "PreviousScoring": [
                                {
                                    "Year": "2021",
                                    "Quater": "2",
                                    "MetricScore": "3.1",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                },
                                {
                                    "Year": "2021",
                                    "Quater": "3",
                                    "MetricScore": "3.4",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                },
                                {
                                    "Year": "2021",
                                    "Quater": "4",
                                    "MetricScore": "3.2",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                }
                            ]
                        },
                        {
                            "NodeID": "25",
                            "CaptionData": "Leverage (Debt / Equity)",
                            "Limit1": "<3",
                            "Limit2": ">3 and <4",
                            "Limit3": ">5",
                            "MetricScore": "3.8",
                            "Remarks": "xyz",
                            "ActionPlan": "asdasd",
                            "UnitID": "10",
                            "UnitName": "Management",
                            "Status": "3",
                            "StatusName": "Submitted",
                            "IsReviewer" : "0",
                            "IsMaker" : "1",
                            "CommentData": [
                                {
                                    "CommentBody": "dasdasdas",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                },
                                {
                                    "CommentBody": "dasdasdas",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                },
                                {
                                    "CommentBody": "dasdasdas",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                }
                            ],
                            "PreviousScoring": [
                                {
                                    "Year": "2021",
                                    "Quater": "2",
                                    "MetricScore": "3.1",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                },
                                {
                                    "Year": "2021",
                                    "Quater": "3",
                                    "MetricScore": "3.4",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                },
                                {
                                    "Year": "2021",
                                    "Quater": "4",
                                    "MetricScore": "3.2",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                }
                            ]
                        },
                        {
                            "NodeID": "25",
                            "CaptionData": "Leverage (Debt / Equity)",
                            "Limit1": "<3",
                            "Limit2": ">3 and <4",
                            "Limit3": ">5",
                            "MetricScore": "3.8",
                            "Remarks": "xyz",
                            "ActionPlan": "asdasd",
                            "UnitID": "10",
                            "UnitName": "Management",
                            "Status": "2",
                            "StatusName": "In Progress",
                            "IsReviewer" : "0",
                            "IsMaker" : "1",
                            "CommentData": [
                                {
                                    "CommentBody": "dasdasdas",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                },
                                {
                                    "CommentBody": "dasdasdas",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                },
                                {
                                    "CommentBody": "dasdasdas",
                                    "CreatedDate": "2022-07-20T13:23:28.490Z",
                                    "CreatedBy": "Harish Garg"
                                }
                            ],
                            "PreviousScoring": [
                                {
                                    "Year": "2021",
                                    "Quater": "2",
                                    "MetricScore": "3.1",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                },
                                {
                                    "Year": "2021",
                                    "Quater": "3",
                                    "MetricScore": "3.4",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                },
                                {
                                    "Year": "2021",
                                    "Quater": "4",
                                    "MetricScore": "3.2",
                                    "RiskMetricLevelID":2,
                                    "ColorCode":"#FF0034"
                                }
                            ]
                        }
                    ],
                    "riskReportData": [
                        {
                            "T0": true,
                            "T1": true,
                            "T2": true,
                            "RiskMetricLevelID": 3,
                            "IsEscalationMandatory": false,
                            "IsActionMandatory": true,
                            "ReportingStructureID": 6036
                        }
                    ]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            }

            this.process(this.apidata)
            this.container = this.filteringUnits(this.dumData)
            // console.log("container::", this.container)
        } else {
            if(this.mode == 'history') {
                this.service.getRiskAssessmentDetails(this.history.collectionScheduleID).subscribe(res => {
                    next:
                    this.process(res)
                    this.container = this.filteringUnits(this.dumData)
                })
            } else if (this.mode == "submit") {
              this.service.getRiskMetricsMaker().subscribe(res => {
                    next:
                    this.process(res)
                    this.container = this.filteringUnits(this.dumData)
                    // console.log(this.container)
                })
            } else {
               this.service.getRiskMetrics().subscribe(res => {
                    next:
                    this.process(res)
                    this.container = this.filteringUnits(this.dumData)
                })
            }
        }
    }

    filteringUnits(data: any): any {
        let list = []
        let set = new Set()
        for (let i of data) {
            set.add(i.UnitID)
        }
        for (let i of set) {
            const seperate = data.filter(((d: { UnitID: unknown; }) => d.UnitID == i))
            list.push(seperate)
        }
        if(list.length==0)
            this.notpart = "No Data Found"
            // console.log(list)
        return list
    }

    process(data: any): void {
        this.notpart = ""
        if (data.success == 1) {
            this.chartData = {
                "total": 0,
                "reviewed": 0,
                "notstarted": 0,
                "submitted": 0,
                "notsubmitted":0,
                "inprogress": 0,
                "completed": 0,
                "approved": 0,
                "rejected": 0
            }
            if (data.result.riskMetricData.length > 0) {
                this.preheader  = data.result.previousScoringHeader;
                this.reports    = data.result.riskReportData
                this.colors     = data.result.riskMetricLevelsData
                let docs        = data.result.riskMetricData;
                this.chartData.submitted = data.result.riskMetricData.filter((x: any) => x.Status === 3).length;
                this.completed  = data.result.riskMetricData.filter((x: any) => x.Status === 5).length;

                this.isMakerUser     = docs.every((ob:any) => ob.IsMaker === 1) && docs.some((ob:any) =>  ob.Status > 1);
                this.isReviewerUser  = docs.every((ob:any) => ob.IsReviewer === 1);
              
                docs.forEach((metric: any) => {
                    this.chartData.total++
                    if (metric.IsReviewed) this.chartData.reviewed++
                    if ([null, 1].includes(metric.Status)) this.chartData.notstarted++
                    if ((metric.Status === 5 || metric.Status === 4) && metric.IsReviewed === false) {
                        this.chartData.notsubmitted++;
                    }
                    if (metric.Status == 2) this.chartData.inprogress++
                    if (metric.Status == 5 && metric.IsReviewed == 1) this.chartData.approved++
                    if (metric.Status == 4 && metric.IsReviewed == 1) this.chartData.rejected++

                    let arr = metric.PreviousScoring

                    metric.PreviousScoring = [
                        {"MetricScore":"", "RiskMetricLevel":0, "ColorCode":""},
                        {"MetricScore":"", "RiskMetricLevel":0, "ColorCode":""},
                        {"MetricScore":"", "RiskMetricLevel":0, "ColorCode":""}
                    ]
                    arr.forEach((score:any) => {
                        let idx = -1;
                        for(let i=0; i<this.preheader.length; i++) {
                            if(score.Year == this.preheader[i].year && score.Quater == this.preheader[i].Quarter) {
                                idx = i;
                                break;
                            }
                        }
                        if(idx != -1) {
                            metric.PreviousScoring[idx].MetricScore = score.MetricScore
                            metric.PreviousScoring[idx].ColorCode = score.ColorCode
                            metric.PreviousScoring[idx].RiskMetricLevel = score.RiskMetricLevel
                        }
                    });
                });
                this.dumData = docs
                this.frameworkName      = data.result.frameworkData[0].Name
                this.frameworkEndDate   = data.result.frameworkData[0].EndDate
                this.frameworkStartDate = data.result.frameworkData[0].StartDate
                this.remainderDate      = data.result.riskMetricData[0].reminderDate
                this.statusdata         = data.result.riskMetricData[0].StatusName
                this.frameworkRemainingDays     = data.result.frameworkData[0].RemainingDays
                this.CollectionScheduleID       = data.result.frameworkData[0].CollectionScheduleID
                this.isReviewerAsUser  = data.result.frameworkData[0].UnitID == null ? true : false;
                this.isReviewerAsUnit  = data.result.frameworkData[0].UnitID != null ? true : false;

                this.currDate          = new Date()
                this.convertedDate     = new Date(this.currDate).toISOString()

                if(this.frameworkStartDate > this.convertedDate ){
                    this.assessmentFlag = true
                }
            }
            this.riskMetrics = data.result.riskMetricData
   
            if(this.riskMetrics.length == 0) {
                this.buttondisable = false;
            } else {
                let date1 = new Date().toDateString();
                let date2 = new Date(this.remainderDate).toDateString();
                let currentDate = new Date(date1);
                let reminderDate = new Date(date2)
                this.dateComparisonResult = currentDate >= reminderDate;
                this.completedAssessmentResult = this.chartData.total == this.completed;
                console.log("date value", reminderDate, currentDate);
                console.log("total value", this.chartData.total, this.completed)
                if((currentDate >= reminderDate) && (this.chartData.total != this.completed)) {
                    console.log("insdie")
                    this.buttondisable = false;
                }
            } 
            if((this.remainderDate <= this.frameworkEndDate || this.statusdata == "Scheduled" || this.statusdata == "In Progress" || this.statusdata == "Rejected") && (this.riskMetrics[0].IsReviewer == 1)){
                this.remainderEnable = true
            }
           
            // let selectedCategory:any = localStorage.getItem('RAChartStatus')?.toString()
            // this.filterByStatus(selectedCategory);
            console.log(' this.chartData process metrics: '+  JSON.stringify(this.chartData))
        } else {
            if(data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    refresh(response: any): void {
        console.log("inside refresh");
        // console.log(response);
        this.process(response);
        this.container = this.filteringUnits(this.dumData);
        this.getRiskMetricUnits();
    }

    filterByStatus(category: string) {
        if(category == 'Reset') {
            this.container = this.filteringUnits(this.dumData);
        } else if(category == 'Review Pending') {            
            let ReviewPending:any = this.dumData.filter((item:any) => item.IsReviewed === false && (item.Status == 3 || item.Status == 4 || item.Status == 5))
            this.container = this.filteringUnits(ReviewPending);
        } else {
            console.log('else -metric')
            if(category == 'Reviewed') {   
                let ReviewedArr :any = this.dumData.filter((item:any) => item.IsReviewed === true)
                this.container = this.filteringUnits(ReviewedArr);
            }else if(category == 'In Progress') {
                let InProgressArr :any =this.dumData.filter((item:any) => item.Status == 2)
                this.container = this.filteringUnits(InProgressArr);
            } else if(category == 'Submitted') {
                let submittedArr:any =this.dumData.filter((item:any) => item.Status == 3)
                this.container = this.filteringUnits(submittedArr);
            } else if(category == 'Rejected') {
                let rejectedArr: any =this.dumData.filter((item:any) => item.Status == 4);
                this.container = this.filteringUnits(rejectedArr);
            } 
            else {
                this.container = this.filteringUnits(this.dumData.filter((item:any) => item.StatusName?.trim() === category));
            }
        }

        this.container = this.container.filter(cont => cont.length !== 0);
        this.notpart = ""
        if(this.container){
            if(this.container.length <= 0)
                this.notpart = "No Data Found"
        } else
            this.notpart = "No Data Found"
        // console.log("container after", JSON.stringify(this.container))
        
    }

    getSelectedCategory(category: string){
        console.log('✌️category --->', category);
        let selectedCategory :any =  localStorage.getItem('RAChartStatus')?.toString() ? localStorage.getItem('RAChartStatus')?.toString() : category
        console.log('✌️selectedCategory --->', selectedCategory);
        this.filterByStatus(selectedCategory);
    }

    daysRemains():string {
        let days = Number(this.frameworkRemainingDays)
        return days>=0?days+' Days Remaining':'Target Date Passed'
    }

    // maximize() {
    //     this.isMax = true;
    //     this.dialogRef.updateSize('100%', '100%');
    // }

    // minimize() {
    //     this.isMax = false;
    //     this.dialogRef.updateSize('93%', '90%');
    // }

     // start of mail reminder code
    sendMailReminder(data:any) {
        console.log("data",data)
        const confirm = this.dialog.open(ConfirmDialogComponent, {
        id: "InfoComponent",
        disableClose: true,
        minWidth: "300px",
        panelClass: "dark",
        data: {
            title: "Confirm Reminder",
            content: "Are you sure you want to send the reminder?"
        }
        });

        confirm.afterClosed().subscribe(result => {
        if (result) {
            this.service.getEmailReminderDataRA(data).subscribe(res => {
            next:
            if(res.success == 1) {
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
                else
                this.saveerror = res.error.errorMessage;
            }
            error:
            console.log("err::", "error");
            })
        }
        })
    }
    // end
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
            // this.getPageLoad();
            confirm.close();
        }, timeout)
        });
    }

    formatReminderDate() {
        let message = '';
        if(this.dateComparisonResult === false) {
            let date = new Date(this.remainderDate);
            message = `Button will be enabled on ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        } else if(this.completedAssessmentResult === true) {
            message = `Button is disabled since Assessment is completed`
        }
        return message; 
    }
}
