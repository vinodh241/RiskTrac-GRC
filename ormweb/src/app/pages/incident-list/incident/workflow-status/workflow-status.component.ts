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

    /**
     * ZRA-113: Database-driven workflow button enablement
     * Uses WorkflowActionBy from database to determine who can perform actions
     * This makes the UI resilient to workflow changes in the database
     */
    disable(idx: number): boolean {
        let res = true;
        
        // Get the workflow action at the specified index
        const workflowActions = this.service.incident.IsReporteeAndChecker == 1 
            ? this.service.workflowActions 
            : this.service.workflowCheckerActions;
        
        const action = workflowActions && workflowActions[idx];
        
        if (action) {
            // Use WorkflowActionBy from database to determine who can perform action
            const actionBy = action.NextWorkflowActionBy;
            
            switch (actionBy) {
                case 'Reportee':
                    res = !this.service.incident.Reportee;
                    break;
                case 'Checker':
                    res = !this.service.incident.Checker;
                    break;
                case 'Reviewer':
                    res = !this.service.incident.Reviewer;
                    // For review actions, check RCA and Comment requirements
                    if (action.NextWorkflowAction !== 'Reject Review' && action.NextWorkflowAction !== 'Return to Update') {
                        res = res || !this.service.incident.RCA || !this.service.incident.Comment;
                    }
                    // For Close Incident, check all recommendations are closed
                    if (action.NextWorkflowAction === 'Close Incident') {
                        res = res || this.service.recommendations.some((rec: any) => rec.StatusCode != 3);
                    }
                    break;
                case 'Approver':
                    res = !this.service.incident.Approver;
                    // For Close Incident, check all recommendations are closed
                    if (action.NextWorkflowAction === 'Close Incident') {
                        res = res || this.service.recommendations.some((rec: any) => rec.StatusCode != 3);
                    }
                    break;
                default:
                    res = true;
            }
        } else {
            // Fallback to legacy behavior for backward compatibility
            switch (this.service.incident.StatusCode) {
                case 1: //Draft
                case 3: //Rejected by Reviewer
                    res = !this.service.incident.Reportee;
                    break;
                case 8: //Submitted by Reportee
                    res = !this.service.incident.Checker;
                    break;
                case 2: //Submitted by Checker
                    res = !this.service.incident.Reviewer;
                    if (idx == 1)
                        res = res || !this.service.incident.RCA || !this.service.incident.Comment;
                    break;
                case 6: //Remediation - ZRA: now handled by Reviewer
                    res = !this.service.incident.Reviewer || this.service.recommendations.some((rec: any) => rec.StatusCode != 3);
                    break;
                case 4: //Submitted by Reviewer
                    res = !this.service.incident.Approver;
                    break;
                case 7: //Remediation (Close Incident) - ZRA: now handled by Reviewer  
                    res = !this.service.incident.Reviewer || this.service.recommendations.some((rec: any) => rec.StatusCode != 3);
                    break;
                case 9: //Rejected by Checker
                    res = !this.service.incident.Reportee;
                    break;
                case 5: //Rejected by Approver
                    res = !this.service.incident.Reviewer;
                    break;
                case 11: //Submitted by Reportee (direct flow)
                    res = !this.service.incident.Reviewer;
                    if (idx == 1)
                        res = res || !this.service.incident.RCA || !this.service.incident.Comment;
                    break;
                case 12: //Rejected by Reviewer
                    res = !this.service.incident.Reportee;
                    break;
            }
        }
        
        return res || this.utils.isReadOnlyUserORM();
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
