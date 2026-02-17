import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskRegisterComponent } from './risk-register.component';

const routes: Routes = [
  { path: '', component: RiskRegisterComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskRegisterRoutingModule {
  
 }
