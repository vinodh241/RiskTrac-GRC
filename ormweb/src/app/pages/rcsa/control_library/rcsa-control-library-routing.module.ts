import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RcsaControlLibraryComponent } from './rcsa-control-library/rcsa-control-library.component';


const routes: Routes = [
  { path: '', component: RcsaControlLibraryComponent }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RcsaControlLibraryRoutingModule {}

