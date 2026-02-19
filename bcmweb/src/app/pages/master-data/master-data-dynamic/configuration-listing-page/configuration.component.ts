import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterSiteService } from 'src/app/services/master-data/master-site/master-site.service';
import { ApiConstantsService } from 'src/app/services/api-constants/api-constants.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NewMasterPageComponent } from '../configuration-new-page/new-master-page.component';
import { AddNewInputComponent } from '../configuration-add-input/add-new-input.component';

export interface PeriodicElement {
  PageID: number;
  PageTitle: string;
  DisplayName: string;
  HeaderButtonTitle: string;
  PopUpTitle: string;
  SaveButtonTitle: string;
  CancelButtonTitle: string;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  displayedColumns = [
    'PageID',
    'PageTitle',
    'DisplayName',
    'HeaderButtonTitle',
    'PopUpTitle',
    'SaveButtonTitle',
    'CancelButtonTitle',
    // 'action',
  ];
  // dataSource: any = '';
  dataSource = new MatTableDataSource<PeriodicElement>();

  addPageForm!: FormGroup;
  addPageForm1!: FormGroup;
  submitted = false;
  http_res_msg: boolean = false;
  validatemsg: any = '';
  validatemsg1: boolean = false;
  validatemsginput: any = '';
  validatemsginput1: boolean = false;
  show_save_btn1: any = true;
  show_save_btn2: any = true;
  totalPage: any = [];
  masterPagePopup: boolean = false;
  resultData: any;
  headerList: any;
  searchQuery: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public service: MasterSiteService,
    @Inject(ApiConstantsService) private apiConstant: ApiConstantsService,
    public dialog: MatDialog,
    public authService: AuthService
  ) {
    this.authService.activeTab.next("configure-setting");
  }

  ngOnInit(): void {
    const test: any = {};
    setTimeout(() => {
      this.apiConstant.getWebPageConfiguration();
      this.apiConstant.gotConfigMaster.subscribe((value) => {
        if (value) {
          this.dataSource.data = this.apiConstant.master.data;
          this.totalPage = this.apiConstant.master.pageList;
          this.resultData       = this.apiConstant.master.records;
          this.headerList       = this.apiConstant.master.headerList;
        }
      });
    }, 2000);
  }

  edit_site_Form(id: any) {
    // console.log('id', id);
  }

  removeSpecialCharacter(event: any) {
    var k;
    k = event.charCode;
    if (event.which == 32) {
      event.preventDefault();
      return false;
    }
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  submit() {}

  newMasterPage() {
    const dialog = this.dialog.open(NewMasterPageComponent, {
      disableClose: true,
      maxWidth: '100vw',
      panelClass: ['business', 'full-screen-modal'],
      data: {},
    });
    dialog.afterClosed().subscribe((result) => {
      const test: any = {};
      this.apiConstant.getWebPageConfiguration();

      this.apiConstant.gotConfigMaster.subscribe((value) => {
        if (value) {
          this.dataSource.data  = this.apiConstant.master.data;
          this.totalPage        = this.apiConstant.master.pageList;
          this.resultData       = this.apiConstant.master.records;
          this.headerList       = this.apiConstant.master.headerList;
        }
      });
    });
  }
  newInputPage() {
    const dialog = this.dialog.open(AddNewInputComponent, {
      disableClose: true,
      maxWidth: '100vw',
      panelClass: ['business', 'full-screen-modal'],
      data: {},
    });
    dialog.afterClosed().subscribe((result) => {});
  }

  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  searchBy(searchInput?: any, searchFields?: any, tableData?: any) {
    let cloneData = JSON.parse(JSON.stringify(tableData));
    return cloneData.filter((item: any) => {
      return searchFields.some((field: any) => {
        return (
          typeof item[field] == 'number'
            ? String(item[field])
            : item[field] || ''
        )
          .toLowerCase()
          .trim()
          .includes(searchInput.toLowerCase().trim());
      });
    });
  }



  addIndex(docs?: any, addEditMode?: any) {
    let Index = 1;
    docs.forEach((data: any) => {
      data.Index = Index;
      if (addEditMode) data.isEdit = false;
      Index++;
    });
    return docs;
  }

  editTableControl(row:any) {
    if(row){
      const dialog = this.dialog.open( AddNewInputComponent, {
          disableClose: true,
          panelClass: 'full-screen-modal',
          data: {
              rowData : row,
          }
      });
      dialog.afterClosed().subscribe(() => {
      })
    }
  }

}
