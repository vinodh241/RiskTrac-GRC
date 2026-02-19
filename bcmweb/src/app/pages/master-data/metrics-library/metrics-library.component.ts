import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { AddMetricsLibraryComponent } from './add-metrics-library/add-metrics-library.component';
import { MasterMetricLibraryService } from 'src/app/services/master-data/master-metric-library/master-metric-library.service';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-metrics-library',
  templateUrl: './metrics-library.component.html',
  styleUrls: ['./metrics-library.component.scss'],
})

export class MetricsLibraryComponent implements OnInit {

  displayedColumns: string[] = [
    'Position',
    'Code',
    'MetricTitle',
    'MetricType',
    'ReviewFrequency',
    'MetricTarget',
    'MetricOwner',
    'Action',
  ];
  allBusinessData: any;
  dataSource = new MatTableDataSource<Element>();
  allMetricList: any;
  sortedData: any;

  constructor(
    public MasterMetricService: MasterMetricLibraryService,
    public dialog: MatDialog,
    public authService: AuthService
  ) {
    this.authService.activeTab.next("master-data");
  }

  ngOnInit(): void {
    this.MasterMetricService.getMetricData();
    this.MasterMetricService.gotMetricMaster.subscribe((value) => {
      if (value) {
        this.dataSource = this.MasterMetricService.masterMetric.MetricsLibraryMasterList;
        this.allMetricList = this.MasterMetricService.masterMetric.MetricsLibraryMasterList;
      }
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.sortedData = this.dataSource.data.slice(); // Clone the data
  }

  addEdit(mod?: any, data?: any) {
    const dialog = this.dialog.open(AddMetricsLibraryComponent, {
      disableClose: true,
      maxWidth: '100vw',
      panelClass: ['metric', 'full-screen-modal'],
      data: {
        mod: mod,
        data: data,
        allData:this.allMetricList
      },
    });
    dialog.afterClosed().subscribe((result) => { });
  }

  deleteMetrics(data?: any) {
    // console.log('data: ', data);
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirm Deletion',
        content:
          'This action will permanently delete the record.\nYou may not be able to retrieve it.\n\nDo you still want to delete it?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        this.MasterMetricService.deleteMetricMaster(data).subscribe(
          (res: any) => {
            console.log(res);
            next: this.deleteSuccess();
            error: console.log('err::', 'error');
          }
        );
      }
    });
  }

  deleteSuccess(): any {
    const timeout = 1000; // 1 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'success',
      backdropClass: 'static',
      data: {
        title: 'Success',
        content: 'Threat Library is deleted successfully',
      },
    });

    confirm.afterOpened().subscribe((result) => {
      setTimeout(() => {
        confirm.close();
        this.MasterMetricService.getMetricData();
      }, timeout);
    });
  }

  applyFilter(event: Event) {
    // console.log('event: ', event);
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = [
      'MetricCode',
      'MetricTitle',
      'MetricType',
      'Frequency',
      'TargetValue',
      'MetricOwner'
    ];
    this.dataSource = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, this.MasterMetricService.masterMetric['MetricsLibraryMasterList']))), false)
  }

  sortData(event: any) {
    const sortedData = this.sortByData(event, this.allMetricList);
    this.dataSource = new MatTableDataSource(sortedData);
  }

  sortByData(sort: any, tableData: any[]) {
    if (!sort.active || sort.direction === '' || !tableData || tableData.length === 0) {
      return tableData;
    }

    return tableData.slice().sort((a: any, b: any) => {
      const aValue = (a[sort.active] || '').toString().toUpperCase();
      const bValue = (b[sort.active] || '').toString().toUpperCase();

      return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }
}
