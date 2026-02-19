import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessImpactListingComponent } from './business-impact-listing/business-impact-listing.component';
import { ReviewBusinessImpactComponent } from './review-business-impact/review-business-impact.component';

const routes: Routes = [
  { path: '', redirectTo: 'business-impact-analysis', pathMatch: 'full' },
  { path: 'business-impact-analysis', component: BusinessImpactListingComponent },
  { path: 'review-business-impact', component:  ReviewBusinessImpactComponent},
  // { path: 'bcp-under-review', component: BcpUnderReviewComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessImpactAnalysisRoutingModule { }
