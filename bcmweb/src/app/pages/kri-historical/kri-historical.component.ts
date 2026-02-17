import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { KriService } from 'src/app/services/kri/kri.service';

@Component({
  selector: 'app-kri-historical',
  templateUrl: './kri-historical.component.html',
  styleUrls: ['./kri-historical.component.scss']
})
export class KriHistoricalComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Index', 'GroupName', 'UnitName', 'KeyRiskIndicator', 'MeasurementFrequencyName'];
  monthsColumns: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  isMeasuredValueView: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public kriService: KriService
  ) {
    this.kriService.getKriHistorical();
  }

  public ngOnInit() {
    this.kriService.gotHistoricalMeasurements.subscribe((value: boolean) => {
      console.log(value)
      if (value ==true)
      setTimeout(() => this.kriService.kriHistoricalDataSource.paginator = this.paginator);
    })
  }

  getGroupList() {
    return this.kriService.kriHistoricalData?.groups;
  }

  getUnitList() {
    return this.kriService.kriHistoricalData?.units.filter((x: any) => x.GroupID == this.kriService.kriHistoricalSelectedGroup);
  }

  getYearList() {
    return this.kriService.kriHistoricalData?.years;
  }

  changeView(event: any) {
    this.isMeasuredValueView = event.checked;
  }

  onGroupChange() {
    this.kriService.kriHistoricalSelectedUnit = '';
    this.applyGroupFilter();
  }

  onUnitChange() {
    this.applyUnitFilter();
  }

  onYearChange() {
    this.kriService.getKriHistoricalMetricsData();
    this.applyUnitFilter();
  }

  //generate td cells as per frequency name(12 for Months, 4 for quarters, 2 for semi annual, 1 for annual)
  getDisplayProperty(frequency: any, index: number) {
    if ((frequency == 'Quarterly' && (index != 0 && index != 3 && index != 6 && index != 9)) ||
      (frequency == 'Semi Annual' && (index != 0 && index != 6)) || (frequency == 'Annually' && index != 0)) {
      return 'none';
    } else {
      return '';
    }
  }

  getMonthsColspan(frequency: any) {
    return frequency == 'Annually' ? 12 : frequency == 'Semi Annual' ? 6 : frequency == 'Quarterly' ? 3 : 1;
  }

  getBackgroundColor(element: any, item: string) {
    return element.scoring.find((x: any) => x.Period.startsWith(item))?.ColorCode || '';
  }

  private applyGroupFilter() {
    this.kriService.kriHistoricalDataSource.filterPredicate = (data: any, filter: string) => {
      return data.GroupName == filter;
    };
    this.kriService.kriHistoricalDataSource.filter = this.kriService.kriHistoricalSelectedGroup ? this.kriService.kriHistoricalData?.groups.find((x: any) => x.GroupID == this.kriService.kriHistoricalSelectedGroup).GroupName : '';
    if (this.kriService.kriHistoricalDataSource.paginator) {
      this.kriService.kriHistoricalDataSource.paginator.firstPage();
    }
  }

  private applyUnitFilter() {
    this.kriService.kriHistoricalDataSource.filterPredicate = ((data: any, filter: { GroupName: string, UnitName: string }) => {
      return !filter.GroupName || data.GroupName == filter.GroupName && !filter.UnitName || data.UnitName == filter.UnitName;
    }) as ({ GroupName, UnitName }: { GroupName: string, UnitName: string }) => boolean;

    let obj = {
      GroupName: this.kriService.kriHistoricalSelectedGroup ? this.kriService.kriHistoricalData?.groups.find((x: any) => x.GroupID == this.kriService.kriHistoricalSelectedGroup).GroupName : '',
      UnitName: this.kriService.kriHistoricalSelectedUnit ? this.kriService.kriHistoricalData?.units.find((x: any) => x.GroupID == this.kriService.kriHistoricalSelectedGroup && x.UnitID == this.kriService.kriHistoricalSelectedUnit).UnitName : ''
    };
    let filterValue = { ...obj } as unknown as string;
    this.kriService.kriHistoricalDataSource.filter = filterValue;
    if (this.kriService.kriHistoricalDataSource.paginator) {
      this.kriService.kriHistoricalDataSource.paginator.firstPage();
    }
  }

  applySearchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.kriService.kriHistoricalDataSource.filterPredicate = (data: any, filter: string) => {
      return !filter || Object.values(data)?.filter((x: any) => ![null, undefined].includes(x))
        .map((y: any) => y.toString().toLowerCase())
        .some(z => z.includes(filter.trim().toLowerCase()));
    };
    this.kriService.kriHistoricalDataSource.filter = filterValue;
    if (this.kriService.kriHistoricalDataSource.paginator) {
      this.kriService.kriHistoricalDataSource.paginator.firstPage();
    }
  }

  exportAsExcel() {
    let isMeasuredView = !this.isMeasuredValueView;
    this.kriService.kriHistoricalDataSource.filteredData.forEach(function (element) {
      if (element.scoring) {
        for (let i = 0; i < element.scoring.length; i++) {
          var presentMonth = element.scoring[i].Period?.split(" ");
          let data = (element.scoring[i].ThresholdValue && isMeasuredView ? element.scoring[i].ThresholdValue : '') + (element.scoring[i].Measurement != null ? (element.scoring[i].Measurement.toString()?.length > 0 ? (isMeasuredView ? ',' : '') + element.scoring[i].Measurement + '%' : '') : '');
          if (presentMonth) {
            let type = presentMonth[0].includes('-');
            let month = null;
            if (type) {
              month = presentMonth[0].split('-');
              if (element['month' + month[0]]) {
                element['month' + month[0]] = element['month' + month[0]] + ' ' + data;
              }
              else {
                element['month' + month[0]] = data;
              }
            }
            else {
              month = presentMonth[0];
              if (element['month' + month]) {
                element['month' + month] = element['month' + month] + ',' + data;
              }
              else {
                element['month' + month] = data;
              }
            }

          }
        }
      }
    });

    var kriHistoricalDataSource = this.kriService.kriHistoricalDataSource.filteredData.map(function (item: any) {
      delete item.UnitID
      delete item.MetricID
      delete item.GroupID
      var obj = {
        'Sl No': item.Index,
        'KRI Code': item.KriCode,
        'Group Name': item.GroupName,
        'Unit Name': item.UnitName,
        'Key Risk Indicator': item.Description,
        'Measurement Frequency': item.MeasurementFrequency,
        Jan: item.monthJan ? item.monthJan : '',
        Feb: item.monthFeb ? item.monthFeb : '',
        Mar: item.monthMar ? item.monthMar : '',
        Apr: item.monthApr ? item.monthApr : '',
        May: item.monthMay ? item.monthMay : '',
        Jun: item.monthJun ? item.monthJun : '',
        Jul: item.monthJul ? item.monthJul : '',
        Aug: item.monthAug ? item.monthAug : '',
        Sep: item.monthSep ? item.monthSep : '',
        Oct: item.monthOct ? item.monthOct : '',
        Nov: item.monthNov ? item.monthNov : '',
        Dec: item.monthDec ? item.monthDec : '',
      }
      return obj;
    });

    this.kriService.exportAsExcelFile(kriHistoricalDataSource, 'krihistorical');
    this.kriService.kriHistoricalDataSource.filteredData.map(function (item: any) {
      delete item.monthJan,
        delete item.monthFeb,
        delete item.monthMar,
        delete item.monthApr,
        delete item.monthMay,
        delete item.monthJun,
        delete item.monthJul,
        delete item.monthAug,
        delete item.monthSep,
        delete item.monthOct,
        delete item.monthNov,
        delete item.monthDec
    });
  }

  exportAsExcelKRiHistorical() {
    //this.kriService.exportAsExcelKriHistorical('kriHistorical', 'krihistorical');
  }

  getFilteredDataLength(): number {
    return this.kriService.kriHistoricalDataSource?.filteredData.length || 0;
  };

  ngAfterViewInit(): void {
    // console.log(this.kriService.kriHistoricalDataSource)
    // // setTimeout(() => {
    //   if (this.kriService.kriHistoricalDataSource)
        // this.kriService.kriHistoricalDataSource.paginator = this.paginator;
    // }, 1500);
  }
}
