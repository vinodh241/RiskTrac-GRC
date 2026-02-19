import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leadingZeroFilter'
})
export class LeadingZeroFilterPipe implements PipeTransform {

  private padWithLeadingZeros(num: number, totalLength?: number) {
    if (num === undefined || num === null || isNaN(num)) return '00';
    return String(num).padStart(totalLength || 2, '0');
  }

  transform(num: number, totalLength?: number): any {
    return this.padWithLeadingZeros(num, totalLength);
  }

}
