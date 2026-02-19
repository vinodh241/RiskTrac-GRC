import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-invalid-file-details',
  templateUrl: './invalid-file-details.component.html',
  styleUrls: ['./invalid-file-details.component.scss']
})
export class InvalidFileDetailsComponent {

  displayedColumns: string[] = [
    'Position',
    'ApplicationName',
    'DeploymentSite',
    'ITOwner',
    'SupportLead',
    'RTO',
    'RPO',
    'FailedFields'
  ];
  invalidData: any;
  dataSource! : MatTableDataSource<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  ngOnInit(): void {
    this.invalidData = this.data.allData
    this.dataSource = this.invalidData
    console.log('this.invalidData: ', this.invalidData);
  }

}
