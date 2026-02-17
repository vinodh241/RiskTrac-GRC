import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CommentsComponent } from '../comments/comments.component';
import { FileUploader } from 'ng2-file-upload';
import { ValidExtension } from 'src/app/core-shared/file-upload/evidence-files/evidence-file.component';

@Component({
    selector: 'app-risk-unit-maker',
    templateUrl: './risk-unit-maker.component.html',
    styleUrls: ['./risk-unit-maker.component.scss']
})
export class RiskUnitMakerComponent implements OnInit {
    @Input() reports: any[] = [];
    @Input() preheader: any[] = [];
    @Input() source: any;
    @Input() colors: any;
    @Input() orgdata: any;
    @Input() collectionScheduleID: any;
    @Input() convertedDate: any
    @Input() frameworkStartDate:any

    @Output() refresh: EventEmitter<any> = new EventEmitter<any[]>();
    @Output() selectedCategory = new EventEmitter<string>();

    role: string = "";
    percentage: number = 50;
    panelOpenState: boolean = false;
    panelNodeId: any = '';
    isFileUploadChanged: boolean = false;
    reviewed = 0;
    notstarted = 0;
    submitted = 0;
    inprogress = 0;
    completed = 0;
    notsubmitted = 0;
    approved = 0;
    rejected = 0;
    completedPercent: string = '0';

    displayedColumns: string[] = ['level', 'q3', 'risk-limit', 'score', 'remark', 'action', 'comments'];

    uploadFilename: any;
    uploadFile: FormData = new FormData();
    filename: any = '';
    invalidfile: boolean = false;
    invalidfilesize = false;
    uploaderror: string = "";
    isUploaddisable = false
    assessmentFlag : boolean = false

    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });
    isErrorScore: boolean = false;
    errorScore: any;

    constructor(
        public dialog: MatDialog,
        public utils: UtilsService,
        private riskAssessmentservice: RiskAssessmentService,
        private router: Router,
        @Inject(DOCUMENT) private _document: any
    ) { }

    ngOnInit(): void {
        // localStorage.setItem('SubmitRiskPanelState', JSON.stringify([]));
        let selectedStatus = localStorage.getItem('RAChartStatus')?.toString() || ''

        this.source = selectedStatus != '' && ['In Progress', 'Submitted', 'Rejected'].includes(selectedStatus)
                    ? this.source.filter((x: any) => x.StatusName.trim() == selectedStatus.trim())
                    : selectedStatus == 'Not Started'
                    ? this.source.filter((item: any) => [null, 1].includes(item.Status))
                    : this.source;
        if(this.source.length) {
            if(this.frameworkStartDate > this.convertedDate) {
                this.assessmentFlag = true
            }
            this.getColorCodes();
            this.panelOpenState = this.getCurrentState(this.source[0].NodeID);
            console.log('✌️ this.panelOpenState --->',  this.panelOpenState);
            this.role = localStorage.getItem("rorm") || "XX";
            this.source.forEach((metric: any) => {
                if (metric.CommentData)
                    metric.Comment = metric.CommentData.length > 0 ? metric.CommentData[0].CommentBody : "-"
                metric.MetricScore = metric.MetricScore != null ? parseFloat(metric.MetricScore) : metric.MetricScore;
    
                // metric.MetricScore = metric.MetricScore != null ? parseInt(metric.MetricScore, 10) : metric.MetricScore;
                //Remember Old Data
                metric.MetricScoreOld = metric.MetricScore
                metric.evidencesOld = metric.evidences && metric.evidences.length > 0 ? (metric.evidences.map((ele: any) => ele.EvidenceID)).join() : '';
                metric.RemarksOld = metric.Remarks
                metric.ActionPlanOld = metric.ActionPlan
    
    
                if ([2, 3, 5].includes(metric.Status) || [false].includes(metric.IsReviewed)) this.completed++
    
                if (metric.IsReviewed) this.reviewed++
                if ([null, 1].includes(metric.Status)) this.notstarted++
                if (metric.Status == 3) this.submitted++
                if (metric.Status == 2) this.inprogress++
                if ((metric.Status === 5 || metric.Status === 4) && metric.IsReviewed === 0) {
                    this.notsubmitted++;
                  }
                if (metric.Status == 5) this.approved++
                if (metric.Status == 4) this.rejected++
                metric.isOpened = false;
            });
            this.completedPercent = ((this.completed) * 100 / this.source.length).toFixed(2);
            this.completedPercent = this.completedPercent.replace(/\.?0+$/, '');
            this.panelNodeId = localStorage.getItem('SubmitRiskPanelState');
        }   
    }
    getColorCodes() {
        this.source.map((x: any) => {
            x['colorCode1'] = parseFloat(x.Limit1.split(' ')[1]);
            x['colorCode2'] = parseFloat(x.Limit3.split(' ')[1]);
        })
    }

    setOpenState(nodeId: string) {
        let panelState = localStorage.getItem('SubmitRiskPanelState');
        if (panelState) {
            let prentPannelState = JSON.parse(panelState);
            if (prentPannelState) {
                prentPannelState.push(nodeId);
                localStorage.setItem('SubmitRiskPanelState', JSON.stringify(prentPannelState));
            }
            else {
                localStorage.setItem('SubmitRiskPanelState', JSON.stringify([]));
            }
        }
        else {
            var openedList = [];
            openedList.push(nodeId);
            localStorage.setItem('SubmitRiskPanelState', JSON.stringify(openedList));
        }
    }

    setCloseState(nodeId: string) {
        let panelState = localStorage.getItem('SubmitRiskPanelState');
        if (panelState) {
            let presentPanelState = JSON.parse(panelState);
            presentPanelState = [...new Set(presentPanelState)];
            let index = presentPanelState.indexOf(nodeId);
            if (index != null) {
                presentPanelState.splice(index, 1);
                localStorage.setItem('SubmitRiskPanelState', JSON.stringify(presentPanelState));
            }
        }
    }

    getCurrentState(nodeId: string) {
        var panelState = localStorage.getItem('SubmitRiskPanelState');
        var panelPresentState = false;
        if (panelState) {
            var list = JSON.parse(panelState);
            for (let i = 0; i < list.length; i++) {
                if (list[i] == nodeId) {
                    panelPresentState = true;
                    break;
                }
            }
        }
        return panelPresentState;
    }

    reloadCurrentRoute() {
        const currentUrl = this.router.url
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl])
        });
    }

    getRiskMetricLevel(data: any): number {
        let level = 2
        let exp1 = data.Limit1
        if (data.Limit1.indexOf(">=") == -1 && data.Limit1.indexOf("<=") == -1 && data.Limit1.indexOf("=") >= 0)
            exp1 = data.Limit1.replace("=", "==")
        let exp3 = data.Limit3
        if (data.Limit3.indexOf(">=") == -1 && data.Limit3.indexOf("<=") == -1 && data.Limit3.indexOf("=") >= 0)
            exp3 = data.Limit3.replace("=", "==")
        if (eval(data.MetricScore + exp1)) level = 1
        else if (eval(data.MetricScore + exp3)) level = 3
        return level
    }

    isActionMandatory(data: any): boolean {
        // let skip    = false;
        // let result  = false;
        // this.reports.forEach((report: any) => {
        //     if (!skip) {
        //         let match = true
        //         if (report.T0) {
        //             if (report.RiskMetricLevel != this.getRiskMetricLevel(data))
        //                 match = false
        //         }
        //         if (report.T1) {
        //             if (data.PreviousScoring.length == 3) {
        //                 if (report.RiskMetricLevel != data.PreviousScoring[2].RiskMetricLevel)
        //                     match = false
        //             } else
        //                 match = false
        //         }
        //         if (report.T2) {
        //             if (data.PreviousScoring.length == 3) {
        //                 if (report.RiskMetricLevel != data.PreviousScoring[1].RiskMetricLevel)
        //                     match = false
        //             } else
        //                 match = false
        //         }
        //         if (match) {
        //             skip = true
        //             result = report.IsActionMandatory
        //         }
        //     }
        // })
        //since action plan is mandatory for AMLAK commented above code, if it is not jsut return result.
        return true; 
    }

    checkActionPlanMandatory(row: any): void {
        row.IsActionPlanMandatory = this.isActionMandatory(row) && this.isBlank(row.ActionPlan)
    }

    draft(source: any, collectionScheduleID: any): void {
        let count = 0
        let proceed = true
        this.isFileUploadChanged = false;
        source.forEach((row: any) => {
            let evidencesNew = (row?.evidences && row?.evidences.length > 0 ? (row?.evidences.map((ele: any) => ele.EvidenceID)).join() : '')
            if (
                this.isDifferent(row.MetricScore, row.MetricScoreOld)
                || this.isDifferent(row.Remarks, row.RemarksOld)
                || this.isDifferent(row.ActionPlan, row.ActionPlanOld)
                || this.isDifferent(evidencesNew, row.evidencesOld)
            ) {
                count++;
            }
        });


        if (proceed) {
            if (count > 0 && proceed) {
                this.riskAssessmentservice.setRiskMetricsDraft(source, collectionScheduleID).subscribe(res => {
                    next:
                    if (res.success == 1) {
                        // console.log("res.success",res)     
                                     
                        this.popupInfo("Success", "Draft Saved Successfully.", true, res);     
                    } else {
                        this.selectedCategory.emit('Reset');
                        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.popupInfo("Error", res.error.errorMessage, false, null);
                    }
                    error: (err: any) =>
                    console.log("err::", err);
                });
            } else
                this.popupInfo("Information", "Data was not changed", false, null);
        }
    }

    isDifferent(val1: any, val2: any): boolean {
        let v1 = ""
        let v2 = ""
        if (val1 === 0 || val1) v1 = val1.toString().trim()
        if (val2 === 0 || val2) v2 = val2.toString().trim()
        return v1 != v2
    }

    isBlank(val: any): boolean {
        return val ? val.trim() == "" : true
    }

    submit(source: any, collectionScheduleID: any): void {
        let proceed = true;

        source.forEach((row: any) => {
            row.IsScoreMandatory = false;
            row.IsActionPlanMandatory = false;
            row.IsActionRemarks = false;
            if (!(row.MetricScore === 0 || row.MetricScore)) {
                row.IsScoreMandatory = true;
                proceed = false;
            }         

            if (this.isActionMandatory(row) && (this.isBlank(row.ActionPlan) || row.evidences.length == 0)) {
                row.IsActionPlanMandatory = true;
                proceed = false;
            }
            if (!row.Remarks) {
                row.IsActionRemarks = true;
                proceed = false;
            }
        });

        if (proceed) {
            this.riskAssessmentservice.setRiskMetricsSubmit(source, collectionScheduleID).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.popupInfo("Success", "Submitted Successfully.", true, res);
                   
                } else {
                    this.selectedCategory.emit('Reset');
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Error", res.error.errorMessage, false, null);
                }
                error: (err: any) =>
                console.log("err::", err);
            });
        }
        else {
            this.scroll()
        }
    }

    scroll() {
        let index = this.source.findIndex((element: {
            IsActionPlanMandatory: boolean;
            IsScoreMandatory: boolean; IsActionRemarks: boolean;
        }) => element.IsActionRemarks == true || element.IsScoreMandatory == true || element.IsActionPlanMandatory == true);
        if (index >= 0) {
            let el = document.getElementById(this.source[0].UnitName + index)!;
            if (el)
                el.scrollIntoView();
        }
    }
    popupInfo(title: string, content: string, refresh: boolean = false, res: any): void {
        const info = this.dialog.open(InfoComponent, {
            // disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: content
            }
        });
        info.afterOpened().subscribe(result => {
            setTimeout(() => {
                info.close()
            }, 3000)
        });
        info.afterClosed().subscribe(result => {
            if (refresh) {
                this.refresh.emit(res);

                let selectedData = localStorage.getItem('RAChartStatus')?.toString() || 'Reset'
                console.log('✌️selectedData --->maker', selectedData);
                this.selectedCategory.emit(selectedData);
            }   
                
        })
       
    }

    showComments(comments: any): void {
        const info = this.dialog.open(CommentsComponent, {
            minWidth: "28vw",
            maxWidth: "60vw",
            minHeight: "30vh",
            maxHeight: "60vh",
            panelClass: "dark",
            data: {
                title: "Previous Comments",
                comments: comments?.filter((x: any) =>   x.CommentBody != '')
            }
        });
    }

    cancel(): void {

    }

    disableRow(row: any): boolean {
        let cond1 = [null, 1, 2, 4].includes(row.Status)
        let cond2 = [true, null].includes(row.IsReviewed)
        let cond3 = row.IsMaker == 1
        return !(cond1 && cond2 && cond3)
    }

    disableDraftButton(): boolean {
        // console.log('this.source: '+ JSON.stringify(this.source))
        //Enable when atleast one record is null, Schedule, In Progress, Rejected
        let cond1 = this.source.some((row: any) => [null, 1, 2, 4].includes(row.Status))
        let cond2 = this.source.every((row: any) => [true, null].includes(row.IsReviewed))
        let cond3 = this.source.some((row: any) => [1].includes(row.IsMaker))
        let disableStatus = !(cond1 && cond2 && cond3)
        this.isUploaddisable = disableStatus;
        return disableStatus;
    }

    disableSubmitButton(): boolean {
        // console.log(this.orgdata);
        let selectedUnitData = this.orgdata.filter((row: any) => row.UnitID == this.source[0].UnitID)
        //let cond3 = this.source.some((row: any) => !row.CollectionID) //At least one In Progress
        // let cond2 = !this.source.some((row: any) => [null, 1].includes(row.Status)) //No null or Schedule
        let cond1 = selectedUnitData.some((row: any) => row.Status == 2) //At least one In Progress
        let cond2 = !selectedUnitData.some((row: any) => [null, 1].includes(row.Status)) //No null or Schedule
        let cond3 = this.source.some((row: any) => [1].includes(row.IsMaker))

        //let cond3 = selectedUnitData.some((row: any) => row.Remarks=='');
        // console.log(this.source[0].UnitName ,!(cond1 && cond2));
        return !(cond1 && cond2 && cond3) || this.isFileUploadChanged
            || (selectedUnitData
                .some((row: any) => (row?.MetricScoreOld != row?.MetricScore || row?.RemarksOld != row?.Remarks || row?.ActionPlanOld != row?.ActionPlan)));
    }



    updateFileUploadStatus() {
        this.isFileUploadChanged = true;
    }
    OnfilesdataOP(evt: any) {
        // console.log('OnfilesdataOP-evt.::', evt);
        let fileEvidences = evt.Evidences;
        if (fileEvidences) {
            fileEvidences.forEach((ele: any) => {
                if (!ele.NodeID) {
                    ele['NodeID'] = evt.inputData.NodeID;
                    ele['isNewFile'] = true;
                }
            });
            this.source.forEach((metric: any) => {
                if (metric.NodeID == evt.inputData.NodeID) {
                    metric.evidences = fileEvidences;
                    metric.IsActionPlanMandatory = false;
                }
            });
        }
    }

    getBackgroundColor(metricScore: number, Limit1: string, Limit2: string, Limit3: string) {
        

        const limit1Value = parseFloat(Limit1.match(/[-+]?[0-9]*\.?[0-9]+/)?.[0] || "");
        const limit3Value = parseFloat(Limit3.match(/[-+]?[0-9]*\.?[0-9]+/)?.[0] || "");
        const limit2 = parseFloat(Limit3.match(/[-+]?[0-9]*\.?[0-9]+/)?.[0] || "");
        const limit2val = parseFloat(Limit2.match(/[-+]?[0-9]*\.?[0-9]+/)?.[0] || "");
        const regex: RegExp = /([<>]=?)\s*([0-9]*\.?[0-9]+)/g;

        const limit2Value: { oper: string, val: number }[] = [];
        let match: RegExpExecArray | null;

        while ((match = regex.exec(Limit2)) !== null) {
            const oper: string = match[1];
            const val: number = parseFloat(match[2]);
            limit2Value.push({ oper, val });
        }
        const conditionMet: boolean = limit2Value.every((limit: any) => {
            switch (limit.oper) {
                case '>':
                    return metricScore > limit.val;
                case '>=':
                    return metricScore >= limit.val;
                case '<':
                    return metricScore < limit.val;
                case '<=':
                    return metricScore <= limit.val;
                default:
                    return false;
            }
        });
        let dataArr = this.source.filter((obj: any) => obj.Limit1 == Limit1 && obj.Limit3 == Limit3);

        dataArr.map((obj: any) => {
            if (metricScore < 0 ) {
                obj.errorScore = "Enter Valid Metric Score";
            } else if((obj.Limit2.includes("=") && metricScore !== limit2val) && (obj.Limit1.includes("=") && metricScore !== limit1Value) && (obj.Limit3.includes("=") && metricScore !== limit3Value)) {
                obj.errorScore = "Enter Valid Metric Score"; 
            }
            
            else {
                obj.errorScore = "";
            }
        });

        if (metricScore < 0){
            this.isErrorScore = true;
            return "#fafafa"; 
        } else {
            if ((Limit2.includes("=") && metricScore !== limit2val) && (Limit1.includes("=") && metricScore !== limit1Value) && (Limit3.includes("=") && metricScore !== limit3Value)){
                this.isErrorScore = true;
                return "#fafafa";
            }           
            if ((Limit1.includes(">=") && metricScore >= limit1Value) || (Limit1.includes(">") && metricScore > limit1Value) || (Limit1.includes("=") && metricScore == limit1Value)) {
                return this.colors[0]?.ColorCode;
            } else if ((Limit1.includes("<=") && metricScore <= limit1Value) || (Limit1.includes("<") && metricScore < limit1Value)) {
                return this.colors[0]?.ColorCode;
            } else if ((Limit3.includes(">=") && metricScore >= limit3Value) || (Limit3.includes(">") && metricScore > limit3Value) || (Limit3.includes("=") && metricScore == limit3Value)) {
                return this.colors[2]?.ColorCode;
            } else if ((Limit3.includes("<=") && metricScore <= limit3Value) || (Limit3.includes("<") && metricScore < limit3Value)) {
                return this.colors[2]?.ColorCode;
            } else if (Limit3.includes("=") && metricScore > limit3Value) {
                this.isErrorScore = true;
                return "#fafafa"
            } else if (conditionMet || (Limit2.includes("=") && metricScore == limit2val)) {
                // console.log('conditionMet: ' + conditionMet)
                return this.colors[1]?.ColorCode;
            } else {
                return "#fafafa";
            }
        }
    }


    
}
