import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { KriMigrationUnitComponent } from '../../kri/kri-migration-unit/kri-migration-unit.component';
import { KriPopupComponent } from '../../kri/kri-popup/kri-popup.component';
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-kri-overall',
  templateUrl: './kri-overall.component.html',
  styleUrls: ['./kri-overall.component.scss']
})
export class KriOverallComponent implements OnInit {
  options: any;
  kriCharts: any;
  color1: any
  color2: any
  color3: any
  color4: any
  color5: any
  currentQuarter: any;
  yearData: any;
  quaterData: any;
  KRICode: any;
  period: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  totalCountOfKri: any;
  kriScoreData: any = [
    { "KRIValue": 1, "KriID": 1, "KriScore": 10, "ColorCode": 1, },
    { "KRIValue": 2, "KriID": 1, "KriScore": 20, "ColorCode": 2, },
    { "KRIValue": 3, "KriID": 1, "KriScore": 30, "ColorCode": 3, },
    { "KRIValue": 4, "KriID": 1, "KriScore": 40, "ColorCode": 4, },
    { "KRIValue": 5, "KriID": 1, "KriScore": 50, "ColorCode": 5, }
  ];
  measured: any = [];
  notMeasured: any = [];
  reported: any = [];
  kriScore: any[] = [];
  KRIStatus: any;
  quaterDateRange: any;
  totalDaysinQuater: any;
  approved: any;
  rejected: any;
  approvedData: any = [];
  rejectedData: any = [];

  constructor(
    public DashboardService: DashboardService,
    public DashboardComponent: DashboardComponent,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.DashboardService.gotOverallDashboardMaster.subscribe((values) => {
      if (values) {
        this.DashboardService.gotYearQuater.subscribe((value) => {
          this.kriScore = []
          if (value == true) {
            this.yearData = this.DashboardService.yearValue
            this.quaterData = this.DashboardService.quaterValue
          }
          let currentDate = new Date();
          let currMonth = currentDate.getMonth() + 1;
          let currQuarter = Math.ceil(currMonth / 3);
          let uiQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ?
            this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);

          this.currentQuarter = uiQuarterFilter;
          this.currentQuaterData(this.yearData, this.quaterData)
          let result = [];
          result = JSON.parse(this.DashboardService.dashboardKRIMaster);
          let qtrLastDate: any
          if (this.DashboardService.quaterValue == 1) {
            qtrLastDate = `3/31/${this.DashboardService.yearValue}`
          } else if (this.DashboardService.quaterValue == 2) {
            qtrLastDate = `6/30/${this.DashboardService.yearValue}`
          } else if (this.DashboardService.quaterValue == 3) {
            qtrLastDate = `9/30/${this.DashboardService.yearValue}`
          } else if (this.DashboardService.quaterValue == 4) {
            qtrLastDate = `12/31/${this.DashboardService.yearValue}`
          }
          const qtrlastTime = new Date(qtrLastDate).getTime();

          this.kriScore = result.filter((item: any) => {
            const dt = item?.KRICreatedDate ? new Date(item.KRICreatedDate).getTime() : 0;
            return dt <= qtrlastTime;
          });

          // var curryearval = new Date().getFullYear();
          // let currQuarter1 = 'Q' + currQuarter + '-' + curryearval.toString().substr(2, 2); // Q1-23 KRICreatedDate
          // if (currQuarter1 != uiQuarterFilter) {
          //   var PreviousQuarterData: any = [];
          //   this.kriScore.forEach((item: any) => {
          //     if (item.PreviousQuarterData != "Not Measured") {
          //       var arrayData = item.PreviousQuarterData;
          //       var id = 0;
          //       var ind = undefined;
          //       for (let i = 0; i < arrayData?.length; i++) {
          //         if (id < arrayData[i].MeasurementID && arrayData[i].Quater == uiQuarterFilter) {
          //           id = arrayData[i].MeasurementID;
          //           ind = i
          //         }
          //       }
          //       if (ind != undefined && ind != null) {
          //         PreviousQuarterData.push(arrayData[ind])
          //       } else {
          //         PreviousQuarterData.push(item)
          //       }
          //     } else if (item.PreviousQuarterData == "Not Measured" && item.Quater == uiQuarterFilter) {
          //       PreviousQuarterData.push(item)
          //     } else {
          //       item.Date = null;
          //       // item.Period = null;
          //       item.KRI_Status = "Not Measured";
          //       item.IsReported = "false";
          //       item.MeasurementValue = null;
          //       item.Remark = null;
          //       item.Quater = null
          //       item.KRI_Value = null;
          //       PreviousQuarterData.push(item)
          //     }
          //   });
          //   PreviousQuarterData.forEach((item: any) => {
          //     if (item.Quater != uiQuarterFilter) {
          //       item.Date = null;
          //       // item.Period = null;
          //       item.KRI_Status = "Not Measured";
          //       item.IsReported = "false";
          //       item.MeasurementValue = null;
          //       item.Remark = null;
          //       item.Quater = null
          //       item.KRI_Value = null;
          //     }
          //   });
          //   this.kriScore = PreviousQuarterData;
          // } else {
          //   this.KRICode = this.DashboardService.masterKRICode;
          //   this.kriScore = JSON.parse(this.DashboardService.dashboardKRIMaster);
          //   // console.log('this.kriScore', this.kriScore);

          //   // if (currQuarter1 == uiQuarterFilter) {
          //   //   var ReportingFrequencyID;
          //   //   if (this.kriScore[0].Frequency == 'Monthly') {
          //   //     ReportingFrequencyID = 1
          //   //   } else if (this.kriScore[0].Frequency == 'Quarterly') {
          //   //     ReportingFrequencyID = 2
          //   //   } else if (this.kriScore[0].Frequency == 'Semi Annual') {
          //   //     ReportingFrequencyID = 3
          //   //   } else {
          //   //     ReportingFrequencyID = 4
          //   //   }
          //   //   this.getPeriod(ReportingFrequencyID);

          //   //   this.kriScore.forEach((kri: any) => {
          //   //     var singlePerid;
          //   //     var date = kri.Date;
          //   //     let year = ' ' + new Date(date).getFullYear() + ' ';
          //   //     var currentDateObj = new Date(date);
          //   //     var numberOfMlSeconds = currentDateObj.getTime();
          //   //     var newDateObj = new Date(numberOfMlSeconds);
          //   //     let month = new Date(newDateObj).getMonth();

          //   //     if (this.kriScore[0].Frequency == 'Monthly') {
          //   //       singlePerid = this.months[month] + year;
          //   //     } else if (this.kriScore[0].Frequency == 'Quarterly') {
          //   //       singlePerid = this.getQuarternew(newDateObj)
          //   //     } else if (this.kriScore[0].Frequency == 'Semi Annual') {
          //   //       singlePerid = month < 6 ? 'Jan-Jun' + year : 'Jul-Dec ' + year;
          //   //     } else {
          //   //       singlePerid = 'Jan-Dec ' + year;
          //   //     }

          //   //     if (this.period != singlePerid) {
          //   //       // kri.Period = null;
          //   //       kri.Date = null;
          //   //       kri.IsReported = null;
          //   //       kri.Measurement = null;
          //   //       kri.ThresholdValue = null;
          //   //       kri.Remark = null;
          //   //       kri.KRI_Value = null;
          //   //       kri.KRI_Status = "Not Measured";
          //   //       kri.evidences = null;
          //   //       kri.ColorCode = "#FFFFFF"
          //   //     }
          //   //   });
          //   // }
          // }

          this.DashboardService.dashboardKRIColorMaster.forEach((kri: any) => {
            if (kri.KRI_Value == 1) {
              this.color1 = kri.ColorCode
            } else if (kri.KRI_Value == 2) {
              this.color2 = kri.ColorCode
            } else if (kri.KRI_Value == 3) {
              this.color3 = kri.ColorCode
            } else if (kri.KRI_Value == 4) {
              this.color4 = kri.ColorCode
            } else if (kri.KRI_Value == 5) {
              this.color5 = kri.ColorCode
            }
          });

          this.totalCountOfKri = this.kriScore.length;
          this.approved = this.kriScore.filter((ele: any) => ele.KRI_Status == "Approved").length;
          this.rejected = this.kriScore.filter((ele: any) => ele.KRI_Status == "Rejected").length;

          this.chartData(this.kriScore);
        })
      }
    });
  }

  chartData(data: any[]) {
    // console.log('input-data::', JSON.stringify(data));
    setTimeout(() => {
      // If input is falsy, return empty array
      // if (!Array.isArray(data) || data.length === 0) return [];

      const kriData: any[] = [];

      // normalize helper (trim + lowercase) for period comparison
      const normalizePeriod = (p: any): string => (p ?? '').toString().trim().toLowerCase();

      /**
       * Preserve the object exactly as-is.
       * We shallow-clone to avoid mutating the original input objects.
       */
      function buildOrdered(obj: any) {
        // return shallow copy (keeps original property order and keys)
        return { ...obj };
      }

      // global seen set to avoid duplicates: MetricID||KRICode||normalizedPeriod
      const seen = new Set<string>();

      // ---- build kriData from data + PreviousQuarterData ----
      data.forEach((item: any) => {
        if (!item) return;

        // Build parent object as shallow clone
        const filteredParent = buildOrdered(item);

        const metricPart = (filteredParent.MetricID ?? '').toString();
        const codePart = (filteredParent.KRICode ?? '').toString();
        const parentPeriodNormalized = normalizePeriod(filteredParent.Period);

        const parentKey = `${metricPart}||${codePart}||${parentPeriodNormalized}`;

        if (!seen.has(parentKey)) {
          seen.add(parentKey);
          kriData.push(filteredParent);
        }

        // handle PreviousQuarterData array if present
        if (Array.isArray(item.PreviousQuarterData)) {
          item.PreviousQuarterData.forEach((prev: any) => {
            if (!prev) return;

            // Merge prev with parent for missing important fields (but keep prev's own keys if present)
            const mergedPrev = {
              ...item,         // parent fallback
              ...prev,         // prev overrides parent where present
              // keep MetricID/KRICode from prev if present, else parent
              MetricID: prev.MetricID ?? item.MetricID,
              KRICode: prev.KRICode ?? item.KRICode,
              // ensure KRICreatedDate/Frequency/Unit prefer prev then parent, else null
              KRICreatedDate: prev.KRICreatedDate ?? item.KRICreatedDate ?? null,
              Frequency: prev.Frequency ?? item.Frequency ?? null,
              Unit: prev.Unit ?? item.Unit ?? null
            };

            const prevMetric = (mergedPrev.MetricID ?? '').toString();
            const prevCode = (mergedPrev.KRICode ?? '').toString();
            const prevPeriodNormalized = normalizePeriod(mergedPrev.Period);

            const prevKey = `${prevMetric}||${prevCode}||${prevPeriodNormalized}`;

            if (!seen.has(prevKey)) {
              const filteredPrev = buildOrdered(mergedPrev);
              seen.add(prevKey);
              kriData.push(filteredPrev);
            }
          });
        }
      });

      // ---- fill missing Period using KRICreatedDate ----
      kriData.forEach(kri => {
        if (!kri) return;
        if (kri.Period === undefined || kri.Period === null || kri.Period === '' || kri.Period === 'undefined') {
          try {
            kri.Period = this.getCalculatedPeriod(kri);
          } catch (err) {
            // if getCalculatedPeriod fails, leave Period as-is (undefined/null) to avoid crash
            // optionally you can set kri.Period = null;
          }
        }
      });

      // ---- ADD MISSED RECORDS BASED ON KRICreatedDate + Frequency ----
      const now = new Date();
      const groups = new Map<string, any[]>();

      // group by MetricID + KRICode + Frequency + Unit
      kriData.forEach(kri => {
        if (!kri) return;
        const key = `${kri.MetricID ?? ''}||${kri.KRICode ?? ''}||${kri.Frequency ?? ''}||${kri.Unit ?? ''}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(kri);
      });

      const missingRecords: any[] = [];

      groups.forEach(items => {
        if (!items || !items.length) return;
        const sample = items[0];
        const freq = sample.Frequency;
        if (!freq) return; // nothing to synthesize if frequency unknown

        // existing periods in this group (normalized)
        const existingPeriods = new Set<string>();
        items.forEach(x => {
          if (x && x.Period) existingPeriods.add(normalizePeriod(x.Period));
        });

        // find earliest KRICreatedDate in this group
        const validDates = items
          .map(x => x && x.KRICreatedDate)
          .filter((d: any) => !!d)
          .map((d: any) => {
            const t = new Date(d);
            return isNaN(t.getTime()) ? null : t.getTime();
          })
          .filter((t: number | null) => t !== null) as number[];

        if (!validDates.length) return;

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

        // walk until current month (inclusive)
        while (monthYearLE(cursor, now)) {
          const tempKri = {
            KRICreatedDate: cursor.toISOString(),
            Frequency: freq
          };

          let expectedPeriodRaw = '';
          try {
            expectedPeriodRaw = this.getCalculatedPeriod(tempKri) || '';
          } catch (err) {
            expectedPeriodRaw = '';
          }
          const expectedPeriodKey = normalizePeriod(expectedPeriodRaw);

          if (expectedPeriodKey && !existingPeriods.has(expectedPeriodKey)) {
            // build new object by merging sample baseline with generated fields
            const newObjRaw: any = {
              MetricID: sample.MetricID ?? null,
              KRICode: sample.KRICode ?? null,
              KRICreatedDate: cursor.toISOString(),
              Unit: sample.Unit ?? null,
              Frequency: freq,
              Period: expectedPeriodRaw.trim(),
              Date: null,
              KRI_Status: 'Not Measured',
              KRI_Value: null,
              Remark: null
            };

            // Merge sample to carry any extra keys sample has, but allow newObjRaw to override
            const newObjMerged = { ...sample, ...newObjRaw };
            const newObj = buildOrdered(newObjMerged);

            const newKey = `${newObj.MetricID ?? ''}||${newObj.KRICode ?? ''}||${normalizePeriod(newObj.Period)}`;

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
            // tolerate variants of the naming
            cursor.setMonth(cursor.getMonth() + 6);
          } else {
            // Yearly or default
            cursor.setFullYear(cursor.getFullYear() + 1);
          }

          // normalize to start of month again
          cursor.setDate(1);
          cursor.setHours(0, 0, 0, 0);
        } // end while
      });

      // append generated missing records
      kriData.push(...missingRecords);



      // kriData.sort((a: any, b: any) => this.periodToTimestamp(a.Period) - this.periodToTimestamp(b.Period));
      // kriData.sort((a: any, b: any) => (a.MetricID ?? 0) - (b.MetricID ?? 0));
      // kriData.sort((a: any, b: any) => {
      //   const codeCompare = String(a.KRICode).localeCompare(String(b.KRICode));
      //   if (codeCompare !== 0) return codeCompare;
      //   return this.periodToTimestamp(a.Period) - this.periodToTimestamp(b.Period);
      // });

      kriData.sort((a: any, b: any) => {
        const codeCompare = (a.MetricID ?? 0) - (b.MetricID ?? 0);
        if (codeCompare !== 0) return codeCompare;
        return this.periodToTimestamp(a.Period) - this.periodToTimestamp(b.Period);
      });

      // console.log('output-: kriData: ', JSON.stringify(kriData));


      this.reported = [];
      this.measured = [];
      this.notMeasured = [];
      kriData.forEach((kri: any) => {
        if (kri.KRI_Status === 'Reported') {
          this.reported.push(kri);
        } else if (kri.KRI_Status === 'Measured') {
          this.measured.push(kri);
        } else if (kri.KRI_Status === 'Not Measured') {
          this.notMeasured.push(kri);
        }
      });

      this.options = {
        chart: {
          type: 'column',
          plotBorderColor: '#ccc', // Set the border color for the plot area
          plotBorderWidth: 0.5 // Set the border width for the plot area
        },
        title: {
          align: 'left',
          text: ' ',
        },
        subtitle: {
          align: 'left',
          text: '',
        },
        accessibility: {
          enabled: false,
          announceNewData: {
            enabled: true,
          },
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          title: {
            text: '',
          },
          tickInterval: 5,
          labels: {
            style: {
              fontFamily: "Roboto Condensed"
            }
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          column: { colorByPoint: true },
          series: {
            cursor: 'pointer',
            pointWidth: 15,
            borderWidth: 0,
            minPointLength: 3,
            // outerWidth: 3,
            borderRadius: 6,
            dataLabels: {
              enabled: true,
              format: '{point.y}',
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        series: [
          // cursor: 'pointer',
          {
            data: this.getAllData(),
          },
        ],
      };
      this.kriCharts = Highcharts.chart('containercHART', this.options);
    }, 2000);
  }

  getAllData() {
    let measure = this.measured.length;
    let reported = this.reported.length;
    let notMeasure = this.notMeasured.length;
    return [
      {
        name: `<span style="color:black;font-family: Roboto Condensed; font-size:1.7vh;font-weight:600;">Measured</span>`,
        y: measure,
        // setInterval(()=>{})/
        color: {
          linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#F2F2F2'],
            [1, '#CBCBCB'],
          ],
        },
        cursor: 'pointer',
        events: {
          click: () => this.clickBars(this.measured),
        },
        // cursor : pointer,
      },
      {
        name: '<span style="color:red;font-family:Roboto Condensed;font-size:1.7vh;font-weight:600;">Not Measured</span>',
        y: notMeasure,
        color: {
          linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#E7E7E7'],
            [1, '#FF6868'],
          ],
        },
        events: {
          click: () => this.clickBars(this.notMeasured),
        },
      },
      {
        name: '<span style="color:#82E090;font-family:Roboto Condensed;font-size:1.7vh;font-weight:600;">Reported</span>',
        y: reported,
        color: {
          linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#E7E7E7'],
            [1, '#0FB766'],
          ],
        },
        // cursor:Highcharts.Pointer,
        events: {
          click: () => this.clickBars(this.reported),
        },
      },
    ];
  }

  getKriScoreData(i: any) {
    const result = this.kriScore.filter(da => da.KRI_Value == i)
    return this.removeDummyDtNew(result).length
  }

  getCalculatedPeriod(kri: any): string {
    if (!kri.KRICreatedDate) return '';

    const currentDateObj = new Date(kri.KRICreatedDate);
    const year = currentDateObj.getFullYear().toString();
    const month = currentDateObj.getMonth();

    if (kri.Frequency === 'Monthly') {
      return `${this.months[month]} ${year}`;
    } else if (kri.Frequency === 'Quarterly') {
      return this.getQuarternew(currentDateObj); // make sure this also returns trimmed
    } else if (kri.Frequency === 'Semi Annual') {
      return (month < 6 ? 'Jan-Jun ' : 'Jul-Dec ') + year;
    } else {
      return 'Jan-Dec ' + year;
    }
  }



  getQuarternew(newDateObj: any) {
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
        // let start = result.filter((da: any) => da.Unit == i && da.Quater === this.currentQuarter)
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

  getPercentageNew(dt: any) {
    let currentData = dt.filter((dt: any) => dt.KRI_Value == 1).length;
    let previewData = dt.filter((dt: any) => dt.KRI_Value_last == 1).length;
    return this.getDifferene(previewData, currentData)
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

  openPopUp(va: any): void {
    const result = this.kriScore.filter(da => da.KRI_Value == va)
    const data = this.getIndex(this.removeDummyDtNew(result))
    const kriPopup = this.dialog.open(KriMigrationUnitComponent, {
      disableClose: false,
      height: '80vh',
      width: '50vw',
      data: { mode: 'unit-1', value: data, kri: result, name: 'Under KRI Score - ' + va }
    })
  }

  getIndexOpenChart(dt: any, mst: any) {
    let index = 1;
    let list = [];
    for (let i of dt) {
      i['sno'] = index;
      i.KRIStatus = mst
      list.push(i);
      index++;
    }
    return list;
  }

  clickBars(m: any) {
    // console.log(this.kriScore);
    if (m == this.measured) {
      m = m
      this.KRIStatus = 'Measured';
    } else if (m == this.notMeasured) {
      m = m
      this.KRIStatus = 'Not Measured';
    } else if (m == this.reported) {
      m = m
      this.KRIStatus = 'Reported';
    }
    const kriPopup = this.dialog.open(KriPopupComponent, {
      disableClose: false,
      height: '80vh',
      width: '70vw',
      data: {
        data: this.getIndexOpenChart(m, this.KRIStatus),
        name: this.KRIStatus
      },
    });
  }

  currentQuaterData(year: any, quater: any) {
    let currentDate = new Date(); // Get the current date
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

  navigatePage() {
    this.DashboardComponent.openMenu('kri', 'same');
  }

  approve() {
    this.approvedData = this.kriScore.filter((ele: any) => ele.KRI_Status == "Approved")
    const kriPopup = this.dialog.open(KriPopupComponent, {
      disableClose: false,
      height: '80vh',
      width: '70vw',
      data: {
        data: this.approvedData,
        name: "Approved"
      },
    });
  }

  reject() {
    this.rejectedData = this.kriScore.filter((ele: any) => ele.KRI_Status == "Rejected")
    const kriPopup = this.dialog.open(KriPopupComponent, {
      disableClose: false,
      height: '80vh',
      width: '70vw',
      data: {
        data: this.rejectedData,
        name: "Rejected"
      },
    });
  }

  MONTH_IDX: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  periodToTimestamp(period: any): number {
    if (!period) return -Infinity;

    const s = String(period).trim();
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) return parsed.getTime();

    // "MMM YYYY"
    const m = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (m) {
      const month = this.MONTH_IDX[m[1].slice(0, 3).toLowerCase()];
      if (month !== undefined) {
        return new Date(Number(m[2]), month, 1).getTime();
      }
    }

    return -Infinity;
  }

}