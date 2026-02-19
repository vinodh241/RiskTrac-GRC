import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataRoutingModule } from './master-data-routing.module';
import { ThreatLibraryComponent } from './threat-library/threat-library.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { BusinessServicesComponent } from './business-services/business-services.component';
import { SiteComponent } from './site/site.component';
import { BusinessFunctionsComponent } from './business-functions/business-functions.component';
import { VendorsComponent } from './vendors/vendors.component';
import { MetricsLibraryComponent } from './metrics-library/metrics-library.component';
import { NewBusinessPopupComponent } from './business-services/new-business-popup/new-business-popup.component';
import { AddEditServiceproviderComponent } from './vendors/add-edit-serviceprovider-popup/add-edit-serviceprovider/add-edit-serviceprovider.component';
import { AddThreatComponent } from './threat-library/add-threat/add-threat.component';
import { AddSiteComponent } from './site/add-site/add-site.component';
import { AddMetricsLibraryComponent } from './metrics-library/add-metrics-library/add-metrics-library.component';
import { BusinessFunctionPopupComponent } from './business-functions/business-function-popup/business-function-popup/business-function-popup.component';
import { CrisisCommsTemplatesComponent } from './crisis-comms-templates/crisis-comms-templates.component';
import { AddCrisisCommsTemplateComponent } from './crisis-comms-templates/add-crisis-comms-template/add-crisis-comms-template.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { MasterDataComponent } from './master-data-dynamic/master-data.component';
import { ConfigurationComponent } from './master-data-dynamic/configuration-listing-page/configuration.component';
import { NewMasterPageComponent } from './master-data-dynamic/configuration-new-page/new-master-page.component';
import { AddNewInputComponent } from './master-data-dynamic/configuration-add-input/add-new-input.component';
import { EditInputComponent } from './master-data-dynamic/master-page-edit-input/edit-input.component';
import { AddInputMasterComponent } from './master-data-dynamic/master-page-add-input/add-input-master.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';
import { InvalidFileDetailsComponent } from './business-services/invalid-file-details/invalid-file-details.component';
import { SteeringCommitteeComponent } from './steering-committee/steering-committee.component';
import { AddSteeringCommitteeComponent } from './steering-committee/add-steering-committee/add-steering-committee.component';
import { InherentLikelyhoodComponent } from './inherent-likelyhood/inherent-likelyhood.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


@NgModule({
  declarations: [
    ThreatLibraryComponent,
    BusinessServicesComponent,
    SiteComponent,
    BusinessFunctionsComponent,
    VendorsComponent,
    MetricsLibraryComponent,
    NewBusinessPopupComponent,
    AddEditServiceproviderComponent,
    AddThreatComponent,
    AddSiteComponent,
    AddMetricsLibraryComponent,
    BusinessFunctionPopupComponent,
    CrisisCommsTemplatesComponent,
    AddCrisisCommsTemplateComponent,
    MasterDataComponent,
    ConfigurationComponent,
    NewMasterPageComponent,
    AddNewInputComponent,
    EditInputComponent,
    AddInputMasterComponent,
    InvalidFileDetailsComponent,
    SteeringCommitteeComponent,
    AddSteeringCommitteeComponent,
    InherentLikelyhoodComponent
  ],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    MatModule,
    CKEditorModule,
    FileUploadModule,
    CoreSharedModule
  ],
  exports: [
    AddThreatComponent
  ],
   providers: [ { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
})
export class MasterDataModule { }
