import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
    selector: 'app-risk-unit-reviewer',
    templateUrl: './risk-unit-reviewer.component.html',
    styleUrls: ['./risk-unit-reviewer.component.scss']
})
export class RiskUnitReviewerComponent implements OnInit{
    @Input() preheader: any[] = [];
    @Input() source: any;
    @Input() colors: any;
    @Input() orgdata: any;
    @Input() collectionScheduleID: any;
    @Input() assessmentFlag : any
    @Output() refresh: EventEmitter<any> = new EventEmitter<any[]>();
    @Output() selectedCategory = new EventEmitter<string>();

    role: string = "";
    percentage: number = 50;
    panelOpenState = true;
    panelNodeId: any = '';
    reviewed = 0;
    notstarted = 0;
    submitted = 0;
    inprogress = 0;
    notsubmitted = 0;
    completed = 0;
    approved = 0;
    rejected = 0;
    completedPercent:string='0';

    displayedColumns: string[] = ['selection', 'level', 'q3', 'risk-limit', 'score', 'remark', 'action', 'comments'];

    allChecked: boolean = false;

    isApproveSelected = false;
    isRejectSelected = false;
    commonComments: string = '';

    constructor(
        private service: RiskAssessmentService,
        public dialog: MatDialog,
        private _utils:UtilsService,
        @Inject(DOCUMENT) private _document:any
    ) { }

    ngOnInit(): void {
        let selectedStatus = localStorage.getItem('RAChartStatus')?.toString() || ''
        this.role = localStorage.getItem("rorm") || "XX"
        
        this.source = selectedStatus !== '' && ['Submitted'].includes(selectedStatus) 
                    ? this.source.filter((item: any) => item.StatusName.trim() == selectedStatus.trim()) 
                    : selectedStatus == 'Approved' 
                    ? this.source.filter((item: any) => item.Status == 5 && item.IsReviewed == true) 
                    : selectedStatus == 'Rejected'
                    ? this.source.filter((item: any) => item.IsReviewed == true && item.Status == 4)
                    : selectedStatus == 'Review Pending' 
                    ? this.source.filter((item: any) => item.IsReviewed == false && (item.Status == 5 || item.Status == 4 || item.Status == 3)) 
                    : this.source;

        if(this.source.length) {
            this.source.forEach((metric: any) => {
                // if (metric.CommentData)
                //     metric.Comment = metric.CommentData.length > 0 ? metric.CommentData[0].CommentBody : "-";
                metric.MetricScore = metric.MetricScore != null ? parseFloat(metric.MetricScore) : metric.MetricScore;
                // metric.MetricScore = metric.MetricScore != null ? parseInt(metric.MetricScore, 10) : metric.MetricScore;
                metric.isReviewCommentChanged = false;
                if(metric.IsReviewed) {   // To read submitted comment
                    if(metric?.CommentData?.length > 0) {
                        let submitComment = metric?.CommentData.find((x: any) => x.IsVisible);
                        metric.ReviewComment = submitComment?.CommentBody || '';
                    } else {
                        metric.ReviewComment = ''
                    } 
                } else {
                    if(metric?.CommentData?.length > 0) {
                        let submitComments =metric?.CommentData.filter((x: any) => x.IsVisible);
                        if(submitComments.length > 0 && metric?.CommentData[0].CommentBody.IsVisible) {
                            console.log(' submitComments --->', submitComments);

                            metric.ReviewComment = ''  //In case of resubmission (after reject)
                        } else {
                            if(metric.IsReviewed == false) {
                                console.log('✌️metric --->', metric);
                                let saveComment = metric?.CommentData[0].IsVisible == false ? metric?.CommentData[0] : {}
                                metric.ReviewComment = saveComment?.CommentBody || '';  //To read last saved comment (before submit)
                            } else if(metric.IsReviewed == null && metric?.Status == 2){
                                let saveComment = metric?.CommentData[0].IsVisible == true ? metric?.CommentData[0] : {}
                                metric.ReviewComment = saveComment?.CommentBody || '';
                                
                            } else {
                                metric.ReviewComment = ''
                            }
                        }
                    } else {
                        metric.ReviewComment = ''
                    }
                }
                console.log('✌️metric.ReviewComment  --->', metric.ReviewComment );

                metric.StatusOld = metric.Status;
                // for initialising all the child chcekboxes to unchecked value.
                metric.selected = false;
    
                if ([4, 5].includes(metric.Status)) this.completed++
                if (metric.IsReviewed) this.reviewed++
                if ([null, 1].includes(metric.Status)) this.notstarted++
                if (metric.Status == 3) this.submitted++
                if (metric.Status == 2) this.inprogress++
                if ((metric.Status === 5 || metric.Status === 4) && metric.IsReviewed === false) {
                    this.notsubmitted++;
                  }
                if (metric.Status == 5) this.approved++
                if (metric.Status == 4) this.rejected++
    
            });
            this.completedPercent=((this.completed)*100/this.source.length).toFixed(2);
            this.completedPercent = this.completedPercent.replace(/\.?0+$/, '');
            this.panelOpenState = this.getCurrentState(this.source[0].NodeID);
        }
    }

    setOpenState(nodeId: string) {
        let panelState = localStorage.getItem('PanelStateReviewer');
        if (panelState) {
            let prentPannelState = JSON.parse(panelState);
            if (prentPannelState) {
                prentPannelState.push(nodeId);
                localStorage.setItem('PanelStateReviewer', JSON.stringify(prentPannelState));
            }
            else {
                localStorage.setItem('PanelStateReviewer', JSON.stringify([]));
            }
        }
        else {
            var openedList = [];
            openedList.push(nodeId);
            localStorage.setItem('PanelStateReviewer', JSON.stringify(openedList));
        }
    }

    setCloseState(nodeId: string) {
        let panelState = localStorage.getItem('PanelStateReviewer');
        if (panelState) {
            let presentPanelState = JSON.parse(panelState);
            presentPanelState = [...new Set(presentPanelState)];
            let index = presentPanelState.indexOf(nodeId);
            if (index != null) {
                presentPanelState.splice(index, 1);
                localStorage.setItem('PanelStateReviewer', JSON.stringify(presentPanelState));
            }
        }
    }

    getCurrentState(nodeId: string) {
        var panelState = localStorage.getItem('PanelStateReviewer');
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

    reviewDraft(source: any, collectionScheduleID: any): void {
        let data: any[] = [];
        source.forEach((row: any) => {
            if(row.selected) {
                if (([4, 5].includes(row.Status) && ([null, false].includes(row.IsReviewed))) ||
                (row.isReviewCommentChanged || this.commonComments)) {
                    data.push({
                        "unitId": row.UnitID.toString(),
                        "collectionScheduleId": collectionScheduleID,
                        "nodeId": row.NodeID,
                        "commentBody": row.ReviewComment || this.commonComments,
                        "isApproved": row.Status == 5 ? true : row.Status == 4 ? false : null
                    });
                    row.isReviewCommentChanged = false;
               }
           }
        });
        if (data.length > 0) {
            this.service.setRiskMetricsReviewDraft(data, collectionScheduleID).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.popupInfo("Success", "Draft Saved Successfully.", true, res);
                    this.commonComments = '';
                } else {
                    if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this._utils.relogin(this._document);
                    else
                        this.popupInfo("Error", res.error.errorMessage, false, null);
                }
                error: (err: any) =>
                console.log("err::", err);
            });
        } else {
            this.popupInfo("Information", "Data was not changed", false, null);
        }
    }

    reviewSubmit(source: any, collectionScheduleID: any): void {
        let proceed = true;

        source.forEach((row: any) => {
            row.IsReviewStatusMandatory = false;
            row.IsReviewCommentMandatory = false;

            if(![3,4, 5].includes(row.Status) && [null, false].includes(row.IsReviewed)) {
                row.IsReviewStatusMandatory = true;
                proceed = false;
            } 
 
            if((!row.CommentData || !row.CommentData[0]['CommentBody'])) {
                row.IsReviewCommentMandatory = true;
                proceed = false;
            } else if((row.CommentData.length && row.IsReviewed == false && row.CommentData[0]['IsVisible'] == true)) {
                row.IsReviewCommentMandatory = true;
                proceed = false;
            }
            
        });
        if(proceed) {
            this.service.setRiskMetricsReviewSubmit(source, collectionScheduleID).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.popupInfo("Success", "Review Submitted Successfully.", true, res)
                } else {
                    if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this._utils.relogin(this._document);
                    this.popupInfo("Error", res.error.errorMessage, false, null);
                }
                error: (err: any) =>
                console.log("err::", err);
            });
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
            if (refresh)
                this.refresh.emit(res);
                let selectedData = localStorage.getItem('RAChartStatus')?.toString() || 'Reset'
                console.log('✌️selectedData --->maker', selectedData);
                this.selectedCategory.emit(selectedData);
        })
    }

    showComments(element:any): void {
        console.log('Approve Reject Element :  ', element);
        if(element.StatusName === 'Approved' || element.StatusName === 'Rejected'){

            let comments = element.CommentData ? (element.CommentData.filter((x: any) => x.CommentBody != '' && x.IsVisible === true) || []) : [];
            console.log('Historical comments : ', comments);
            const info = this.dialog.open(CommentsComponent, {
                minWidth: "28vw",
                maxWidth: "60vw",
                minHeight: "30vh",
                maxHeight: "60vh",
                panelClass: "dark",
                data: {
                    title: "Previous Comments",
                    comments: comments
                }
            });
        }else {

            let comments = element.CommentData ? (element.CommentData.filter((x: any) =>x.CommentBody != '' && x.IsVisible) || []): [];
            const info = this.dialog.open(CommentsComponent, {
                minWidth: '28vw',
                maxWidth: '60vw',
                minHeight: '30vh',
                maxHeight: '60vh',
                panelClass: 'dark',
                data: {
                    title: 'Previous Comments',
                    comments: comments,
                },
            });
        }
    }

    // cancel(): void {

    // }

    disableReviewCell(row: any): boolean {
        // let cond1 = [3, 4, 5].includes(row.Status) //true
        // let cond2 = [null, false].includes(row.IsReviewed) //true
        // let cond3 = row.IsReviewer == 1
        // return !(cond1 && cond2 && cond3)
        let cond1 = [3, 4, 5].includes(row.Status) //true
        let cond2 = (row.Status == 5 && row.IsReviewed) ? false : [null, false, true].includes(row.IsReviewed); //true
        let cond3 = row.IsReviewer == 1;
        return !(cond1 && cond2 && cond3) || (this.disableReviewSubmitButton() && this.disableReviewDraftButton());
    }

    disableReviewDraftButton(): boolean {

        //Enable when atleast one record is Submitted, Reject, Approve
        let cond1 = !this.source.some((row: any) => [3, 4, 5].includes(row.Status))
        let cond2 = !this.source.some((row: any) => [false, null].includes(row.IsReviewed))
        let cond3 = !this.source.some((row: any) => [1].includes(row.IsReviewer))
        return cond1 || cond2 || cond3
    }

    disableReviewSubmitButton(): boolean {
        let selectedUnitData = this.orgdata.filter((row:any) => row.UnitID == this.source[0].UnitID)
        // console.log('Selected Unit Data : ' ,selectedUnitData);
        // let cond1 = this.source.every((row: any) => [4, 5].includes(row.Status))
        // let cond2 = !this.source.some((row: any) => row.IsReviewed == null)
        // let cond3 = !this.source.every((row: any) => row.IsReviewed == true)

        // let cond1 = temp.every((row: any) => [4, 5].includes(row.Status))
        let cond2 = !selectedUnitData.some((row: any) => row.IsReviewed == null)
        let cond3 = !selectedUnitData.every((row: any) => row.IsReviewed == true)
        let cond4 = !this.source.some((row: any) => [1].includes(row.IsReviewer))
        return !(cond2 && cond3) || cond4 || selectedUnitData.some((row: any) => row?.StatusOld != row?.Status || row?.isReviewCommentChanged);
    }

    // Return true if selected items are less than total(allChecked) but more than 0.
    isFewSelected(): boolean {
        return this.source.filter((row: any) => row.selected).length > 0 && !this.allChecked;
    }

    //Update Master and child checkboxes.
    setAll(selected: boolean) {
        this.isRejectSelected = false;
        this.isApproveSelected = false;
        this.allChecked = selected;
        if(this.source == null){
            return;
        }
        this.source.forEach((row: any) => {
            if(!this.disableReviewCell(row))
            row.selected = selected
        });
    }

    //Check master checkbox if all items are selected.
    updateAllComplete() {
        this.isRejectSelected = false;
        this.isApproveSelected = false;
        this.allChecked = this.source != null && this.source.filter((el: any) => !this.disableReviewCell(el)).every((row: any) => row.selected);
    }

    onChangeApprove() {
        this.isRejectSelected = false;
        this.isApproveSelected = true;
        this.source.filter((x: any) => x.selected).forEach((y: any) => {
            y.Status = (y.Status == 5) ? 3 : 5;
        });
    }

    onChangeReject() {
        this.isApproveSelected = false;
        this.isRejectSelected = true;
        this.source.filter((x: any) => x.selected).forEach((y: any) => {
            y.Status = (y.Status == 4) ? 3 : 4;
        });
    }

    enableApproveRejectButton() {
        return this.source.some((x: any) => x.selected);
    }

    enableSelectAllCheckbox() {
        return this.source.some((x: any) => !this.disableReviewCell(x));
    }

    isCommonCommentsValid() {
        return Boolean((this.commonComments || '').trim())
    }

    onChangeReviewComment(element: any) {
        if(element.ReviewComment != (element?.CommentData || [])[0]?.CommentBody) {
            element.isReviewCommentChanged = true;
        } else {
            element.isReviewCommentChanged = false;
        }
    }

    onChangeCommonComment() {
        this.source.forEach((ele: any) => {
            if(ele.selected && !(ele.ReviewComment || '').trim()) {  //Add common comments value to Review comment(if there is no value exist in review comment field)
                ele.ReviewComment = this.commonComments;
            }
        })
    }

    displaySubmitComments(element: any) {
        return element.CommentData ? ((element.CommentData.filter((x: any) => x.IsVisible === true) || []).length > 0) : false;
    }

}
