import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemediationListingComponent } from './remediation-listing/remediation-listing.component';

const routes: Routes =  [{ path: '', redirectTo: 'remediation-listing', pathMatch: 'full' },
{ path: 'remediation-listing', component: RemediationListingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemediationTrackerRoutingModule { }
