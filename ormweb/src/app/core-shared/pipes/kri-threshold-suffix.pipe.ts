import { Pipe, PipeTransform } from '@angular/core';
import { formatKriThresholdValue } from '../commonFunctions';

/**
 * Pipe to format KRI threshold/target values: appends '%' only when thresholdType is PERCENTAGE.
 * Usage: {{ value | kriThresholdSuffix: row.thresholdType }}
 */
@Pipe({
  name: 'kriThresholdSuffix'
})
export class KriThresholdSuffixPipe implements PipeTransform {
  transform(value: number | string | null | undefined, thresholdType: string | null | undefined): string {
    return formatKriThresholdValue(value, thresholdType);
  }
}
