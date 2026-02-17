import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
    selector: 'app-workflow-status',
    templateUrl: './workflow-status.component.html',
    styleUrls: ['./workflow-status.component.scss']
})
export class WorkflowStatusComponent implements OnInit {
    recommendCount: number=0;
    recommendations:any;
    constructor(
        public dialog: MatDialog,
        public service: IncidentService,
        public utils: UtilsService
    ) {

     }

    disable(idx: number): boolean {
        let res = true
        // console.log("this.service.incident",this.service.incident)
        // console.log("this.service.incident.StatusCode",this.service.incident.StatusCode)
        switch (this.service.incident.StatusCode) {
            case 1: //Draft
            case 3: //Rejected by Reviewer
                res = !this.service.incident.Reportee
                break
             case 8: //Submitted by Reportee
                res = !this.service.incident.Checker
                break
            case 2: //Submitted by Checker
                res = !this.service.incident.Reviewer
                if (idx == 1)
                    res = res || !this.service.incident.RCA || !this.service.incident.Comment
                break
            case 6: //Rejected by Approver
                res = !this.service.incident.Approver || this.service.recommendations.some((rec: any) => rec.StatusCode != 3)
                break
            case 4: //Submitted by Reviewer
                res = !this.service.incident.Approver
                break
            case 7: //Remediation
                res = !this.service.incident.Approver || this.service.recommendations.some((rec: any) => rec.StatusCode != 3)
                break
            case 9: //Rejected by Checker
                res = !this.service.incident.Reportee
                break
            case 5: //Rejected by approver
                res = !this.service.incident.Reviewer
                break
            case 11:
                res = !this.service.incident.Reviewer
                if (idx == 1)
                    res = res || !this.service.incident.RCA || !this.service.incident.Comment
                break
            case 12: //Rejected by Reviewer
                res = !this.service.incident.Reportee
                break
        }
        return res || this.utils.isReadOnlyUserORM()
    }

    openComment(action: any) {
        const dialogRef = this.dialog.open(CommentDialogComponent, {
            disableClose: true,
            height: '50vh',
            width: '50vw',
            data: {
                type: 'inc',
                data: {
                    "incidentID"        : this.service.incident.IncidentID,
                    "comment"           : "",
                    "currentStatusCode" : this.service.incident.StatusCode,
                    "nextStatusCode"    : action.NextStatusCode,
                    "IsFinancialLoss"   : this.service.incident.IsFinancialLoss,
                    "isReviewed"        : (this.service.incident.StatusCode == 11 && action.NextStatusCode == 12) ? 0 : (this.service.incident.StatusCode == 11 && action.NextStatusCode == 4) ? 1 : null, 
                    // "isReviewed"        : (this.service.incident.StatusCode === 11) ? (action.NextStatusCode === 12 ? 0 : (action.NextStatusCode === 4 ? 1 : null)) : null,

              
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => {
        })
    }

    ngOnInit(): void {
        this.recommendations = JSON.parse(JSON.stringify(this.service.recommendations))
    }

}
