import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentListRoutingModule } from './incident-list-routing.module';
import { IncidentListComponent } from './incident-list.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { IncidentComponent } from './incident/incident.component';
import { IncidentDetailsComponent } from './incident/incident-details/incident-details.component';
import { IncidentDetailsMoreComponent } from './incident/incident-details-more/incident-details-more.component';
import { UnitComponent } from './incident/unit/unit.component';
import { FileUploadComponent } from './incident/file-upload/file-upload.component';
import { RecommendationComponent } from './incident/recommendation/recommendation.component';
import { WorkflowStatusComponent } from './incident/workflow-status/workflow-status.component';
import { AuditTrailComponent } from './incident/audit-trail/audit-trail.component';
import { CommentDialogComponent } from './incident/comment-dialog/comment-dialog.component';
import { EvidenceFileComponent } from './incident/file-upload/evidence-files/evidence-file.component';
import { FileUploadModule } from "ng2-file-upload";
import { IncidentService } from 'src/app/services/incident/incident.service';

@NgModule({
  declarations: [
    IncidentListComponent,
    IncidentComponent,
    IncidentDetailsComponent,
    IncidentDetailsMoreComponent,
    UnitComponent,
    FileUploadComponent,
    RecommendationComponent,
    WorkflowStatusComponent,
    AuditTrailComponent,
    CommentDialogComponent,
    EvidenceFileComponent
  ],
  imports: [
    CommonModule,
    IncidentListRoutingModule,
    MatModule,
    FileUploadModule
  ],
  providers: [IncidentService]
})
export class IncidentListModule { }
