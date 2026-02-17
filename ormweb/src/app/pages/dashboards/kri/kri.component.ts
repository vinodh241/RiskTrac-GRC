import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { KriPopupComponent } from './kri-popup/kri-popup.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { KriMigrationUnitComponent } from './kri-migration-unit/kri-migration-unit.component';

export interface KriData {
  Date: string,
  Frequency: string,
  FrequencyID: number,
  Indicator: string,
  KRICode: string,
  KRI_Target: string,
  KRI_Type: string,
  KRI_Value: string,
  MeasurmentFrequency: string,
  MeasurmentID: string,
  MeasurmentValue: number,
  MetricID: string,
  Period: string,
  Quater: string,
  Remark: string,
  ThresholdID: number,
  ThresholdValue1: number
  ThresholdValue2: number
  ThresholdValue3: number
  ThresholdValue4: number
  ThresholdValue5: number
  Unit: string,
  UnitID: number
}
export interface kriRedZone {
  unit: string,
  count: number,
  percent: number
}
const KriData = []
@Component({
  selector: 'app-kri',
  templateUrl: './kri.component.html',
  styleUrls: ['./kri.component.scss']
})
export class KriDashboardComponent implements OnInit {
  kriScoreData: any = [
    { "KRIValue": 1, "KriID": 1, "KriScore": 10, "ColorCode": 1, },
    { "KRIValue": 2, "KriID": 1, "KriScore": 20, "ColorCode": 2, },
    { "KRIValue": 3, "KriID": 1, "KriScore": 30, "ColorCode": 3, },
    { "KRIValue": 4, "KriID": 1, "KriScore": 40, "ColorCode": 4, },
    { "KRIValue": 5, "KriID": 1, "KriScore": 50, "ColorCode": 5, }
  ]
  colorCode: any[] = [{ 'colorCode': '#991313' }, { 'colorCode': '#A06000' }, { 'colorCode': '#00526C' }, { 'colorCode': '#6D7007' }, { 'colorCode': '#045C19' },]
  KeyRiskIndicatorCycleReporting: any
  cycleReport: any[] = [{ "bgColor": '#FF5473' }, { "bgColor": '#096826' }, { "bgColor": '#FFB26B' }]
  kriScore: any[] = [];
  MainData: any[] = [];
  currentData: any[] = [];
  unitData: any;
  color1: any
  color2: any
  color3: any
  color4: any
  color5: any
  totalDaysinQuater: any;
  chartData: any;
  container: any;
  countData: any;
  // hiddenVal: boolean = true;
  unitsListData: any;
  currentQuarter: any;
  colorData: any;
  displayedColumns1: string[] = ['unit', 'count', 'percent']
  dataSource: MatTableDataSource<KriData> | any = new MatTableDataSource();
  dataSource1: MatTableDataSource<KriData> | any = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | undefined;
  countOfKri: any;
  totalCountOfKri: any;
  quaterDateRange: any;
  unitDataAmber: any;
  yearData: any;
  quaterData: any;
  KRICode: any;
  period: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  approved: any;
  rejected: any;
  approvedData: any;
  rejectedData: any;
  quarterFilter: any;
  reportingFrequencyData: any[] = [];
  rawKriScore: any[] = [];
  selectedMonth!: number;   // 1–12
  quarterMonths: { name: string; month: number; cssClass: string }[] = [];
  fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    public DashboardService: DashboardService,
    public dialog: MatDialog
  ) {
    this.DashboardService.getKeyRiskIndicator();
    this.DashboardService.getYearQuarterData();
    this.DashboardService.gotMasterIndicator.subscribe((values) => {
      if (values) {
        this.DashboardService.gotYearQuater.subscribe((value) => {
          if (value == true) {
            this.yearData = this.DashboardService.yearValue
            this.quaterData = this.DashboardService.quaterValue
          }
          let currentDate = new Date();
          let currMonth = currentDate.getMonth() + 1;
          let currQuarter = Math.ceil(currMonth / 3);
          this.quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
          this.currentQuarter = this.currentQuaterData(this.yearData, this.quaterData);
          let result = [];
          result = JSON.parse(this.DashboardService.masterIndicatorNew);
          let sss: any
          if (this.DashboardService.quaterValue == 1) {
            sss = `3/31/${this.DashboardService.yearValue}`
          } else if (this.DashboardService.quaterValue == 2) {
            sss = `6/30/${this.DashboardService.yearValue}`
          } else if (this.DashboardService.quaterValue == 3) {
            sss = `9/30/${this.DashboardService.yearValue}`
          } else if (this.DashboardService.quaterValue == 4) {
            sss = `12/31/${this.DashboardService.yearValue}`
          }
          let startDate = new Date(sss).getTime();
          this.kriScore = result.filter((d: any) => {
            var time = new Date(d.KRICreatedDate).getTime();
            return (time <= startDate);
          });
          var vardata = new Date().getFullYear();
          let selectedQuarter1 = 'Q' + currQuarter + '-' + vardata.toString().substr(2, 2); // Q1-23 KRICreatedDate
          if (selectedQuarter1 != this.quarterFilter) {
            var PreviousQuarterData: any = [];
            this.kriScore.forEach((item: any) => {
              if (item.PreviousQuarterData != "Not Measured") {
                var arrayData = item.PreviousQuarterData;
                var id = 0;
                var ind = undefined;
                for (let i = 0; i < arrayData?.length; i++) {
                  if (id < arrayData[i].MeasurementID && arrayData[i].Quater == this.quarterFilter) {
                    id = arrayData[i].MeasurementID;
                    ind = i
                  }
                }
                if (ind != undefined && ind != null) {
                  PreviousQuarterData.push(arrayData[ind])
                } else {
                  PreviousQuarterData.push(item)
                }
              } else if (item.PreviousQuarterData == "Not Measured" && item.Quater == this.quarterFilter) {
                PreviousQuarterData.push(item)
              } else {
                // item.Date = null;
                // item.Period = null
                // item.KRI_Status = "Not Measured";
                // item.IsReported = "false";
                // item.MeasurementValue = null;
                // item.Remark = null;
                // item.Quater = null
                // item.KRI_Value = null;
                PreviousQuarterData.push(item)
              }
            });
            // PreviousQuarterData.forEach((item: any) => {
            //   if (item.Quater != this.quarterFilter) {
            //     item.Date = null;
            //     item.Period = null
            //     item.KRI_Status = "Not Measured";
            //     item.IsReported = "false";
            //     item.MeasurementValue = null;
            //     item.Remark = null;
            //     item.Quater = null
            //     item.KRI_Value = null;
            //   }
            // });
            this.kriScore = PreviousQuarterData
            for (let i = 0; i < this.kriScore.length; i++) {
              if (this.kriScore[i].KRI_Status === null) {
                this.kriScore[i].KRI_Status = "Not Measured";
              }
            }
          } else {
            this.KRICode = this.DashboardService.masterKRICode;
            this.kriScore = JSON.parse(this.DashboardService.masterIndicatorNew);
            this.reportingFrequencyData = this.DashboardService.reportingFrequencyData;
            // if (selectedQuarter1 == this.quarterFilter) {
            // this.kriScore.forEach((kri: any) => {
            //   var kridate = kri.Date;
            //   var kriFrequency = kri.MeasurementFrequencyID;
            //   if (!(isKriInDateRange(kridate, kriFrequency, this.reportingFrequencyData))) {
            //     kri.Period = null;
            //     kri.Date = null;
            //     kri.IsReported = null;
            //     kri.Measurement = null;
            //     kri.ThresholdValue = null;
            //     kri.Remark = null;
            //     kri.KRI_Value = null;
            //     kri.KRI_Status = "Not Measured";
            //     kri.evidences = null;
            //     kri.ColorCode = "#FFFFFF"
            //   }
            // });
            // }
          }
          // Keep a copy of quarter-level data
          this.rawKriScore = this.kriScore ? this.kriScore.slice() : [];
          // console.log('this.rawKriScore::', JSON.stringify(this.rawKriScore));
          // Colour codes still based on quarter data
          this.KRICode.forEach((kri: any) => {
            if (kri.KRI_Value == 1) { this.color1 = kri.ColorCode }
            else if (kri.KRI_Value == 2) { this.color2 = kri.ColorCode }
            else if (kri.KRI_Value == 3) { this.color3 = kri.ColorCode }
            else if (kri.KRI_Value == 4) { this.color4 = kri.ColorCode }
            else if (kri.KRI_Value == 5) { this.color5 = kri.ColorCode }
          });
          // Build months for the quarter and set default selected month
          this.initQuarterMonths();
          this.setDefaultMonthSelection();
          // Apply month filter: this will also set chartData, approved, etc.
          this.applyMonthFilter();
        })
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onMonthClick(m: { month: number }): void {
    if (!m) { return; }
    this.selectedMonth = m.month;
    this.applyMonthFilter();
  }

  private initQuarterMonths(): void {
    // Use selected quarter or current quarter if not set
    const currentDate = new Date();
    const currMonth = currentDate.getMonth() + 1;
    const currQuarter = Math.ceil(currMonth / 3);
    const q = (this.quaterData !== undefined && this.quaterData > 0)
      ? this.quaterData
      : currQuarter;
    const year = this.yearData || currentDate.getFullYear();
    // First month of quarter: Q1=1, Q2=4, Q3=7, Q4=10
    const firstMonth = (q - 1) * 3 + 1;
    this.quarterMonths = [0, 1, 2].map((offset, idx) => {
      const m = firstMonth + offset;
      return {
        month: m,
        name: this.fullMonthNames[m - 1],
        cssClass: `month-${idx + 1}` // to reuse your existing month-one/two/three colors
      };
    });
  }

  private setDefaultMonthSelection(): void {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    const monthInQuarter = this.quarterMonths.some(m => m.month === todayMonth);
    if (todayYear === this.yearData && monthInQuarter) {
      // If today is inside the selected quarter, default to current month
      this.selectedMonth = todayMonth;
    } else {
      // Otherwise default to first month of that quarter
      this.selectedMonth = this.quarterMonths[0]?.month;
    }
  }

  private applyMonthFilter(): void {
    if (!this.rawKriScore || !this.selectedMonth) {
      return;
    }
    const refYear = this.yearData || new Date().getFullYear();
    const selMonth = Number(this.selectedMonth); // assume 1..12
    // Build months to include
    const monthsToInclude: Array<{ m: number; y: number }> = [];
    if (selMonth === 12) {
      monthsToInclude.push({ m: 12, y: refYear }, { m: 11, y: refYear }, { m: 10, y: refYear });
    } else {
      monthsToInclude.push({ m: selMonth, y: refYear });
      const prev = selMonth - 1;
      if (prev === 0) monthsToInclude.push({ m: 12, y: refYear - 1 });
      else monthsToInclude.push({ m: prev, y: refYear });
    }
    const includeSet = new Set(monthsToInclude.map(x => `${x.y}-${x.m}`));
    // Filter by KRICreatedDate ONLY and add parent's KRICreatedDate to nested PreviousQuarterData items (if array)
    const filtered = this.rawKriScore
      .filter((d: any) => {
        const rawDate = d.KRICreatedDate;
        if (!rawDate) return false;
        const dt = new Date(rawDate);
        if (Number.isNaN(dt.getTime())) return false;
        const key = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
        return includeSet.has(key);
      })
      .map((d: any) => {
        // shallow copy parent
        const parentCopy = { ...d };
        // only if PreviousQuarterData exists and is an array, copy and inject KRICreatedDate
        if (Array.isArray(parentCopy.PreviousQuarterData)) {
          parentCopy.PreviousQuarterData = parentCopy.PreviousQuarterData.map((pq: any) => {
            // if pq already has a KRICreatedDate (was the real date for that nested measurement),
            // keep it; otherwise fall back to the parent's KRICreatedDate.
            return { ...pq, KRICreatedDate: pq.KRICreatedDate ?? parentCopy.KRICreatedDate };
          });
        }

        return parentCopy;
      });
    this.recalcDashboardFromKriScore(filtered);
  }

  private recalcDashboardFromKriScore(filtered: any[]): void {
    this.kriScore = filtered;
    this.MainData = this.buildKriChartData(filtered); // here i can gert whole quarter data
    this.currentData = this.getSelectedMonthData(this.MainData); //  here i am getting current selected month data
    this.chartData = this.currentData;
    this.getAllKriScoreData();
    this.getAllkriAmber();
    this.getMigrationData();
    this.getReportingCycle();
    // this.hiddenVal = filtered.length <= 11;
  }

  private buildKriChartData(data: any[]): any[] {
    let kriData: any[] = [];
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
        const parentRow = {
          ...item,
          Period: parentPeriod
        };
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
            const filteredPrev = {
              ...mergedPrev,
              Period: prevPeriod
            };
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
          const newObj = {
            MetricID: sample.MetricID,
            KRICode: sample.KRICode,
            KRICreatedDate: cursor.toISOString(),
            Unit: sample.Unit,
            Frequency: freq,
            Period: expectedPeriodRaw.trim(),
            Date: null,
            KRI_Status: 'Not Measured',
            KRI_Value: null,
            Remark: null
          };
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
    kriData.sort((a: any, b: any) => {
      const aId = Number(normalizeID(a.MetricID) || 0);
      const bId = Number(normalizeID(b.MetricID) || 0);
      return aId - bId;
    });

    return kriData;
  }

  parseSelectedMonth(sel: any): Date {
    if (!sel) return new Date(); // fallback to today
    if (sel instanceof Date) return new Date(sel.getFullYear(), sel.getMonth(), 1);
    if (typeof sel === 'number') {
      // treat as month number (1-12) in current year
      const year = this.yearData || new Date().getFullYear();
      return new Date(year, sel - 1, 1);
    }
    if (typeof sel === 'string') {
      // expect formats like "Oct 2025", "Oct-2025", "October 2025"
      const cleaned = sel.replace('-', ' ').trim();
      // try Date parse via "1 <cleaned>" -> "1 Oct 2025"
      const tryParse = new Date('1 ' + cleaned);
      if (!isNaN(tryParse.getTime())) return new Date(tryParse.getFullYear(), tryParse.getMonth(), 1);
      // fallback: return today
      return new Date();
    }
    // fallback
    return new Date();
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

  getSelectedMonthData(kriData: any[] = []): any[] {
    // obtain selected month date (use whichever variable you have in scope)
    const sel = this.selectedMonth;
    const selDate = this.parseSelectedMonth.call(this, sel);
    // convert selected month to Period format e.g. "Oct 2025"
    const selectedPeriodString = selDate.toLocaleString('en-US', {
      month: 'short',
      year: 'numeric'
    }); // → "Oct 2025"
    // allowedPeriods is ONLY the selected month
    const allowedPeriods = [selectedPeriodString];
    // apply filter
    kriData = kriData.filter((rec: any) => allowedPeriods.includes(rec.Period));
    // ----- existing summary logic (uncomment if you want) -----
    this.approved = kriData.filter((ele: any) => ele.KRI_Status === 'Approved').length;
    this.rejected = kriData.filter((ele: any) => ele.KRI_Status === 'Rejected').length;
    this.totalCountOfKri = kriData.length;
    return kriData;
  }

  getQuarternew(newDateObj: any) {
    var finaltype;
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
    return finaltype;
  }

  getPeriod(id: any) {
    let frequencyId = id;
    var currentDateObj = new Date();
    var numberOfMlSeconds = currentDateObj.getTime();
    var addMlSeconds = 60 * 60 * 1000;
    var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
    let month = new Date(newDateObj).getMonth();
    let year = ' ' + new Date().getFullYear() + ' '
    switch (frequencyId) {
      case 1:
        this.period = this.months[month] + year;
        break;
      case 2:
        this.period = this.getQuarter();
        break;
      case 3:
        this.period = month < 6 ? 'Jan-Jun ' + year : 'Jul-Dec ' + year
        break;
      case 4:
        this.period = 'Jan-Dec ' + year
        break;
    };
  }

  getQuarter() {
    var finaltype;
    var date = new Date();
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
    return finaltype;
  }

  getColorCodeData(val: any) {
    if (val == 1) {
      return this.color1
    } else if (val == 2) {
      return this.color2
    } else if (val == 3) {
      return this.color3
    } else if (val == 4) {
      return this.color4
    } else if (val == 5) {
      return this.color5
    }
  }

  getAllFourData(source: any[]) {
    if (!Array.isArray(source)) return [];
    const dt = [...source].sort((a, b) => b.Count - a.Count);
    // return only existing items (max 3)
    return dt.slice(0, 3);
  }


  getKriScoreData(i: any) {
    const result = this.currentData.filter(da => da.KRI_Value == i)
    return this.removeDummyDtNew(result).length
  }

  getDifferene(p1: any, p2: any): any {
    let value = {}
    if (p1 == p2) {
      value = { 'data': 0, 'color': 'green', 'currentData': p1, 'previousData': p2 }
    }
    else if (p1 > 0 && p2 == 0) {
      let d = 100
      value = { 'data': Math.ceil(d), 'color': 'green', 'currentData': p1, 'previousData': p2, }
    }
    else if (p2 > 0 && p1 == 0) {
      let d = p2 * 100
      value = { 'data': Math.ceil(d), 'color': 'red', 'currentData': p1, 'previousData': p2, }
    }
    else if (p1 == 0 || p2 == 0) {
      value = { 'data': -1, 'color': '', 'currentData': p1, 'previousData': p2, }
    }
    else if (p1 > p2) {
      let vt = p1 - p2
      let t = p1
      let d = (vt / t) * 100
      value = { 'data': Math.ceil(d), 'color': 'green', 'currentData': p1, 'previousData': p2, }
    } else if (p1 < p2) {
      let vt = p2 - p1
      let t = p1
      let d = (vt / t) * 100
      value = { 'data': Math.ceil(d), 'color': 'red', 'currentData': p1, 'previousData': p2, }
    }
    return value
  }

  getSymbol(el: any) {
    if (el == -1) {
      return '-'
    } else {
      return el + '%'
    }
  }

  getPercentageNew(dt: any) {
    let currentData = dt.filter((dt: any) => dt.KRI_Value == 1).length;
    let previewData = dt.filter((dt: any) => dt.KRI_Value_last == 1).length;
    return this.getDifferene(previewData, currentData)
  }

  getPercentage(dt: any, pt: any) {
    let currentData = dt.filter((dt: any) => dt.KRI_Value == 1).length;
    let previewData = pt.filter((pt: any) => pt.KRI_Value == 1).length;
    return this.getDifferene(previewData, currentData)
  }

  getPercentageamber(dt: any, pt: any) {
    let currentData = dt.filter((dt: any) => dt.KRI_Value == 2).length;
    let previewData = pt.filter((pt: any) => pt.KRI_Value == 2).length;
    return this.getDifferene(previewData, currentData)
  }

  getAllkriAmber() {
    const { currentMonthData: currentData, previousMonthData: Prdata } = this.splitMasterBySelectedAndPreviousMonth(this.MainData || []);
    const UnitAmberData = []
    let dt = []
    for (let i of currentData) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of currentData) {
        let start = currentData.filter((da: any) => da.Unit == i)
        let start1 = Prdata.filter((da: any) => da.Unit == i)
        obj = {
          Unit: i,
          Count: currentData.filter((da: any) => da.Unit == i && da.KRI_Value == 2).length,
          Percent: this.getPercentageamber(start, start1).data,
          color: this.getPercentageamber(start, start1).color,
          current: this.getPercentageamber(start, start1).currentData,
          previous: this.getPercentageamber(start, start1).previousData
        }
        list = obj
      }
      UnitAmberData.push(list)
    }
    this.unitDataAmber = UnitAmberData
    if (currentData.length > 0) {
      this.dataSource1.data = this.getAllFourData(UnitAmberData)
    } else {
      this.dataSource1.data = [];
    }
  }

  getAllKriScoreData() {
    const { currentMonthData: currentData, previousMonthData: Prdata } = this.splitMasterBySelectedAndPreviousMonth(this.MainData || []);
    const UnitData = []
    let dt = []
    for (let i of currentData) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of currentData) {
        var start = currentData.filter((da: any) => da.Unit == i)
        var start1 = Prdata.filter((da: any) => da.Unit == i)
        // if (i == "Compliance") {  }
        obj = {
          Unit: i,
          Count: currentData.filter((da: any) => da.Unit == i && da.KRI_Value == 1).length,
          Percent: this.getPercentage(start, start1).data,
          color: this.getPercentage(start, start1).color,
          current: this.getPercentageamber(start, start1).currentData,
          previous: this.getPercentageamber(start, start1).previousData
        }
        list = obj
      }
      UnitData.push(list)
    }
    this.unitData = UnitData
    if (currentData.length > 0) {
      this.dataSource.data = this.getAllFourData(UnitData)
    } else {
      this.dataSource.data = [];
    }
  }

  getIndex(dt: any) {
    let index = 1
    let list = []
    for (let i of dt) {
      i['sno'] = index
      list.push(i)
      index++
    }
    return list
  }

  removeDummyDtNew(result: any) {
    const UnitData = []
    let dt = []
    for (let i of result) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of result) {
        let start = result.filter((da: any) => da.Unit == i)
        obj = {
          Unit: i,
          Count: result.filter((da: { Unit: any; }) => da.Unit == i).length,
          Percent: this.getPercentageNew(start).data,
          color: this.getPercentageNew(start).color
        }
        list = obj
      }
      UnitData.push(list)
    }
    return UnitData
  }

  getName(ad: any) {
    let dts
    if (ad == 1) {
      dts = ' Unit - List of KRI in Red Zone'
    } else if (ad == 2) {
      dts = ' Unit - List of KRI in Amber Zone'
    }
    return dts
  }

  getRow(row: any, id: any) {
    const source = this.currentData;
    const result = (Array.isArray(source) ? source : []).filter((da: any) => da.Unit == row.Unit && da.KRI_Value == id);
    const data = this.getIndex(result);
    this.dialog.open(KriPopupComponent, {
      disableClose: false,
      height: '80vh',
      width: '70vw',
      data: { data: data, name: row.Unit + this.getName(id) }
    });
  }

  openPopUp(va: any): void {
    const source = this.currentData;
    const result = (Array.isArray(source) ? source : []).filter((da: any) => da.KRI_Value == va);
    const data = this.getIndex(this.removeDummyDtNew(result));
    this.dialog.open(KriMigrationUnitComponent, {
      disableClose: false,
      height: '80vh',
      width: '50vw',
      data: { mode: 'unit-1', value: data, kri: result, name: 'Under KRI Score - ' + va }
    });
  }

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: title,
        content: message
      }
    });
    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }

  removeDuplicateValue(data: any) {
    const UnitData = []
    let dt = []
    for (let i of data) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of data) {
        obj = {
          Unit: i,
          Count: data.filter((da: any) => da.Unit == i).length,
        }
        list = obj
      }
      UnitData.push(list)
    }
    return UnitData
  }

  getMigrationData() {
    const { currentMonthData: currentData, previousMonthData: Prdata } = this.splitMasterBySelectedAndPreviousMonth(this.MainData || []);
    let list = []
    let listRedZone = []
    let listgreenYellowZone = []
    for (var i = 0; i < currentData.length; i++) {
      for (var y = 0; y < Prdata.length; y++) {
        if (currentData[i].KRICode == Prdata[y].KRICode) {
          if ((Prdata[y].KRI_Value == 2 || Prdata[y].KRI_Value == 3 || Prdata[y].KRI_Value == 4 || Prdata[y].KRI_Value == 5) && currentData[i].KRI_Value == 1) {
            listRedZone.push(currentData[i])
          } else if ((Prdata[y].KRI_Value == 1 || Prdata[y].KRI_Value == 2 || Prdata[y].KRI_Value == 3) && (currentData[i].KRI_Value == 4 || currentData[i].KRI_Value == 5)) {
            listgreenYellowZone.push(currentData[i])
          }
        }
      }
    }
    if (listgreenYellowZone.length > 0) {
      list.push({ 'idx': 1, 'value': 'Yellow/Green', "dat": this.removeDuplicateValue(listgreenYellowZone), "data": listgreenYellowZone })
    }
    if (listRedZone.length > 0) {
      list.push({ 'idx': 2, 'value': 'Red', "dat": this.removeDuplicateValue(listRedZone), "data": listRedZone })
    }
    this.unitsListData = list
  }

  unitPopUp(id: any): void {
    const { currentMonthData: currentData, previousMonthData: Prdata } = this.splitMasterBySelectedAndPreviousMonth(this.MainData || []);
    const source = currentData;
    const currentMonthData = Array.isArray(source) ? source : [];
    let dt: any[];
    let abc: number;
    let name: string;
    const dts = currentMonthData;

    if (id == 1) {
      abc = 1;
      const units = Array.from(new Set(currentMonthData.map((x: any) => x.Unit)));
      dt = units.map(u => {
        const curitems = currentMonthData.filter((da: any) => da.Unit == u);
        const pritems = Prdata.filter((da: any) => da.Unit == u);

        const redCount = curitems.filter((da: any) => da.KRI_Value == 1).length;
        return {
          Unit: u,
          Count: redCount,
          Percent: this.getPercentage(curitems, pritems).data
        };
      }).sort((a: any, b: any) => b.Count - a.Count);
      name = 'Top Units having # of KRIs in the RED Zone';
    } else if (id == 2) {
      abc = 2;
      const units = Array.from(new Set(currentMonthData.map((x: any) => x.Unit)));
      dt = units.map(u => {
        const curitems = currentMonthData.filter((da: any) => da.Unit == u);
        const pritems = Prdata.filter((da: any) => da.Unit == u);

        const amberCount = curitems.filter((da: any) => da.KRI_Value == 2).length;
        return {
          Unit: u,
          Count: amberCount,
          Percent: this.getPercentageamber(curitems, pritems).data
        };
      }).sort((a: any, b: any) => b.Count - a.Count);
      name = 'Top Units having # of KRIs in the AMBER Zone';
    } else {
      abc = 0;
      const units = Array.from(new Set(currentMonthData.map((x: any) => x.Unit)));
      dt = units.map(u => {
        const curitems = currentMonthData.filter((da: any) => da.Unit == u);
        const pritems = Prdata.filter((da: any) => da.Unit == u);
        return {
          Unit: u,
          Count: curitems.length,
          Percent: this.getPercentageNew(curitems).data
        };
      }).sort((a: any, b: any) => b.Count - a.Count);
      name = 'Top Units';
    }

    this.dialog.open(KriMigrationUnitComponent, {
      disableClose: false,
      height: '80vh',
      width: '60vw',
      data: { mode: 'unit-2', value: this.getIndex(dt), kri: dts, name: name, abc: abc },
    });
  }

  getReportingCycle(): any {
    const { currentMonthData: currentData, previousMonthData: Prdata } = this.splitMasterBySelectedAndPreviousMonth(this.MainData || []);
    this.KeyRiskIndicatorCycleReporting = [
      { cycle: this.getVal(Prdata, currentData, 1).data, cycleText: this.getVal(Prdata, currentData, 1).dif, zone: 'in Red Zone', color: this.color1 },
      { cycle: this.getVal(Prdata, currentData, 5).data, cycleText: this.getVal(Prdata, currentData, 5).dif, zone: 'in Green Zone', color: this.color5 },
      { cycle: this.getUnchanged(Prdata, currentData).data, cycleText: this.getUnchanged(Prdata, currentData).dif, zone: '', color: '#FFB26B' }];
  }

  getVal(Prdata: any, curdata: any, i: any): any {
    let val = {};
    let preData = Prdata.filter((da: any) => (da.KRI_Value === i)).length;
    let curData = curdata.filter((da: any) => da.KRI_Value === i).length;
    if (preData == curData) {
      val = { data: 0, dif: 'unchanged' }
    } else if (curData > 0 && preData == 0) {
      val = { data: 100, dif: 'Increase' }
    } else if (preData > 0 && curData == 0) {
      val = { data: 100, dif: 'Decrease' }
    } else if (curData > preData) {
      let vt = curData - preData
      let t = preData
      let d = (vt / t) * 100
      val = { data: Math.ceil(d), dif: 'Increase' }
    } else if (curData < preData) {
      let vt = preData - curData
      let t = preData
      let d = (vt / t) * 100
      val = { data: Math.ceil(d), dif: 'Decrease' }
    }
    return val
  }

  getUnchanged(Prdata: any, curdata: any,) {
    let dts
    let unchange: any = 0
    for (var i = 0; i < curdata.length; i++) {
      for (var y = 0; y < Prdata.length; y++) {
        if (curdata[i].KRICode == Prdata[y].KRICode) {
          if (Prdata[y].KRI_Value == curdata[i].KRI_Value) {
            unchange = unchange + 1;
          }
        }
      }
    }
    let val = ((unchange / (Prdata.length)) * 100)
    if (unchange == 0 || Prdata.length == 0) {
      dts = 0
    } else {
      dts = val
    }
    return { data: Math.ceil(dts), dif: 'Unchanged' }
  }

  getCountOfSchedule(dts: any) {
    let date_1 = new Date();
    let date_2 = new Date(dts);
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    if (TotalDays > 1) {
      this.totalDaysinQuater = "Approaching due date in " + TotalDays + " days"
    } else if (TotalDays == 1) {
      this.totalDaysinQuater = "Approaching due date in " + TotalDays + " day"
    } else if (TotalDays == 0) {
      this.totalDaysinQuater = "This quarter ends today"
    } else {
      this.totalDaysinQuater = "This quarter has been completed"
    }
  }

  currentQuaterData(year: any, quater: any) {
    if (quater == 1) {
      this.quaterDateRange = `Jan ${year} - Mar ${year}`
      let dts = `3/31/${year}`
      this.getCountOfSchedule(dts)
    } else if (quater == 2) {
      this.quaterDateRange = `Apr ${year} - Jun ${year}`
      let dts = `6/30/${year}`
      this.getCountOfSchedule(dts)
    } else if (quater == 3) {
      this.quaterDateRange = `Jul ${year} - Sep ${year}`
      let dts = `9/30/${year}`
      this.getCountOfSchedule(dts)
    } else if (quater == 4) {
      this.quaterDateRange = `Oct ${year} - Dec ${year}`
      let dts = `12/31/${year}`
      this.getCountOfSchedule(dts)
    }
  }

  approve() {
    const source = this.currentData;
    const monthRecords = Array.isArray(source) ? source : [];
    this.approvedData = monthRecords.filter((ele: any) => ele.KRI_Status == "Approved");
    this.dialog.open(KriPopupComponent, {
      disableClose: false,
      height: '80vh',
      width: '70vw',
      data: { data: this.approvedData, name: "Approved" },
    });
  }

  reject() {
    const source = this.currentData;
    const monthRecords = Array.isArray(source) ? source : [];
    this.rejectedData = monthRecords.filter((ele: any) => ele.KRI_Status == "Rejected");
    this.dialog.open(KriPopupComponent, {
      disableClose: false,
      height: '80vh',
      width: '70vw',
      data: { data: this.rejectedData, name: "Rejected" },
    });
  }

  formatPeriod(period: any): string {
    const date = new Date(period);
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  }

  parsePeriod(periodStr: string): Date {
    return new Date(periodStr); // JS can parse "Nov 2025"
  }

  private splitMasterBySelectedAndPreviousMonth(masterArray: any[]): { currentMonthData: any[], previousMonthData: any[] } {
    if (!Array.isArray(masterArray)) return { currentMonthData: [], previousMonthData: [] };

    // compute current/previous keys explicitly to avoid order issues
    const selMonth = Number(this.selectedMonth) || (new Date().getMonth() + 1);
    const selYear = this.yearData || (new Date()).getFullYear();
    let prevM = selMonth - 1;
    let prevY = selYear;
    if (prevM === 0) { prevM = 12; prevY = selYear - 1; }
    const currentKey = `${selYear}-${selMonth}`;
    const prevKey = `${prevY}-${prevM}`;

    const currentMonthData: any[] = [];
    const previousMonthData: any[] = [];

    masterArray.forEach((r: any) => {
      if (!r || !r.Period) {
        // IMPORTANT: per your request we DO NOT use KRICreatedDate here.
        // Skip items with no Period.
        return;
      }

      // parse Period (like "Dec 2025", "December 2025", "Dec-2025") using your existing helper
      const dt = this.parseSelectedMonth(r.Period);
      if (!dt || isNaN(dt.getTime())) {
        return; // invalid period string — skip
      }
      const k = `${dt.getFullYear()}-${dt.getMonth() + 1}`;

      if (k === currentKey) currentMonthData.push(r);
      else if (k === prevKey) previousMonthData.push(r);
    });

    return { currentMonthData, previousMonthData };
  }
}