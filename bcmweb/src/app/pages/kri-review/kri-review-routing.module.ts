import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KriReviewComponent } from './kri-review.component';

const routes: Routes = [
  { path: '', component: KriReviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KriReviewRoutingModule { }
