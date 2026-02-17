import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from "ngx-color-picker";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './includes/footer/footer.component';
import { HeaderComponent } from './includes/header/header.component';
import { MatModule } from './modules/mat/mat.module';
import { RiskAppetiteDocumentsComponent } from './pages/risk-appetite-documents/risk-appetite-documents.component';
import { RiskAppetiteTemplatesComponent } from './pages/risk-appetite-templates/risk-appetite-templates.component';
import { RiskMetricLevelsComponent } from './pages/risk-metric-levels/risk-metric-levels.component';
import { ReportSettingComponent } from './pages/report-setting/report-setting.component';
import { ConfirmDialogComponent } from './includes/utilities/popups/confirm/confirm-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { InfoComponent } from './includes/utilities/popups/info/info.component';
import { DatePipe } from '@angular/common';
import { WaitComponent } from './includes/utilities/popups/wait/wait.component';
import { KriDefinitionsComponent } from './pages/kri-definitions/kri-definitions.component';
import { KriDefinitionComponent } from './pages/kri-definitions/kri-definition/kri-definition.component';
import { RiskAssessmentsComponent } from './pages/risk-assessments/risk-assessments.component';
import { InherentRiskModule } from './pages/rcsa/inherent-risk/inherent-risk.module';
import { ScheduleAssessmentsModule } from './pages/rcsa/schedule-assessments/schedule-assessments.module';
import { SelfAssessmentsModule } from './pages/rcsa/self-assessments/self-assessments.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MasterInherentRiskModule } from './pages/rcsa/master/master-inherent-risk/master-inherent-risk.module';
import { MasterControlEnvironmentComponent } from './pages/rcsa/master/master-control-environment/master-control-environment.component';
import { MasterControlEnvironmentRoutingModule } from './pages/rcsa/master/master-control-environment/master-control-environment-routing.module';
import { MasterResidualRiskRatingComponent } from './pages/rcsa/master/master-residual-risk-rating/master-residual-risk-rating.component';
import { MasterResidualRiskRatingRoutingModule } from './pages/rcsa/master/master-residual-risk-rating/master-residual-risk-rating-routing.module';
import { MasterResidualRiskRatingModule } from './pages/rcsa/master/master-residual-risk-rating/master-residual-risk-rating.module';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { GenerateEmailComponent } from './pages/generate-email/generate-email.component';
import { CoresharedModule } from './core-shared/coreshared.module';
import { AlertComponent } from './includes/utilities/popups/alert/alert.component';
import { MasterRcsaModule } from './pages/rcsa/master/master-rcsa/master-rcsa.module';
import { KriSendEmailReminderDialogComponent } from './pages/dashboards/kri/kri-measurement/kri-send-email-reminder-dialog/kri-send-email-reminder-dialog.component';
import { RiskRegisterComponent } from './pages/risk-register/risk-register.component';
import { RiskRegisterAssessmentWiseComponent } from './pages/rcsa/schedule-assessments/risk-register-assessment-wise/risk-register-assessment-wise.component';
import { TemplateDialogComponent } from './includes/utilities/popups/TemplateDialog/template-dialog.component';
import { environment } from 'src/environments/environment';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    InfoComponent,
    WaitComponent,
    ConfirmDialogComponent,
    RiskAppetiteDocumentsComponent,
    RiskAppetiteTemplatesComponent,
    RiskAssessmentsComponent,
    RiskMetricLevelsComponent,
    ReportSettingComponent,
    KriDefinitionsComponent,
    KriDefinitionComponent,
    NotificationsComponent,
    GenerateEmailComponent,
    AlertComponent,
    KriSendEmailReminderDialogComponent,
    RiskRegisterComponent,
    RiskRegisterAssessmentWiseComponent,
    TemplateDialogComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatModule,
    HttpClientModule,
    ColorPickerModule,
    FileUploadModule,
    TranslateModule.forRoot({
      defaultLanguage: environment.defaultLanguage,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    InherentRiskModule,
    ScheduleAssessmentsModule,
    SelfAssessmentsModule,
    MasterInherentRiskModule,
    MasterControlEnvironmentRoutingModule,
    MasterResidualRiskRatingModule,
    CoresharedModule,
    MasterRcsaModule
  ],
  providers: [DatePipe, { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
