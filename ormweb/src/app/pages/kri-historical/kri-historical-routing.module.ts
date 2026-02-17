import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KriHistoricalComponent } from './kri-historical.component';

const routes: Routes = [
  {path: '', component: KriHistoricalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KriHistoricalRoutingModule { }
