import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskAppetiteDocumentsRoutingModule } from './risk-appetite-documents-routing.module';
import { RiskAppetiteViewComponent } from './risk-appetite-view/risk-appetite-view.component';
import { MatModule } from 'src/app/modules/mat/mat.module';


@NgModule({
  declarations: [
    RiskAppetiteViewComponent
  ],
  imports: [
    CommonModule,
    RiskAppetiteDocumentsRoutingModule,
    MatModule
  ]
})
export class RiskAppetiteDocumentsModule { }
