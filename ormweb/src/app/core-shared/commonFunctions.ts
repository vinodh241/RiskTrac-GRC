export function fileNamePattern(fileName: string) {
  const match = /[\^`\;@\&\+\$\%\!\#\{}]/;

  if (match.test(fileName)) {
    return true;
  }
  return false;
}


export interface ReportFrequency {
  FrequencyID: number;
  PeriodStartDate: string;
  PeriodEndDate: string;
}

export function isKriInDateRange(kriDate: string, kriFrequency: number = 1, reportFrequencyData: ReportFrequency[]): boolean {
  if (!kriDate || !reportFrequencyData || reportFrequencyData.length === 0) {
    return false;
  }

  // Find the matching frequency record
  const matchedFrequency = reportFrequencyData.find(
    f => f.FrequencyID === kriFrequency
  );

  if (!matchedFrequency) {
    return false; // No matching frequency found
  }

  const dateToCheck = new Date(kriDate).getTime();
  const startDate = new Date(matchedFrequency.PeriodStartDate).getTime();
  const endDate = new Date(matchedFrequency.PeriodEndDate).getTime();

  return dateToCheck >= startDate && dateToCheck <= endDate;
}

/** KRI threshold type: PERCENTAGE shows '%', NUMBER shows value only */
export const KRI_THRESHOLD_TYPE = {
  PERCENTAGE: 'PERCENTAGE',
  NUMBER: 'NUMBER'
} as const;

/**
 * Formats a KRI threshold/target value for display: appends '%' only when thresholdType is PERCENTAGE.
 * Use for Target, ThresholdValue1-5, KRI Value, Measurement.
 * When thresholdType is missing (e.g. old API): treat value > 100 as NUMBER (no %) so Number-type KRIs display correctly.
 */
export function formatKriThresholdValue(
  value: number | string | null | undefined,
  thresholdType: string | null | undefined
): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const s = String(value).trim();
  const upper = thresholdType ? String(thresholdType).toUpperCase() : '';
  let isPercentage: boolean;
  if (upper === KRI_THRESHOLD_TYPE.NUMBER) {
    isPercentage = false;
  } else if (upper === KRI_THRESHOLD_TYPE.PERCENTAGE) {
    isPercentage = true;
  } else {
    // thresholdType missing (e.g. KRI Review before SP returns it): value > 100 → treat as NUMBER
    const num = Number(value);
    isPercentage = isNaN(num) || num <= 100;
  }
  return isPercentage ? s + '%' : s;
}

/**
 * Returns the suffix to show after a KRI threshold value: '%' for PERCENTAGE, '' for NUMBER.
 */
export function getKriThresholdSuffix(thresholdType: string | null | undefined): string {
  if (!thresholdType || String(thresholdType).toUpperCase() !== KRI_THRESHOLD_TYPE.NUMBER) {
    return '%';
  }
  return '';
}
