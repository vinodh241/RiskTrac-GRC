import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';
import { ReportsComponent } from './reports.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { RiskAppetiteComponent } from './report-pages/risk-appetite/risk-appetite.component';
import { ReportRcsaComponent } from './report-pages/report-rcsa/report-rcsa.component';
import { ReportKriComponent } from './report-pages/report-kri/report-kri.component';
import { ReportIncidentComponent } from './report-pages/report-incident/report-incident.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMMM YYYY',
    monthYearLabel: 'DD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    ReportsComponent,
    RiskAppetiteComponent,
    ReportRcsaComponent,
    ReportKriComponent,
    ReportIncidentComponent
  ],
  imports: [
    CoresharedModule,
    MatModule,
    CommonModule,
    MatToolbarModule,
    ReportsRoutingModule
  ],
  providers: [ReportsService]
})
export class ReportsModule { }
