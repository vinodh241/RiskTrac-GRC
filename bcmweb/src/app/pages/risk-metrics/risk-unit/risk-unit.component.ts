import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { CommentsComponent } from '../comments/comments.component';
import { LimitsComponent } from '../limits/limits.component';


@Component({
    selector: 'app-risk-unit',
    templateUrl: './risk-unit.component.html',
    styleUrls: ['./risk-unit.component.scss']
})
export class RiskUnitComponent implements OnInit {
    @Input() preheader:any[] = [];
    @Input() source: any;
    @Input() colors: any;
    @Input() collectionScheduleID: any;
    @Input() assessmentFlag:any
    @Output() refresh: EventEmitter<any> = new EventEmitter();

    role: string = "";
    percentage: number = 50;
    panelOpenState = false;

    reviewed = 0;
    notstarted = 0;
    submitted = 0;
    inprogress = 0;
    notsubmitted = 0;
    completed = 0;
    approved = 0;
    rejected = 0;
    completedPercent:string='0';

    displayedColumns: string[] = ['level', 'q3', 'risk-limit', 'score', 'remark', 'action', 'comments'];

    constructor(private service: RiskAssessmentService, public dialog: MatDialog) { }

    ngOnInit(): void {
        console.log("riskunit",this.assessmentFlag)
        this.role = localStorage.getItem("rorm") || "XX"
        console.log('this.source: '+ JSON.stringify(this.source))
        this.source.forEach((metric: any) => {
            if (metric.CommentData)
                metric.Comment = metric.CommentData.length > 0 ? metric.CommentData[0].CommentBody : "-"
                metric.MetricScore = metric.MetricScore != null ? parseFloat(metric.MetricScore) : metric.MetricScore;
            // metric.MetricScore = metric.MetricScore != null ? parseInt(metric.MetricScore, 10) : metric.MetricScore;
            if ([4, 5].includes(metric.Status)) this.completed++
            if (metric.IsReviewed) this.reviewed++
            if ([null, 1].includes(metric.Status)) this.notstarted++
            if (metric.Status == 3) this.submitted++
            if (metric.Status == 2) this.inprogress++
            if ((metric.Status === 5 || metric.Status === 4) && metric.IsReviewed === false) {
                this.notsubmitted++;
                console.log("🚀 ~ file: risk-unit.component.ts:57 ~ RiskUnitComponent ~ this.source.forEach ~ this.notsubmitted:", this.notsubmitted)
              }

            if (metric.Status == 5) this.approved++
            if (metric.Status == 4) this.rejected++
        });
        this.completedPercent=((this.completed)*100/this.source.length).toFixed(2);
        this.completedPercent = this.completedPercent.replace(/\.?0+$/, '');
    }

    showComments(comments:any): void {
        const info = this.dialog.open(CommentsComponent, {
            minWidth: "28vw",
            maxWidth: "60vw",
            minHeight: "30vh",
            maxHeight: "60vh",
            panelClass: "dark",
            data: {
                title: "Previous Comments",
                comments: comments?.filter((x:any) => x.CommentBody != '' && x.IsVisible)
            }
        });
    }

    showLimits(comments:any, pre:number): void {
        const info = this.dialog.open(LimitsComponent, {
            minWidth: "50vh",
            maxWidth: "75vh",
            panelClass: "dark",
            data: {
                title: "Risk Limits",
                comments: comments,
                pre: pre
            }
        });
    }

}




