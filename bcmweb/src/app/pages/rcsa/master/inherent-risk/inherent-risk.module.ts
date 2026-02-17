import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InherentRiskRoutingModule } from './inherent-risk-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list'; 
import {FlexLayoutModule} from "@angular/flex-layout";
import { InherentImpactRateComponent } from './inherent-impact-rate/inherent-impact-rate.component';
import { InherentLikelihoodRateComponent } from './inherent-likelihood-rate/inherent-likelihood-rate.component';
import { InherentRiskComponent } from './inherent-risk.component';
import { RiskCategoryComponent } from './risk-category/risk-category.component';
import { OverallInherentRiskRateComponent } from './overall-inherent-risk-rate/overall-inherent-risk-rate.component';

@NgModule({
    imports: [
        CommonModule,
        InherentRiskRoutingModule,
        MatModule,
        MatGridListModule,
        FlexLayoutModule
      ],
    declarations: [
      InherentLikelihoodRateComponent,
      InherentImpactRateComponent,
      InherentRiskComponent,
      RiskCategoryComponent,
      OverallInherentRiskRateComponent
    ],
    exports:[
      InherentLikelihoodRateComponent,
      InherentImpactRateComponent,
      InherentRiskComponent,
      RiskCategoryComponent,
      OverallInherentRiskRateComponent]
})

export class InherentRiskModule{}