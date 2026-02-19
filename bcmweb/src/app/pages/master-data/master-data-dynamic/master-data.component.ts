import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MasterSiteService } from 'src/app/services/master-data/master-site/master-site.service';
import { ApiConstantsService } from 'src/app/services/api-constants/api-constants.service';
import { MatTableDataSource } from '@angular/material/table';;
import { AuthService } from 'src/app/services/auth/auth.service';
import { AddInputMasterComponent } from './master-page-add-input/add-input-master.component';
import { EditInputComponent } from './master-page-edit-input/edit-input.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss'],
})

export class MasterDataComponent implements OnInit {
  // displayedColumns = ['index', 'action'];
  dataSource = new MatTableDataSource<Element>();
  resultDataCheck: boolean = false;
  all_pages: any;
  a: any;
  b: any;
  resultData: any = [];
  pagetitleData: any;
  tableData: any;
  staticColumns: any;
  allDataSet: any;
  modalForm!: FormGroup;
  allFilterData: any;
  dataArr: any = [];
  validForm: any = [];
  valid: any;
  submitted: boolean = false;
  dataDismiss: boolean = false;
  filterData: any;
  dropDownData: any;
  modifiedArr: any = [];
  filteredDropDownData: any;
  pageId: any;
  pageTitle: any;
  HeaderButtonTitle: any;
  pageID: any;
  PopUpTitle: any;
  CancelButtonTitle: any;
  SaveButtonTitle: any;
  title: any;
  headerTitle: any;
  pID: any;
  searchQuery: string = '';
  headerRowIndex: any = ['Index'];
  headerRow: any;
  sortedData: any;
  DisplayName: any;
  AllInputs: any;
  enableAddButton : boolean = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    public service: MasterSiteService,
    @Inject(ApiConstantsService) private apisConstant: ApiConstantsService,
    public authService: AuthService,
    public utilsService: UtilsService,
    private router: Router) {
    if (this.utilsService.isSCUserNBCMUnitUser()) {
      this.authService.activeTab.next("master-data");
      this.pageId = JSON.parse(localStorage.getItem('pageID') ?? '[]');
      this.pagetitleData = JSON.parse(localStorage.getItem('pagetitleData') ?? '[]')

      setTimeout(() => {
        this.apisConstant.getPageDetails(this.pagetitleData)
        this.apisConstant.gotMaster.subscribe((value) => {
          if (value) {
            this.b = this.apisConstant.master;
            this.staticColumns    = this.b.headerList
            this.headerRow        = this.headerRowIndex.concat(this.b.headerList)
            this.dataSource.data  = this.apisConstant.master.data;
            this.title            = this.b.procResponseData[0]?.PageTitle
            this.DisplayName      = this.b.procResponseData[0]?.DisplayName
            this.headerTitle      = this.b.procResponseData[0]?.HeaderButtonTitle
            this.pID              = this.b.procResponseData[0]?.PageID;
            if(this.dataSource.data.filter((ob:any) => ob.IsActive)?.length >= Number(environment.MasterData.TotalRecords) && environment.MasterData.PageName.includes(this.DisplayName)) {
              this.enableAddButton      = true;
            } else {
              this.enableAddButton      = false;
            }
             

            console.log(this.dataSource.data)
          }
        })
      }, 3000)

      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.sortedData = this.dataSource.data.slice(); // Clone the data
    }else {
      this.router.navigate(['/business-continuity-plan'])
    }
  }

  ngOnInit(): void {
    this.allFilterData  = this.resultData.map((item: any) => item.Name);
    this.modalForm      = this.fb.group(this.allFilterData);
   

    
  }

  checkAllEmpty(obj: any): boolean {
    return Object.values(obj).every((value) => value === '');
  }

  onClick(id: any) {
    const dialog = this.dialog.open(AddInputMasterComponent, {
      disableClose: true,
      maxWidth: '100vw',
      panelClass: ['business', 'full-screen-modal'],
      data: {
        data: id,
        pageTitle: this.title,
        PageID: this.pID,
        allData: this.b

      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.methodData()
    });
  }

  submit() {
    this.submitted = true;
    const result1 = this.areRequiredFieldsFilled(
      this.resultData,
      this.modalForm.value
    );
    if (result1) {

      let result: any = {};
      this.resultData.forEach((item: any) => {
        result[item.TableControl] = this.modalForm.value[item.Name];
      });
      this.submitted = false

      this.apisConstant.addData(result, this.pagetitleData).subscribe((res: any) => {
        this.resultData = res.data;
        this.submitted = false;
        this.closeModal();
      });
    } else {
      if (this.modalForm.invalid) {
        return;
      }
    }
  }

  areRequiredFieldsFilled(data: any, formV: any) {
    for (const item of data) {
      if (item.IsRequired && formV[item.Name] === '') {
        return false;
      }
    }
    return true;
  }

  closeModal() {
    var element1 = document.getElementById('closeInput') as any;
    element1.click();
  }

  isSubmitDisabled(): boolean {
    for (const controlName in this.modalForm.controls) {
      if (this.modalForm.controls.hasOwnProperty(controlName)) {
        const control = this.modalForm.controls[controlName];
        if (!control.value || control.value.trim() === '') {
          this.valid = 'Save button will be enabled once all fields are filled';
          return true;
        }
      }
    }
    this.valid = '';
    return false;
  }

  close() {
    this.dialog.closeAll();
  }

  approve(rowData: any) {
    let data = { "PageTitle": null, "IDInfo": null, "IsActive": 0 };
    data.PageTitle = this.b.procResponseData[0].PageTitle;
    data.IDInfo = rowData;
    data.IsActive = rowData.IsActive == true ? 1 : 0
    this.apisConstant.editRecordStatus(data).subscribe((res: any) => {
      this.saveSuccess("Record updated successfully");
    });
  }

  saveSuccess(content: string): void {
    const timeout = 2000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }

  methodData() {
    this.pagetitleData = JSON.parse(localStorage.getItem('pagetitleData') ?? '[]')
    this.apisConstant.gotMaster.subscribe((value) => {
      if (value) {
        this.b = this.apisConstant.master;
        this.staticColumns = this.b.headerList
        this.headerRow = this.headerRowIndex.concat(this.b.headerList)
        this.dataSource.data = this.apisConstant.master.data;
        this.title = this.b.procResponseData[0]?.PageTitle
        this.headerTitle = this.b.procResponseData[0]?.HeaderButtonTitle
        this.pID = this.b.procResponseData[0]?.PageID
      }
    });
  }

  edit_site_Form(id: any) {
    this.pageId = JSON.parse(localStorage.getItem('pageID') ?? '[]');
    const dialog = this.dialog.open(EditInputComponent, {
      disableClose: true,
      maxWidth: '100vw',
      panelClass: ['business', 'full-screen-modal'],
      data: {
        data: id,
        pageTitle: this.title,
        PageID: this.pID,
        allData: this.b
      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.methodData()
    });
  }

  applyFilter(): void {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  splitCamelCase(input: any) {
    return input
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str: any) => str.toUpperCase());
  }

  sortData(event: any) {
    const sortedData = this.sortByData(event, this.dataSource.data);
    this.dataSource.data = sortedData;
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
