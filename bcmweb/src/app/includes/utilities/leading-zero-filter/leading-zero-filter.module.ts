import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadingZeroFilterPipe } from './leading-zero-filter.pipe';



@NgModule({
  declarations: [LeadingZeroFilterPipe],
  imports: [
    CommonModule
  ],
  exports: [LeadingZeroFilterPipe]
})
export class LeadingZeroFilterModule { }
