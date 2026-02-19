import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteComponent } from './site/site.component';
import { BusinessFunctionsComponent } from './business-functions/business-functions.component';
import { BusinessServicesComponent } from './business-services/business-services.component';
import { VendorsComponent } from './vendors/vendors.component';
import { MetricsLibraryComponent } from './metrics-library/metrics-library.component';
import { ThreatLibraryComponent } from './threat-library/threat-library.component';
import { CrisisCommsTemplatesComponent } from './crisis-comms-templates/crisis-comms-templates.component';
import { ConfigurationComponent } from './master-data-dynamic/configuration-listing-page/configuration.component';
import { MasterDataComponent } from './master-data-dynamic/master-data.component';
import { SteeringCommitteeComponent } from './steering-committee/steering-committee.component';
import { InherentLikelyhoodComponent } from './inherent-likelyhood/inherent-likelyhood.component';

const routes: Routes = [
  { path: 'configure',          component: ConfigurationComponent},
  { path: 'site',               component: SiteComponent },
  { path: 'business-functions', component: BusinessFunctionsComponent },
  { path: 'business-sevices',   component: BusinessServicesComponent },
  { path: 'vendors',            component: VendorsComponent },
  { path: 'metrics-library',    component: MetricsLibraryComponent },
  { path: 'threat-library',     component: ThreatLibraryComponent },
  { path: 'crisis',             component: CrisisCommsTemplatesComponent },
  { path: 'steering-committee', component: SteeringCommitteeComponent },
  { path: 'OverallRiskScore', component: InherentLikelyhoodComponent },
  { path: 'allPages',           component: MasterDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
