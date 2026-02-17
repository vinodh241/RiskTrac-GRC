import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { isKriInDateRange } from 'src/app/core-shared/commonFunctions';

@Component({
  selector: 'app-report-kri',
  templateUrl: './report-kri.component.html',
  styleUrls: ['./report-kri.component.scss']
})
export class ReportKriComponent implements OnInit {
  @Input() selectedMeasureFreq: any;
  @Input() selectedKriType: any;
  @Input() selectedKriValue: any;
  @Input() selectedKriStatus: any;
  @Input() presentQuarter: any;
  @Input() yearValue: any;
  @Input() quarterValue: any;
  @Input() quarterNumber: any;
  @Input() qStartDate: any;
  @Input() qEndDate: any;
  @Input() selectedMonth: any;
  displayedColumns: string[] = ['SNo', 'Unit', 'KRICode', 'Indicator', 'MeasurementFrequency', 'KRI_Target', 'KRI_Type'];
  periodColumns: string[] = ['Period', 'Date', 'Measurement', 'KRI_Value', 'Remark', 'KRI_Status'];
  thresholdColumns: string[] = ['ThresholdValue1', 'ThresholdValue2', 'ThresholdValue3', 'ThresholdValue4', 'ThresholdValue5'];
  displayedHeaders: any[] = ['header-row-first-group', 'header-row-second-group', 'header-row-third-group', 'header-row-fourth-group', 'header-row-fifth-group', 'header-row-six-group', 'header-row-seven-group', 'header-row-eight-group', 'header-row-last-group'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  KRICount: number = 0;
  filterData: any
  measured: number = 0;
  notMeasured: number = 0;
  period: any;
  periodReport: any;
  reported: number = 0;
  year: number = 0;
  excelSheet: boolean = false;
  globalSearchValue: any = '';
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  rejected: any;
  approved: any;
  reportFrequencyData: any;
  BufferDays: number = 0;
  ReportingFrequencyID = 1;
  KRIStatusList = {
    "KRI_StatusData": [
      "Reported",
      "Measured",
      "Not Measured",
      "Approved",
      "Rejected"
    ]
  }

  constructor(
    private service: ReportsService,
    public kriService: KriService,
    private utilsService: UtilsService
  ) {
    service.gotKRI.subscribe(value => {
      this.dataSource.data = [];
      if (value == true) {
        this.filterData = service.KRIResults;
        this.reportFrequencyData = service.reportFrequencyData ?? [];
        this.getTableData();
      }
    });
  }

  ngOnInit(): void {
    this.service.getKRI();
  }

  ngOnChanges() {
    console.log('selectedMonth::', this.selectedMonth);
    this.updateTable();
  }

  generateExcel() {
    this.excelSheet = true;
    this.kriService.exportKRIReportAsExcelWithColorCode('KRITable', 'reportFIle', this.dataSource.data);
  }

  getTableData() {
    this.dataSource.data = this.filterData;
    let KRIStatusData = this.KRIStatusList.KRI_StatusData;

    let measurementFreq = this.filterData.map((i: { MeasurementFrequency: any; }) => i.MeasurementFrequency);
    measurementFreq = measurementFreq.filter((elem: any, index: any, self: string | any[]) => {
      return elem != null && index === self.indexOf(elem);
    });

    let KriValue = this.filterData.map((i: { KRI_Value: any; }) => i.KRI_Value);
    KriValue = KriValue.filter((elem: any, index: any, self: string | any[]) => {
      return elem != null && index === self.indexOf(elem);
    });

    this.updateStatusCounts();

    let KriType = this.filterData.map((i: { KRI_Type: any; }) => i.KRI_Type);
    KriType = KriType.filter((elem: any, index: any, self: string | any[]) => {
      return elem != null && index === self.indexOf(elem);
    });

    let dropDowns = {
      measurementFreq: measurementFreq.length > 0 ? measurementFreq : [],
      KriValue: KriValue.length > 0 ? KriValue : [],
      KriStatus: KRIStatusData,
      KriType: KriType.length > 0 ? KriType : []
    }
    this.service.KRIValues.next(dropDowns);
    this.updateTable();
  }

  updateTable() {
    this.dataSource.data = this.buildKriChartData(this.filterData);
    let result: any[] = [];
    try {
      result = this.buildKriChartData(JSON.parse(this.service.KRIResultsNew ?? '[]'));
    } catch {
      result = [];
    }

    this.year = new Date().getFullYear();
    let startDate = new Date(this.qEndDate).getTime();
    this.dataSource.data = result.filter((d: any) => {
      var time = new Date(d.KRICreatedDate).getTime();
      return (time <= startDate);
    });

    var vardata = new Date().getFullYear();
    let currentDate = new Date();
    let currMonth = currentDate.getMonth() + 1;
    let currQuarter = Math.ceil(currMonth / 3);
    let selectedQuarter1 = 'Q' + currQuarter + '-' + vardata.toString().substr(2, 2);
    let quarterFilter = 'Q' + ((this.quarterValue !== undefined && this.quarterValue > 0) ? this.quarterValue : currQuarter) + '-' + this.yearValue.toString().substr(2, 2);

    // if (selectedQuarter1 != quarterFilter) {
    //   var PreviousQuarterData: any = [];
    //   this.dataSource.data.forEach((item: any) => {
    //     if (item.PreviousQuarterData != "Not Measured") {
    //       var arrayData = item.PreviousQuarterData;
    //       var id = 0;
    //       var ind = undefined;
    //       for (let i = 0; i < arrayData?.length; i++) {
    //         if (id < arrayData[i].MeasurementID && arrayData[i].Quater == quarterFilter) {
    //           id = arrayData[i].MeasurementID;
    //           ind = i
    //         }
    //       }
    //       if (ind != undefined && ind != null) {
    //         PreviousQuarterData.push(arrayData[ind])
    //       } else {
    //         PreviousQuarterData.push(item)
    //       }
    //     } else if (item.PreviousQuarterData == "Not Measured" && item.Quater == quarterFilter) {
    //       PreviousQuarterData.push(item)
    //     } else {
    //       item.Date = null;
    //       item.Period = null
    //       item.KRI_Status = "Not Measured";
    //       item.IsReported = null;
    //       item.Measurement = null;
    //       item.MeasurementValue = null;
    //       item.Remark = null;
    //       item.Quater = null
    //       item.KRI_Value = null;
    //       item.ColorCode = "#FFFFFF"
    //       PreviousQuarterData.push(item)
    //     }
    //   });
    //   PreviousQuarterData.forEach((item: any) => {
    //     if (item.Quater != quarterFilter) {
    //       item.Date = null;
    //       item.Period = null;
    //       item.KRI_Status = "Not Measured";
    //       item.IsReported = null;
    //       item.Measurement = null;
    //       item.MeasurementValue = null;
    //       item.Remark = null;
    //       item.Quater = null
    //       item.ColorCode = "#FFFFFF"
    //       item.KRI_Value = null;
    //     }
    //     else if (item.KRI_Status !== 'Not Measured') {
    //       item.Date = item.Date;
    //       item.Period = item.Period;
    //       item.KRI_Status = item.KRI_Status;
    //       item.IsReported = item.IsReported;
    //       item.Measurement = item.Measurement;
    //       item.MeasurementValue = item.MeasurementValue;
    //       item.Remark = item.Remark;
    //       item.Quater = item.Quater
    //       item.ColorCode = item.ColorCode
    //       item.KRI_Value = item.KRI_Value;
    //     }
    //     else if (item.KRI_Status == 'Not Measured') {
    //       item.Date = null;
    //       item.Period = null;
    //       item.KRI_Status = 'Not Measured';
    //       item.IsReported = null;
    //       item.Measurement = null;
    //       item.MeasurementValue = null;
    //       item.Remark = null;
    //       item.Quater = null
    //       item.ColorCode = "#FFFFFF"
    //       item.KRI_Value = null;
    //     }
    //   })
    //   this.dataSource.data = PreviousQuarterData.filter(
    //     (obj: any) =>
    //       parseInt(obj.KRI_Defined_Quater.split('-')[1]) <= this.yearValue.toString().substr(2, 2)
    //   );
    // } else {
    //   this.dataSource.data = [];
    //   try {
    //     this.dataSource.data = JSON.parse(this.service.KRIResultsNew ?? '[]');
    //   } catch {
    //     this.dataSource.data = [];
    //   }
    //   if (selectedQuarter1 == quarterFilter) {
    //     this.dataSource.data.forEach((kri: any) => {
    //       // console.log('kri::', kri);
    //       var kridate = kri.Date;
    //       var kriFrequency = kri.MeasurementFrequencyID;
    //       // console.log('KRICode::', kri.KRICode);
    //       // console.log('kridate::', kridate);
    //       // console.log('kriFrequency::', kriFrequency);
    //       // console.log('this.reportFrequencyData::', this.reportFrequencyData);
    //       // console.log('isKriInDateRange::', (isKriInDateRange(kridate, kriFrequency, this.reportFrequencyData)));

    //       if (!(isKriInDateRange(kridate, kriFrequency, this.reportFrequencyData))) {
    //         kri.Period = null;
    //         kri.Date = null;
    //         kri.IsReported = null;
    //         kri.Measurement = null;
    //         kri.MeasurementValue = null;
    //         kri.KriScore = null;
    //         kri.ThresholdValue = null;
    //         kri.Remark = null;
    //         kri.KRI_Status = "Not Measured";
    //         kri.evidences = null;
    //         kri.ColorCode = "#FFFFFF"
    //         kri.KRI_Value = null;
    //       }
    //       if (kri.Remark == null || kri.Remark == "") {
    //         kri.KRI_Status = "Not Measured";
    //         kri.Date = null;
    //         kri.Period = null;
    //         kri.KRI_Value = null;
    //         kri.ColorCode = "#FFFFFF"
    //         kri.MeasurementValue = null;
    //         kri.Measurement = null;
    //       }
    //     });
    //   }
    // }

    if (this.globalSearchValue && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) => {
        return Object.values(i).join("").toLowerCase().includes(this.globalSearchValue.toLowerCase())
      });
      let table = document.getElementById("KRITable");
      setTimeout(() => {
        table?.click();
      }, 100);
    }


    if (this.selectedMeasureFreq && this.selectedMeasureFreq != 'All' && this.dataSource.data) {
      // console.log('inside selectedMeasureFreq: ', this.selectedMeasureFreq);
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.MeasurementFrequency == this.selectedMeasureFreq
      );
    }
    if (this.selectedKriType && this.selectedKriType != 'All' && this.dataSource.data) {
      // console.log('inside selectedKriType: ', this.selectedKriType);
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.KRI_Type == this.selectedKriType
      );
    }
    if (this.selectedKriValue && this.selectedKriValue != 'All' && this.dataSource.data) {
      // console.log('inside selectedKriValue: ', this.selectedKriValue);
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.KRI_Value == this.selectedKriValue
      );
    }
    if (this.selectedKriStatus && this.selectedKriStatus != 'All' && this.dataSource.data) {
      // console.log('inside selectedKriStatus: ', this.selectedKriStatus);
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.KRI_Status == this.selectedKriStatus
      );
    }

    // --- NEW: Month filter using Period field ---
    if (this.selectedMonth && this.selectedMonth !== 'All' && this.dataSource.data) {
      const period = this.getPeriodFromSelectedMonth(this.selectedMonth);
      if (period) {
        const normalizedPeriod = period.trim().toLowerCase();
        // console.log('filtering by selectedMonth -> normalizedPeriod, period:', normalizedPeriod, period);
        this.dataSource.data = this.dataSource.data.filter((i: any) => {
          const recPeriod = (i.Period ?? '').toString().trim().toLowerCase();
          return recPeriod === normalizedPeriod;
        });
      } else {
        console.warn('selectedMonth could not be normalized to period format:', this.selectedMonth);
      }
    }

    console.log(
      'updateTable-output:',
      JSON.stringify(
        this.dataSource.data.map(r => ({
          KRICode: r.KRICode,
          KRICreatedDate: r.KRICreatedDate,
          MeasurementFrequency: r.MeasurementFrequency,
          Period: r.Period,
          KRI_Status: r.KRI_Status
        }))
      )
    );


    this.updateStatusCounts();
  }

  updateStatusCounts() {
    this.KRICount = this.dataSource.data.length;

    if (this.dataSource.data.length > 0) {
      this.dataSource.data.forEach(i => {
        if (i.MeasurementValue != null && i.MeasurementValue != undefined) {
          i.Measurement = i.MeasurementValue;
        }
      });

      this.reported = this.dataSource.data.filter(i => i.KRI_Status === 'Reported').length;
      this.measured = this.dataSource.data.filter(i => i.KRI_Status === 'Measured').length;
      this.notMeasured = this.dataSource.data.filter(i => i.KRI_Status === 'Not Measured').length;
      this.rejected = this.dataSource.data.filter(i => i.KRI_Status === 'Rejected').length;
      this.approved = this.dataSource.data.filter(i => i.KRI_Status === 'Approved').length;
    }

    // NEW — use helper to set periodReport cleanly  
    this.periodReport = this.getPeriodReport();
  }

  private getPeriodReport(): string {
    // --- If a month is selected, show "Mon YYYY" ---
    if (this.selectedMonth) {
      return this.getFormattedMonthPeriod(this.selectedMonth);
    }

    // --- Otherwise show quarter range ---
    return this.getQuarterRangePeriod();
  }

  private getFormattedMonthPeriod(selectedMonth: string): string {
    // If getPeriodFromSelectedMonth exists, use it
    let periodStr: string | null = null;

    if (typeof (this as any).getPeriodFromSelectedMonth === 'function') {
      try {
        periodStr = (this as any).getPeriodFromSelectedMonth(selectedMonth);
      } catch { periodStr = null; }
    }

    // fallback: use selectedMonth directly
    periodStr = periodStr ?? selectedMonth;

    // Normalize to "Mon YYYY"
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const parts = periodStr.split(/\s+/).filter(p => p);
    if (parts.length < 2) return periodStr;

    let mon = parts[0];
    let yr = parts.slice(1).join(' ');

    // Convert full month → short month
    const fi = fullMonths.findIndex(fm => fm.toLowerCase() === mon.toLowerCase());
    if (fi !== -1) {
      mon = shortMonths[fi];
    } else {
      // maybe already short → standardize to correct capitalisation
      const si = shortMonths.findIndex(sm => sm.toLowerCase() === mon.toLowerCase().slice(0, 3));
      if (si !== -1) mon = shortMonths[si];
    }

    return `${mon} ${yr}`;
  }

  private getQuarterRangePeriod(): string {
    switch (this.quarterValue) {
      case 1:
        return `Jan ${this.yearValue} - Mar ${this.yearValue}`;
      case 2:
        return `Apr ${this.yearValue} - Jun ${this.yearValue}`;
      case 3:
        return `Jul ${this.yearValue} - Sep ${this.yearValue}`;
      case 4:
        return `Oct ${this.yearValue} - Dec ${this.yearValue}`;
      default:
        return '';
    }
  }

  /** helper to preserve your original quarter-range logic in one place */
  private setQuarterRangePeriodReport() {
    if (this.quarterValue == 1) {
      this.periodReport = 'Jan ' + this.yearValue + ' - Mar ' + this.yearValue;
    } else if (this.quarterValue == 2) {
      this.periodReport = 'Apr ' + this.yearValue + ' - Jun ' + this.yearValue;
    } else if (this.quarterValue == 3) {
      this.periodReport = 'Jul ' + this.yearValue + ' - Sep ' + this.yearValue;
    } else if (this.quarterValue === 4) {
      this.periodReport = 'Oct ' + this.yearValue + ' - Dec ' + this.yearValue;
    } else {
      this.periodReport = '';
    }
  }


  private buildKriChartData(data: any[]): any[] {
    const REQUIRED_KEYS = [
      'MetricID', 'KRICode', 'KRICreatedDate', 'Unit', 'Frequency', 'Period', 'Date', 'KRI_Status', 'KRI_Value', 'Remark', 'ColorCode',
      'FrequencyID', 'Indicator', 'IsReported', 'KRI_Defined_Quater', 'KRI_Target', 'KRI_Type', 'KRI_Value', 'LastUpdatedDate', 'Measurement',
      'MeasurementFrequency', 'MeasurementFrequencyID', 'MeasurementID', 'MeasurementValue', 'Quater', 'ReportStatusID', 'ReportStatusName',
      'ThresholdID', 'ThresholdValue', 'ThresholdValue1', 'ThresholdValue2', 'ThresholdValue3', 'ThresholdValue4', 'ThresholdValue5', 'UnitID'
    ];

    let kriData: any[] = [];

    // Helper: build object in same sequence
    const buildOrdered = (obj: any) => {
      const ordered: any = {};
      REQUIRED_KEYS.forEach(key => {
        ordered[key] = obj[key] !== undefined ? obj[key] : null;
      });
      return ordered;
    };

    // normalize helper (trim + lowercase) for period comparison
    const normalizePeriod = (p: any): string => (p ?? '').toString().trim().toLowerCase();

    // normalize ID to string for consistent keys
    const normalizeID = (id: any): string => (id === null || id === undefined) ? '' : String(id).trim();

    // global seen set to avoid duplicates: MetricID||KRICode||normalizedPeriod
    const seen = new Set<string>();

    // ---- build kriData from data + PreviousQuarterData ----
    data.forEach((item: any) => {
      // ensure we have KRICreatedDate and Frequency for fallback period calc
      const parentPeriod = item.Period && item.Period !== 'undefined'
        ? item.Period
        : this.getCalculatedPeriod(item);

      const parentKey = `${normalizeID(item.MetricID)}||${item.KRICode}||${normalizePeriod(parentPeriod)}`;

      if (!seen.has(parentKey)) {
        // build parent copy with normalized/filled Period
        const parentRow = buildOrdered({
          ...item,
          Period: parentPeriod
        });
        kriData.push(parentRow);
        seen.add(parentKey);
      }

      if (Array.isArray(item.PreviousQuarterData)) {
        item.PreviousQuarterData.forEach((prev: any) => {
          if (!prev) { return; }

          // merge parent fields to use for period calc / fields if prev lacks them
          const mergedPrev = {
            ...prev,
            KRICreatedDate: prev.KRICreatedDate ?? item.KRICreatedDate,
            Frequency: prev.Frequency ?? item.Frequency ?? item.MeasurementFrequency,
            Unit: prev.Unit ?? item.Unit,
            MetricID: prev.MetricID ?? item.MetricID
          };

          const prevPeriod = mergedPrev.Period && mergedPrev.Period !== 'undefined'
            ? mergedPrev.Period
            : this.getCalculatedPeriod(mergedPrev);

          const prevKey = `${normalizeID(mergedPrev.MetricID)}||${mergedPrev.KRICode}||${normalizePeriod(prevPeriod)}`;

          if (!seen.has(prevKey)) {
            const filteredPrev = buildOrdered({
              ...mergedPrev,
              Period: prevPeriod
            });
            kriData.push(filteredPrev);
            seen.add(prevKey);
          }
        });
      }
    });

    // ---- fill missing Period using KRICreatedDate (just in case) ----
    kriData.forEach(kri => {
      if (!kri.Period || kri.Period === null || kri.Period === '' || kri.Period === 'undefined') {
        kri.Period = this.getCalculatedPeriod(kri);
      }
    });

    // ---- ADD MISSED RECORDS BASED ON KRICreatedDate + Frequency ----
    const now = new Date();
    const groups = new Map<string, any[]>();

    // group by normalized MetricID + KRICode + Frequency + Unit
    kriData.forEach(kri => {
      const groupKey = `${normalizeID(kri.MetricID)}||${kri.KRICode}||${kri.Frequency ?? kri.MeasurementFrequency}||${kri.Unit}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(kri);
    });

    const missingRecords: any[] = [];

    groups.forEach(items => {
      const sample = items[0];
      // robust frequency fallback (your data uses MeasurementFrequency)
      const freq = sample.Frequency ?? sample.MeasurementFrequency;
      if (!freq) { return; }

      // existing periods in this group (normalized)
      const existingPeriods = new Set<string>();
      items.forEach(x => {
        if (x.Period) {
          existingPeriods.add(normalizePeriod(x.Period));
        }
      });

      // earliest KRICreatedDate in this group
      const validDates = items
        .map(x => x.KRICreatedDate)
        .filter((d: any) => !!d)
        .map((d: any) => new Date(d).getTime());

      if (!validDates.length) { return; }

      // start cursor at the first day of the earliest month (time normalized)
      let cursor = new Date(Math.min(...validDates));
      cursor.setDate(1);
      cursor.setHours(0, 0, 0, 0);

      // helper: compare month/year (cursor <= now by month)
      const monthYearLE = (a: Date, b: Date) => {
        if (a.getFullYear() < b.getFullYear()) return true;
        if (a.getFullYear() > b.getFullYear()) return false;
        return a.getMonth() <= b.getMonth();
      };

      // walk until current month
      while (monthYearLE(cursor, now)) {
        const tempKri = {
          KRICreatedDate: cursor.toISOString(),
          Frequency: freq
        };

        const expectedPeriodRaw: string = this.getCalculatedPeriod(tempKri) || '';
        const expectedPeriodKey = normalizePeriod(expectedPeriodRaw);

        if (expectedPeriodKey && !existingPeriods.has(expectedPeriodKey)) {
          const newObj = buildOrdered({
            MetricID: sample.MetricID,
            KRICode: sample.KRICode,
            Indicator: sample.Indicator,
            KRI_Target: sample.KRI_Target,
            KRI_Type: sample.KRI_Type,
            ThresholdID: sample.ThresholdID,
            ThresholdValue1: sample.ThresholdValue1,
            ThresholdValue2: sample.ThresholdValue2,
            ThresholdValue3: sample.ThresholdValue3,
            ThresholdValue4: sample.ThresholdValue4,
            ThresholdValue5: sample.ThresholdValue5,
            KRICreatedDate: cursor.toISOString(),
            Unit: sample.Unit,
            Frequency: freq,
            MeasurementFrequency: freq,
            Period: expectedPeriodRaw.trim(),
            Date: null,
            KRI_Status: 'Not Measured',
            KRI_Value: null,
            Remark: null
          });

          // check global seen (to be safe) before adding
          const newKey = `${normalizeID(newObj.MetricID)}||${newObj.KRICode}||${normalizePeriod(newObj.Period)}`;
          if (!seen.has(newKey)) {
            missingRecords.push(newObj);
            seen.add(newKey);
            existingPeriods.add(expectedPeriodKey);
          }
        }

        // move cursor based on frequency; normalize day/time to avoid skipping
        if (freq === 'Monthly') {
          cursor.setMonth(cursor.getMonth() + 1);
        } else if (freq === 'Quarterly') {
          cursor.setMonth(cursor.getMonth() + 3);
        } else if (freq === 'Semi Annual' || freq === 'Semi-Annual' || freq === 'SemiAnnual') {
          cursor.setMonth(cursor.getMonth() + 6);
        } else {
          // Yearly or default
          cursor.setFullYear(cursor.getFullYear() + 1);
        }
        cursor.setDate(1);
        cursor.setHours(0, 0, 0, 0);
      }
    });

    kriData.push(...missingRecords);

    // ----- existing summary logic (uncomment if you want) -----
    // this.approved = kriData.filter((ele: any) => ele.KRI_Status === 'Approved').length;
    // this.rejected = kriData.filter((ele: any) => ele.KRI_Status === 'Rejected').length;
    // this.totalCountOfKri = kriData.length;

    kriData.sort((a: any, b: any) => {
      const aId = Number(normalizeID(a.MetricID) || 0);
      const bId = Number(normalizeID(b.MetricID) || 0);
      return aId - bId;
    });

    return kriData;
  }


  getCalculatedPeriod(kri: any): string {
    if (!kri.KRICreatedDate) return '';

    const currentDateObj = new Date(kri.KRICreatedDate);
    const year = currentDateObj.getFullYear().toString();
    const month = currentDateObj.getMonth();

    if (kri.Frequency === 'Monthly') {
      return `${this.months[month]} ${year}`;
    } else if (kri.Frequency === 'Quarterly') {
      return this.getQuarterch(currentDateObj); // make sure this also returns trimmed
    } else if (kri.Frequency === 'Semi Annual') {
      return (month < 6 ? 'Jan-Jun ' : 'Jul-Dec ') + year;
    } else {
      return 'Jan-Dec ' + year;
    }
  }

  getQuarterch(newDateObj: any) {
    let finaltype: string = '';
    var date = new Date(newDateObj);
    var month = Math.floor(date.getMonth() / 3) + 1;
    month -= month > 4 ? 4 : 0;
    var year = date.getFullYear();
    switch (month) {
      case 1:
        finaltype = "Jan-Mar " + year;
        break;
      case 2:
        finaltype = "Apr-Jun " + year;
        break;
      case 3:
        finaltype = "Jul-Sep " + year
        break;
      case 4:
        finaltype = "Oct-Dec " + year
        break;
      default:
        break;
    }
    return finaltype.trim();
  }
  /**
   * Normalize selectedMonth into period format used in data: "Mon YYYY" (e.g. "Oct 2025")
   * Accepts: full month string ("October 2025"), short ("Oct 2025"), or Date object.
   */
  private getPeriodFromSelectedMonth(sel: any): string | null {
    if (!sel) return null;

    // short month names used by data
    const short = this.months; // ['Jan','Feb',...,'Dec']
    const full = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // If Date object
    if (sel instanceof Date) {
      return `${short[sel.getMonth()]} ${sel.getFullYear()}`;
    }

    // If string like "October 2025" or "Oct 2025" or "oct 2025"
    const s = sel.toString().trim();
    // try "FullMonth YYYY"
    for (let i = 0; i < full.length; i++) {
      if (s.toLowerCase().startsWith(full[i].toLowerCase())) {
        // get year part
        const parts = s.split(/\s+/);
        const year = parts.length > 1 ? parts[1] : (new Date().getFullYear()).toString();
        return `${short[i]} ${year}`;
      }
    }
    // try short month "Oct YYYY"
    for (let i = 0; i < short.length; i++) {
      if (s.toLowerCase().startsWith(short[i].toLowerCase())) {
        const parts = s.split(/\s+/);
        const year = parts.length > 1 ? parts[1] : (new Date().getFullYear()).toString();
        return `${short[i]} ${year}`;
      }
    }

    // If it's already in "Mon YYYY" or some format, try to extract parts (fallback)
    const parts = s.split(/\s+/);
    if (parts.length >= 2) {
      const m = parts[0].slice(0, 3); // take first 3 chars
      const yi = parts[1];
      const idx = short.findIndex(x => x.toLowerCase() === m.toLowerCase());
      if (idx !== -1) {
        return `${short[idx]} ${yi}`;
      }
    }

    // Could not normalize
    return null;
  }


  generatePdf() {
    this.utilsService.generatePdf('KRITable', [], 'KriReport');
  }
}