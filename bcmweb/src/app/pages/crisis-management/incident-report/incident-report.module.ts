import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentReportRoutingModule } from './incident-report-routing.module';
import { IncidentReportsListComponent } from './incident-reports-list/incident-reports-list.component';
import { ReportNewIncidentComponent } from './incident-reports-list/report-new-incident/report-new-incident.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { UpdateActionItemListComponent } from './incident-reports-list/report-new-incident/update-action-item-list/update-action-item-list.component';

@NgModule({
  declarations: [
    IncidentReportsListComponent,
    ReportNewIncidentComponent,
    UpdateActionItemListComponent
  ],
  imports: [
    CommonModule,
    IncidentReportRoutingModule,
    MatModule,
    CoreSharedModule,
    CKEditorModule
  ]
})
export class IncidentReportModule { }
