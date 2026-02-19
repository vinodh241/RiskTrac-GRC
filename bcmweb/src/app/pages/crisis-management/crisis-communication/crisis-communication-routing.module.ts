import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrisisCommunicationListingComponent } from './crisis-communication-listing/crisis-communication-listing.component';

const routes: Routes = [
  { path: '', redirectTo: 'crisis-communication-list', pathMatch: 'full' },
  { path: 'crisis-communication-list', component: CrisisCommunicationListingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrisisCommunicationRoutingModule { }
