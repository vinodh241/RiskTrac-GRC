import { Component, OnInit } from '@angular/core';
import { KriReportedUnitRow, KriService } from 'src/app/services/kri/kri.service';

@Component({
    selector: 'app-kri-historical-reporting',
    templateUrl: './kri-historical-reporting.component.html',
    styleUrls: ['./kri-historical-reporting.component.scss']
})
export class KriHistoricalReportingComponent implements OnInit {

    displayedColumns: string[] = ['KriCode', 'Description', 'MeasurementFrequency','KRI_Defined_Quater', 'Target', 'KRIType','Kri_NewStatus'];
    displayedHeaders: string[] = ['header-row-first-group', 'header-row-second-group', 'header-row-third-group', 'header-row-fourth-group', 'header-row-fifth-group', 'header-row-six-group','header-row-last-group'];

    constructor(public kriService: KriService) {
        this.kriService.getKriHistoricalReport();
    }

    ngOnInit(): void {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.kriService.kriHistoricalReportedSelectedUnitNameRows.forEach((data: KriReportedUnitRow) => {
            data.Metrics.filter = filterValue;
            data.IsExpanded = (data.Metrics.filteredData.length > 0 && filterValue) ? true : false;
        });
        this.kriService.sortUnitList(this.kriService.kriHistoricalReportedSelectedUnitNameRows);
    }

    getGroupList() {
        return this.kriService.kriHistoricalReportedData?.groups;
    }

    getUnitList() {
        return this.kriService.kriHistoricalReportedData?.units.filter((x: any) => x.GroupID == this.kriService.kriHistoricalReportedSelectedGroup);
    }

    getYearList() {
        return this.kriService.kriHistoricalReportedData?.years;
    }

    //sort period columns in ascending order
    getPeriodColumns(metrics: any): any[] {
        return [...new Set(metrics.map((x: any) => x.periodPropertyNames).flat()
            .filter((y: any) => !y.includes('Period')))]
            .sort((a: any, b: any) =>
                a[a.length - 1] > b[b.length - 1]
                    ? 1
                    : a[a.length - 1] < b[b.length - 1]
                        ? -1
                        : 0
            );
    }

    getPeriodColumnValue(previousData: any, propertyName: any, header? :any) {
        let data = previousData?.find((x: any) => propertyName in x);
        return data ? data[propertyName] : propertyName.includes('KRI_Status') || propertyName.includes('Measurement')? 'NA' : ''
    }

    getPeriodColumnColorCode(previousData: any, propertyName: any) {
        let data = previousData?.find((x: any) => propertyName in x);
        return data ? data.ColorCode : '';
    }

    getPeriodHeaders(metrics: any): any[] {

        return [...new Set(metrics.map((x: any) => x.periodPropertyNames).flat().filter((y: any) => y.includes('Period')))].sort((a:any, b:any) => {
            return parseInt(a.replace('Period', ''), 10) - parseInt(b.replace('Period', ''), 10);
        });
    }

    getPeriodHeaderValue(metrics: any, periodHeader: any) {
        return metrics.map((x: any) => x.previousData).flat().find((y: any) => periodHeader in y)[periodHeader];
    }

    getPeriodheaderStatus(metrics: any, periodHeader: any) {
        if (metrics.every((x: any) => x.previousData.some((y: any) => periodHeader in y ? (y[`Measurement${periodHeader.at(-1)}`] >= 0) : false))) {
            return 'Measured & Reported';
        } else if (metrics.some((x: any) => x.previousData.some((y: any) => periodHeader in y ? (y[`Measurement${periodHeader.at(-1)}`] >= 0) : false))) {
            return 'Partially Measured & Reported'
        }
        return 'Not Measured & Reported';
    }

    onGroupChange() {
        this.kriService.kriHistoricalReportedSelectedUnit = '';
        this.kriService.getKriHistoricalReportedMetricsData();
    }

    onUnitChange() {
        this.kriService.getKriHistoricalReportedMetricsData();
    }

    onYearChange(selectedYear:any) {
        this.kriService.kriHistoricSelectedYear = selectedYear;
        this.kriService.getKriHistoricalReportedMetricsData();
    }
    exportAsExcel(i: number, groupName: string, unitName: string, data: any) {
        data.IsExpanded = !data.IsExpanded;
        // console.log(i);
        //this.kriService.exportAsExcelKriReporting('historicalReporting'+i, 'KriHistoricalReporting');
        // var exportData = this.getExcelData(kriReport);
        this.kriService.exportAsExcelKriHistorical('historicalReporting' + i, 'KriHistoricalReporting', groupName, unitName,this.kriService.kriThresholdData);
    }
    exportAsExcelKRiHistoricalReporting(lastIndex: number) {
        // let kriReportData = this.kriService.kriHistoricalReportedSelectedUnitNameRows;
        // let excelData: any[] = [];
        // kriReportData.map(i =>
        //     excelData.push.apply(excelData, this.getExcelData(i.Metrics))
        // );

        // this.kriService.exportAsExcelFile(excelData, 'KriReporting');
        this.kriService.exportAsExcelKriReporting('historicalReporting', 'KriHistoricalReporting', this.kriService.kriHistoricalReportedSelectedUnitNameRows, lastIndex,this.kriService.kriThresholdData);
    }

    getExcelData(kriReport: any) {
        var excelData = kriReport.filteredData.map(function (item: any) {
            delete item.UnitID
            delete item.MetricID
            delete item.GroupID
            delete item.KRITypeID
            delete item.MeasurementFrequencyID
            var obj = {
                'KRI Code': item.KriCode,
                'Group Name': item.GroupName,
                'Unit Name': item.UnitName,
                Description: item.Description,
                MeasurementFrequency: item.MeasurementFrequency,
                'KRI Name': item.KRIType,
                Date16: item.previousData[0] ? item.previousData[0].Date16 : '',
                Period16: item.previousData[0] ? item.previousData[0].Period16 : '',
                Remark16: item.previousData[0] ? item.previousData[0].Remark16 : '',
                ThresholdValue16: item.previousData[0] && item.previousData[0].ThresholdValue16 != undefined ? item.previousData[0].ThresholdValue16?.toString() + '%' : '',
                Date16_1: item.previousData[1] ? item.previousData[1].Date16 : '',
                Period16_1: item.previousData[1] ? item.previousData[1].Period16 : '',
                Remark16_1: item.previousData[1] ? item.previousData[1].Remark16 : '',
                ThresholdValue16_1: item.previousData[1] && item.previousData[1].ThresholdValue16 ? item.previousData[1].ThresholdValue16?.toString() + '%' : '',
            }
            return obj;

        });
        return excelData;
    }

    getAllUnitRowsFilteredLength(): number {
        let filterLength = this.kriService.kriHistoricalReportedSelectedUnitNameRows
            ?.map((unit: any) => unit.Metrics.filteredData.length)
            .reduce((a: any, b: any) => (a + b), 0);
        return filterLength;
    }
}
