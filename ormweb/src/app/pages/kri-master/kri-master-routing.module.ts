import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KriMasterComponent } from './kri-master.component';

const routes: Routes = [
  { path: '', component: KriMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KriMasterRoutingModule { }
