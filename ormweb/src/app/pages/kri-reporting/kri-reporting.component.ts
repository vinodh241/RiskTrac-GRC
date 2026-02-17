import { TemplateBindingParseResult } from '@angular/compiler';
import { Component, IterableDiffers, OnInit } from '@angular/core';
import { KriReportedUnitRow, KriService } from 'src/app/services/kri/kri.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-kri-reporting',
  templateUrl: './kri-reporting.component.html',
  styleUrls: ['./kri-reporting.component.scss']
})
export class KriReportingComponent implements OnInit {
  displayedColumns: string[] = ['KriCode', 'Indicator', 'MeasurementFrequency', 'Target', 'KriType'];
  periodColumns: string[] = ['Period', 'Date', 'Measurement', 'ThresholdValue', 'Remarks', 'KRI_Status'];
  thresholdColumns: string[] = ['ThresholdValue1', 'ThresholdValue2', 'ThresholdValue3', 'ThresholdValue4', 'ThresholdValue5'];
  displayedHeaders: string[] = ['header-row-first-group', 'header-row-second-group', 'header-row-third-group', 'header-row-fourth-group', 'header-row-fifth-group', 'header-row-six-group', 'header-row-last-group'];
  isKriExportExcel: boolean = false;
  constructor(public kriService: KriService,
    public utils: UtilsService) {
    this.kriService.getKriReport();
  }

  ngOnInit(): void { 
    
  }

  onGroupChange() {
    this.kriService.kriReportedSelectedUnit = '';
    this.kriService.getKriReportedMetricsData();
    if (this.kriService.searchValue) {
      this.search(this.kriService.searchValue);
    }
  }

  onUnitChange() {
    this.kriService.getKriReportedMetricsData();
    if (this.kriService.searchValue) {
      this.search(this.kriService.searchValue);
    }
  }

  getGroupList() {
    return this.kriService.kriReportedData?.groups;
  }

  getUnitList() {
    return this.kriService.kriReportedData?.units.filter((x: any) => x.GroupID == this.kriService.kriReportedSelectedGroup);
  }

  onClickAll() {
    this.filterByStatusName('');
  }

  onClickMeasured() {
    this.filterByStatusName('Measured');
  }

  onClickNotMeasured() {
    this.filterByStatusName('Not Measured');
  }

  onClickReported() {
    this.filterByStatusName('Reported');
  }

  onClickApproved() {
    this.filterByReportStatusName('Approved');
  }

  onClickRejected() {
    this.filterByReportStatusName('Rejected');
  }

  applySearchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.kriService.searchValue = filterValue;
    this.search(filterValue);
  }
  search(filterValue: string) {
    this.kriService.kriReportedSelectedUnitNameRows.forEach((data: KriReportedUnitRow) => {
      data.Metrics.filterPredicate = (obj: any, filter: string) => {
        return !filter || Object.values(obj)
          ?.filter((x: any) => ![null, undefined].includes(x))
          .map((y: any) => y.toString().toLowerCase())
          .some(z => z.includes(filter.trim().toLowerCase()));
      };
      data.Metrics.filter = filterValue;
      data.IsExpanded = (data.Metrics.filteredData.length > 0 && filterValue) ? true : false;
    });
    this.kriService.sortUnitList(this.kriService.kriReportedSelectedUnitNameRows);
    this.kriService.kriReportedAllMetricsNo = this.total();
  }

  total() {
    let service = this.kriService.kriReportedSelectedUnitNameRows;
    let data = 0;
    let measuredData = 0;
    let notMeasuredData = 0
    let reportedData = 0
    for (let i in service) {
      if (service[i].Metrics && service[i].Metrics.filteredData.length > 0) {
        data = data + service[i].Metrics.filteredData.length;
        measuredData = measuredData + service[i].Metrics.filteredData.filter((data: any) => data.KRI_Status == 'Measured').length;
        notMeasuredData = notMeasuredData + service[i].Metrics.filteredData.filter((data: any) => data.KRI_Status == 'Not Measured').length;
        reportedData = reportedData + service[i].Metrics.filteredData.filter((data: any) => data.KRI_Status == 'Reported').length;
      }
    }
    this.kriService.kriReportedMeasuredMetricsNo = measuredData;
    this.kriService.kriReportedNotMeasuredMetricsNo = notMeasuredData;
    this.kriService.kriReportedMetricsNo = reportedData;

    return data;
  }

  exportAsExcel(exportData: any) {

    var excelData = this.getExcelData(exportData.Metrics);
    exportData.IsExpanded = !exportData.IsExpanded;
    this.kriService.exportAsExcelFile(excelData, exportData.GroupName);
  }
  exportAsExcelKRiReporting() {
    let kriReportData = this.kriService.kriReportedSelectedUnitNameRows;
    let excelData: any[] = [];
    kriReportData.map(i =>
      excelData.push.apply(excelData, this.getExcelData(i.Metrics))
    );
    excelData.map(function (item: any, index: any) {
      item['Sl No'] = index + 1;
    })
    this.kriService.exportAsExcelFile(excelData, 'KriReporting');
  }
  //   exportAsExcelKRiReporting(lastIndex: number) {
  //     this.kriService.exportAsExcelKriReporting('KriReporting', 'KriReporting', this.kriService.kriReportedSelectedUnitNameRows, lastIndex);
  // }

  getExcelData(kriReport: any) {
    var excelData = kriReport.filteredData.map(function (item: any, index: any) {
      delete item.UnitID
      delete item.MetricID
      delete item.KriTypeID
      delete item.GroupID

      var obj = {
        'Sl No': index + 1,
        'KRI Code': item.KriCode,
        'Group Name': item.GroupName,
        'Unit Name': item.UnitName,
        Indicator: item.Indicator,
        MeasurementFrequency: item.MeasurementFrequency,
        Target: item.Target ? item.Target.toString() + '%' : '0%',
        KriType: item.KriType,
        "Threshold Value 1": item.ThresholdValue1 >= 0 ? (item.ThresholdValue1 <= item.ThresholdValue2 ? ">=" : "<=") + item.ThresholdValue1.toString() + '%' : '',
        'Threshold Value 2': item.ThresholdValue2 ? (item.ThresholdValue2 <= item.ThresholdValue3 ? ">=" : "<=") + item.ThresholdValue2.toString() +'%': '',
        'Threshold Value 3': item.ThresholdValue3 ? (item.ThresholdValue3 <= item.ThresholdValue4 ? ">=" : "<=") + item.ThresholdValue3.toString() + '%' : '',
        'Threshold Value 4': item.ThresholdValue4 ? (item.ThresholdValue4 <= item.ThresholdValue5 ? ">=" : "<=") + item.ThresholdValue4.toString() + '%': '',
        'Threshold Value 5': item.ThresholdValue5 ? item.ThresholdValue5.toString() + '%': '0%',
        Period: item.Period,
        Date: item.Date ? new Date(item.Date).toLocaleDateString('en-US', {
          month: '2-digit', day: '2-digit', year: 'numeric'
        }) : '',
        Measurement: item.Measurement != null ? item.Measurement.toString()?.length > 0 ? item.Measurement.toString() + '%' : '' : '',
        'KRI Value': item.ThresholdValue ? item.ThresholdValue.toString() : '',
        'ColorCode': item.ColorCode,
        Remarks: item.Remarks,
        Status: item.KRI_Status

      }
      return obj;
    });
    return excelData;
  }

  private filterByStatusName(status: string) {
    this.kriService.kriReportedSelectedUnitNameRows.forEach((data: KriReportedUnitRow) => {
      data.Metrics.filterPredicate = (data: any, filter: string) => {
        return data.KRI_Status == filter;
      };
      data.Metrics.filter = status;
    });
  }

  filterByReportStatusName(status: string) {
    this.kriService.kriReportedSelectedUnitNameRows.forEach((data: KriReportedUnitRow) => {
      data.Metrics.filterPredicate = (data: any, filter: string) => {
        return data.ReportStatusName == filter;
      };
      data.Metrics.filter = status;
    });
  }

  myFilter(elm: any) {
    return (elm != null && elm !== false && elm !== "");
  }

  getUnitNameStatus(unit: any) {
    let kriStatus = [
      {
        KRI_Status: null
      }
    ]
    unit.forEach((element: any) => {
      kriStatus.push({ KRI_Status: element.KRI_Status })
    });
    var uniqueStatus = [...new Set(kriStatus.map(item => item.KRI_Status))]
    uniqueStatus = uniqueStatus.filter(this.myFilter)
    let str = uniqueStatus.join(',')
    return str;
  }

  getAllUnitRowsFilteredLength(): number {
    let filterLength = this.kriService.kriReportedSelectedUnitNameRows
      ?.map((unit: any) => unit.Metrics.filteredData.length)
      .reduce((a: any, b: any) => (a + b), 0);
    return filterLength;
  }
}
