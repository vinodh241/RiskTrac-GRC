import { Component, OnInit } from '@angular/core';
import { MasterVendorsService } from 'src/app/services/master-data/master-vendor-service/master-vendors.service'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEditServiceproviderComponent } from './add-edit-serviceprovider-popup/add-edit-serviceprovider/add-edit-serviceprovider.component';
import { addIndex, formatTimeZone, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import * as commonFunctions from 'src/app/includes/utilities/commonFunctions'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})

export class VendorsComponent implements OnInit {
  [x: string]: any;

  displayedColumns: string[] = ['Position', 'VendorName', 'Applications', 'PrimaryContact', 'AlternateContact', 'ContractTAT', 'Action'];
  vendorsData = new MatTableDataSource<Element>();
  applList: any;
  tableData: any = [];
  exportArr: any = [];

  constructor(
    public service: MasterVendorsService,
    public dialog: MatDialog,
    public authService: AuthService,
    public utils: UtilsService,
    private datePipe: DatePipe,
    private router: Router) {
    if (this.utils.isSCUserNBCMUnitUser()) {
      this.authService.activeTab.next("master-data");
      this.service.getVendorMasterData();
    } else {
      this.router.navigate(['/business-continuity-plan']);
    }
  }

  ngOnInit(): void {
    this.service.gotMaster.subscribe((value) => {
      if (value) {
        this.vendorsData = this.service.masterVendors.vendorsServiceProvidersList;
        this.applList = this.service.masterVendors.ApplicationSupportList
      }
    })
  }

  openAddEditService(mod?: any, data?: any) {
    const dialog = this.dialog.open(AddEditServiceproviderComponent, {
      disableClose: true,
      maxWidth: '54vw',
      height: '78vh',
      panelClass: ['service', 'full-screen-modal'],
      data: {
        mod: mod,
        data: data,
        applList: this.applList,
        allRecords: this.vendorsData
      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.service.getVendorMasterData();
     });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = ['Vendor_Name', 'ApplicationName', 'PrimaryContactFullName', 'PrimaryContactMobileNumber', 'PrimaryContactEmailID', 'AlternateContactFullName', 'AlternateContactMobileNumber', 'AlternateContactEmailID', 'ContractTAT', 'TATTimeUnit'];
    this.vendorsData = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, this.service.masterVendors['vendorsServiceProvidersList']))), false)
  }

  exportFile() {
    this.exportArr = []
    this.tableData = this.vendorsData
    if(this.tableData.length) {
      this.tableData.forEach((n:any)=>{
        this.exportArr.push({
          'Vendor Name'                      : n.Vendor_Name,
          'Application Name'                 : n.ApplicationName,
          'Primary Contact Email ID'         : n.PrimaryContactEmailID,
          'Primary Contact Full Name'        : n.PrimaryContactFullName,
          'Primary Contact Mobile Number'    : n.PrimaryContactMobileNumber,
          'Alternate Contact Email ID'       : n.AlternateContactEmailID,
          'AlternatecContact Full Name'      : n.AlternateContactFullName,
          'Alternate Contact Mobile Number'  : n.AlternateContactMobileNumber,
          'Contract TAT'                     : n.ContractTAT + " "+ n.TATTimeUnit
        })
      })
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.exportArr);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const now = new Date();
      let dateStamp = this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' + new Date().toLocaleTimeString()
      // saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `Vendor details_${new Date()}.xlsx`);
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `Vendor details_${dateStamp}.xlsx`);
    }
  }

}
