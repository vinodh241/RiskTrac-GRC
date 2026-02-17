import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './dashboard.component';
import { KriDashboardComponent } from './kri/kri.component';
import { IncidentDashboardComponent } from './incident/incident.component';
import { RsaDashboardComponent } from './rcsa/rcsa.component';
import { RasChartComponent } from './rcsa/ras-chart/ras-chart.component';
import { MhrDashboardComponent } from './rcsa/mhr-chart/mhr-chart.component';
import { InheritRiskChartChartComponent } from './rcsa/inherit-risk-chart/inherit-risk-chart.component';
import { ResidualRiskChartChartComponent } from './rcsa/residual-risk-chart/residual-risk-chart.component';
import { IncidentGraphComponent } from './incident/incident-graph/incident-graph.component';
import { IncidentOflGraphComponent } from './incident/incident-ofl-graph/incident-ofl-graph.component';
import { IncidentCwGraphComponent } from './incident/incident-cw-graph/incident-cw-graph.component';
import { IncidentMsplGraphComponent } from './incident/incident-mspl-graph/incident-mspl-graph.component';
import { KriChartComponent } from './kri/kri-chart/kri-chart.component';
import {KriUnitComponent} from './kri/kri-unit/kri-unit.component';
import { KriPopupComponent } from './kri/kri-popup/kri-popup.component';
import { IncidentRecordsComponent } from './incident/incident-popups/incident-records/incident-records.component'
import { RscaPopupComponent } from './rcsa/popups/rsca-popups/rsca-popups.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RiskPopupComponent } from './rcsa/popups/risk-popup/risk-popup.component';
import { IncidentCwComponent } from './incident/incident-popups/incident-cw/incident-cw.component';
import { KriMigrationUnitComponent } from './kri/kri-migration-unit/kri-migration-unit.component';
import { CwPopupComponent } from './incident/incident-popups/cw-popup/cw-popup.component';
import { ViewAllComponent } from './risk-appetite/Popups/view-all/view-all.component';
import { RaPopupComponent } from './risk-appetite/Popups/ra-popup/ra-popup.component';
import { CmPopupComponent } from './risk-appetite/Popups/cm-popup/cm-popup.component';
import { RiskApptiteDashboardComponent } from './risk-appetite/risk-appetite.component';
import { RiskAppetiteGraphComponent } from './risk-appetite/Graph/risk-appetite-graph/risk-appetite-graph.component';
import { RaBarGraphComponent } from './risk-appetite/Graph/ra-bar-graph/ra-bar-graph.component';
import { CmViewallComponent } from './risk-appetite/Popups/cm-viewall/cm-viewall.component';
import { ViewallComponent } from './incident/incident-popups/viewall/viewall.component';
import { HighRiskPopupComponent } from './rcsa/popups/highrisk-popups/highrisk-popups.component';
import { OflGrphPopupComponent } from './incident/incident-popups/ofl-grph-popup/ofl-grph-popup.component';
import { KriScoreComponent } from './kri/kri-score/kri-score.component';
import { OverAllDashboardComponent } from './overall/overall.component';
import { IncidentOverallComponent } from './overall/incident-overall/incident-overall.component';
import { KriOverallComponent } from './overall/kri-overall/kri-overall.component';
import { RcsaOverallComponent } from './overall/rcsa-overall/rcsa-overall.component';
import { RiskappetiteOverallComponent } from './overall/riskappetite-overall/riskappetite-overall.component';
import { RscaViewAllComponent } from './overall/rcsa-overall/risk-viewall/risk-viewall.component';
import { RscaOverallPopupComponent } from './overall/rcsa-overall/rsca-popups/rsca-overall-popups.component';
@NgModule({
  declarations: [
    DashboardComponent,
    RiskApptiteDashboardComponent,
    IncidentDashboardComponent,
    RsaDashboardComponent,
    KriDashboardComponent,
    RasChartComponent,
    MhrDashboardComponent,
    InheritRiskChartChartComponent,
    ResidualRiskChartChartComponent,
    RiskAppetiteGraphComponent,
    IncidentGraphComponent,
    IncidentOflGraphComponent,
    IncidentCwGraphComponent,
    IncidentMsplGraphComponent,
    KriChartComponent,
    KriUnitComponent,
    KriPopupComponent,
    RaBarGraphComponent,
    RscaPopupComponent,
    IncidentRecordsComponent,
    ViewAllComponent,
    IncidentCwComponent,
    RiskPopupComponent,
    RaPopupComponent,
    KriMigrationUnitComponent,
    CwPopupComponent,
    CmPopupComponent,
    CmViewallComponent,
    ViewallComponent,
    HighRiskPopupComponent,
    OflGrphPopupComponent,
    KriScoreComponent,
    OverAllDashboardComponent,
    IncidentOverallComponent,
    KriOverallComponent,
    RcsaOverallComponent,
    RiskappetiteOverallComponent,
    RscaViewAllComponent,
    RscaOverallPopupComponent

 ],
  imports: [
    CommonModule,
    CoresharedModule,
    DashboardRoutingModule,
    MatModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
  ]
})
export class DashboardModule { }
