import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlEnvironmentRoutingModule } from './control-environment-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ControlNatureScoreComponent } from './control-nature-score/control-nature-score.component';
import { ControlAutomationScoreComponent } from './control-automation-score/control-automation-score.component';
import { ControlFrequencyScoreComponent } from './control-frequency-score/control-frequency-score.component';
import { ControlTotalScoreComponent } from './control-total-score/control-total-score.component';
import { OverallControlEnvironmentRatingComponent } from './overall-control-environment-rating/overall-control-environment-rating.component';
import { ControlInPaceComponent } from './control-in-pace/control-in-pace.component';
import { ControlEnvironmentComponent } from './control-environment.component';

@NgModule({
  imports: [
    CommonModule,
    ControlEnvironmentRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule
  ],
  declarations: [
    ControlInPaceComponent,
    ControlNatureScoreComponent,
    ControlAutomationScoreComponent,
    ControlFrequencyScoreComponent,
    ControlTotalScoreComponent,
    OverallControlEnvironmentRatingComponent,
    ControlEnvironmentComponent
  ],
  exports: [
    ControlInPaceComponent,
    ControlNatureScoreComponent,
    ControlAutomationScoreComponent,
    ControlFrequencyScoreComponent,
    ControlTotalScoreComponent,
    OverallControlEnvironmentRatingComponent,
    ControlEnvironmentComponent
  ]
})

export class ControlEnvironmentModule { }