import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiConstantsService } from 'src/app/services/api-constants/api-constants.service';
import { MasterSiteService } from 'src/app/services/master-data/master-site/master-site.service';

@Component({
  selector: 'app-add-new-input',
  templateUrl: './add-new-input.component.html',
  styleUrls: ['./add-new-input.component.scss'],
})
export class AddNewInputComponent implements OnInit {
  addPageForm!: FormGroup;
  headerData: any;
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
  newParameter: boolean = false;
  filteredPageID: any;
  checked: boolean = false;
  isForeignKeyChecked: boolean = false;
  tableData: any;
  headerChecked: boolean = false;
  headerDataForeign: any;
  selectPageControl: any;
  row:any
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public service: MasterSiteService,
    @Inject(ApiConstantsService) private apiConstant: ApiConstantsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {}

  ngOnInit(): void {
    this.row = this.data.rowData;
    const test: any = {};
    this.apiConstant.getWebPageConfiguration();

      this.apiConstant.gotConfigMaster.subscribe((value) => {
        if (value) {
          this.totalPage = this.apiConstant.master.pageList;
        }
      });
    this.initialzeForm1();
    this.editTableData();
  }

  initialzeForm1() {
    /***********************************Validators*********************************************** */
    this.addPageForm1 = this.fb.group({
      SelectPage: ['', [Validators.required]],
      SelectHeader: ['', [Validators.required]],
      IsRequired: [''],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      label: ['', [Validators.required]],
      value: [''],
      selectedTableNames: [''],
      IsForeignKey: [''],
      selectedTableHeader: [''],
      Placeholder: ['', [Validators.required]],
      Class: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      newParameter: [''],
    });
  }

  get f() {
    return this.addPageForm1.controls;
  }

  addPage1() {
    this.submitted = true;
    this.http_res_msg = true;

    if (this.addPageForm1.valid) {
      this.validatemsg = 'Wait...';
      let formValue = { ...this.addPageForm1.value };
      formValue.PageID = this.filteredPageID[0].PageID;
      this.submitted = false;

      this.apiConstant
        .addWebPageControlConfiguration(formValue)
        .subscribe((res: any) => {
          next: this.validatemsginput1 = true;
          this.validatemsginput = 'Page input is added. Thank you!';
          this.show_save_btn2 = false;
          this.submitted = false;
          error: (error: any) => {
            if (error.status === 404) {
              this.validatemsginput1 = true;
              this.validatemsginput = 'Unable to Submit Form: Please Try Again';
            }
          };
        });

      this.addPageForm1.reset();
    }
  }

  editTableData(){
    let FilteredPage = this.totalPage.filter((ob:any) => Number(ob.PageID) == Number(this.row.PageID));
    this.addPageForm1.patchValue({
      SelectPage:FilteredPage[0].PageTitle,
      label: this.row.LabelName,
      value: this.row.Value,
      IsRequired: this.row.IsRequired,
      Class: this.row.Class,
      Placeholder: this.row.Placeholder,

    });
  }

  close() {
    this.dialog.closeAll();
  }

  onSelect() {
    const selectPageControl = this.addPageForm1.get('SelectPage');
    this.tableData = this.totalPage.filter(
      (ele: any) => ele.PageTitle !== selectPageControl?.value
    );
    if (selectPageControl !== null) {
      const selectedPageTitle = selectPageControl.value;
      this.filteredPageID = this.totalPage.filter(
        (ele: any) => selectedPageTitle == ele.PageTitle
      );
      this.apiConstant.getInfoMasterFields(selectedPageTitle);
      this.apiConstant.gotInputMaster.subscribe((value) => {
        if (value) {
          this.headerData = this.apiConstant.master.data;
        }
      });
    }
  }

  onSelectHeader() {
    const selectPageHeader = this.addPageForm1.get('SelectHeader');

    if (selectPageHeader !== null && selectPageHeader.value === 'AddNewfield') {
      this.newParameter = true;
    } else {
      this.newParameter = false;
      this.headerChecked = false;
    }
  }

  handleCheckboxClick(event: any) {
    this.isForeignKeyChecked = event.target.checked;
    if (this.isForeignKeyChecked) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }
  onSelectHeaderForeign() {
    this.headerChecked = true;
    this.selectPageControl = this.addPageForm1.get('selectedTableNames');
    if (this.selectPageControl !== null) {
      const selectedPageTitle = this.selectPageControl.value;
      this.apiConstant.getInfoMasterFields(selectedPageTitle);
      this.apiConstant.gotInputMaster.subscribe((value) => {
        if (value) {
          this.headerDataForeign = this.apiConstant.master.selectedTableHeader;
        }
      });
    }
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
}
