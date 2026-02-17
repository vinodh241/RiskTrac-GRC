import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KriHistoricalRoutingModule } from './kri-historical-routing.module';
import { KriHistoricalComponent } from './kri-historical.component';
import { MatModule } from 'src/app/modules/mat/mat.module';


@NgModule({
  declarations: [
    KriHistoricalComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    KriHistoricalRoutingModule
  ]
})
export class KriHistoricalModule { }
