import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemediationTrackerRoutingModule } from './remediation-tracker-routing.module';
import { RemediationListingComponent } from './remediation-listing/remediation-listing.component';
import { NewActionItemsComponent } from './remediation-listing/new-action-items/new-action-items.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';
import { ActionItemDetailsComponent } from './action-item-details/action-item-details.component';
import { RequestExtensionComponent } from './request-extension/request-extension.component';
import { ActionItemProgressComponent } from './action-item-details/action-item-progress/action-item-progress.component';
import { UploadSupportingComponent } from './action-item-details/action-item-progress/upload-supporting/upload-supporting.component';
import { UpdateActionItemComponent } from './update-action-item/update-action-item.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    RemediationListingComponent,
    NewActionItemsComponent,
    ActionItemDetailsComponent,
    RequestExtensionComponent,
    ActionItemProgressComponent,
    UploadSupportingComponent,
    ActionItemDetailsComponent,
    UpdateActionItemComponent
  ],
  imports: [
    CoreSharedModule,
    CommonModule,
    MatModule,
    RemediationTrackerRoutingModule,
    CKEditorModule
  ]
})
export class RemediationTrackerModule { }
