import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessContinuityListingComponent } from './business-continuity-listing/business-continuity-listing.component';
import { ReviewBusinessFunctionComponent } from './review-business-function/review-business-function.component';
import { BcpUnderReviewComponent } from './business-continuity-listing/bcp-under-review/bcp-under-review.component';

const routes: Routes = [
  { path: '', redirectTo: 'business-continuity-listing', pathMatch: 'full' },
  { path: 'business-continuity-listing', component: BusinessContinuityListingComponent },
  { path: 'review-business-function', component: ReviewBusinessFunctionComponent },
  { path: 'bcp-under-review', component: BcpUnderReviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessContinuityPlansRoutingModule { }
