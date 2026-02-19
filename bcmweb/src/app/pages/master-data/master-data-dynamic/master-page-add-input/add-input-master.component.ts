import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {MAT_DIALOG_DATA,MatDialog,MatDialogRef,} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ApiConstantsService } from 'src/app/services/api-constants/api-constants.service';

@Component({
  selector: 'app-add-input-master',
  templateUrl: './add-input-master.component.html',
  styleUrls: ['./add-input-master.component.scss'],
})
export class AddInputMasterComponent {
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
  opt: any;
  resData: any;
  filterInput: any;
  messagedata: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    private apisConstant: ApiConstantsService,
    public dialogRef: MatDialogRef<AddInputMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public parent: any
  ) {
    // this.service.getSiteMaster();
    this.pageId             = JSON.parse(localStorage.getItem('pageID') ?? '[]');
    this.PopUpTitle         = JSON.parse(localStorage.getItem('popUpTitle') ?? '[]');
    this.CancelButtonTitle  = JSON.parse(localStorage.getItem('cancelButton') ?? '[]');
    this.SaveButtonTitle    = JSON.parse(localStorage.getItem('saveButton') ?? '[]' );
    this.HeaderButtonTitle  = JSON.parse(localStorage.getItem('HeaderButtonTitle') ?? '[]');
    this.pagetitleData      = JSON.parse(localStorage.getItem('pagetitleData') ?? '[]');

    this.resData            = this.parent.allData;
    this.submitted          = false;
    setTimeout(() => {
      this.apisConstant.getWebPageControlConfiguration(this.parent.PageID,this.pagetitleData);
    }, 2000);

    this.apisConstant.gotcontrolMaster.subscribe((value) => {
      if (value) {
        this.resultData             = this.apisConstant.masterData.data.webControlConfigurations;
        this.dropDownData           = this.apisConstant.masterData.data.referencedTableData;
        this.filteredDropDownData   = this.dropDownData.filter((item: any) => {
          return this.resultData.some((config: any) => {
            return item.tableName === config.Name;
          });
        });
      }
      this.modalForm = new FormGroup({});
      this.resultData.forEach((ob: any) => {
        this.modalForm.addControl(ob.Name,new FormControl('', [Validators.required, Validators.pattern("\S.*"), Validators.pattern("[a-zA-Z0-9\s]+")]));
      });
    });
  }

  submit() {
    this.submitted   = true;
    this.messagedata = '';
    const result1 = this.areRequiredFieldsFilled(this.resultData,this.modalForm.value);
    if (result1) {
      let result: any = {};
      this.resultData.forEach((item: any) => {
        result[item.TableControl] = this.modalForm.value[item.Name];
      });
      this.submitted    = false;
      this.filterInput  = this.resData.data?.filter((ele: any) => ele.NAME == result.NAME.trim());

      if (this.filterInput.length > 0) {
        this.messagedata = result.NAME + ' already exists in : ' + this.parent.pageTitle;
        return this.messagedata;
      } else {
        this.apisConstant.addData(result, this.parent.pageTitle).subscribe((res: any) => {
          this.resultData = res.data;
          this.submitted = false;
          this.pagetitleData = JSON.parse(localStorage.getItem('pagetitleData') ?? '[]');
          this.saveSuccess(this.PopUpTitle + " " + "is added Successfully");

        });
        this.close();
      }
    } else {
      if (this.modalForm.invalid) {
        return;
      }
    }
  }

  areRequiredFieldsFilled(data: any, formV: any) {
    console.log('✌️formV --->', formV);
    for (const item of data) {
      const value = formV[item.Name].trim();
      console.log('✌️value --->', value);
      if (item.IsRequired && value === '') {
        this.messagedata =  'Blank space is not allowed';
        return false;
      } else if (/^[^a-zA-Z0-9]+$/.test(value)) {
        this.messagedata = 'Special characters are not allowed';
        return false;
      } else if (formV[item.Name].trim().length > 512) {
        this.messagedata = 'Text length cannot exceed more than 512 characters';
        return false;
      } else if (value < 0) {
        this.messagedata = 'Negative values are not allowed.';
        return false;
      }

    }
    return true;
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

  close() {
    this.dialogRef.close(true);
    setTimeout(() => {
      this.apisConstant.getPageDetails(this.pagetitleData);
    }, 2000);
  }
}
