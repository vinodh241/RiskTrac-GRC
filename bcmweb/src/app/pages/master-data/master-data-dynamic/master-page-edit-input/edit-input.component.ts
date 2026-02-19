import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators, } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ApiConstantsService } from 'src/app/services/api-constants/api-constants.service';
import { MasterSiteService } from 'src/app/services/master-data/master-site/master-site.service';

@Component({
  selector: 'app-edit-input',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
})
export class EditInputComponent implements OnInit {
  modalForm!: FormGroup;
  resultData1: any[] = [];
  allDataSet: any;
  pageID: any;
  modifiedArr: any = [];
  dropDownData: any;
  filteredDropDownData: any;
  pageId: any;
  PopUpTitle: any;
  CancelButtonTitle: any;
  HeaderButtonTitle: any;
  pagetitleData: any;
  SaveButtonTitle: any;
  resData: any;
  filterInput: any;
  messagedata: any;
  resultData: any;
  submitted: boolean = false;
  // resultData1: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    public service: MasterSiteService,
    @Inject(ApiConstantsService) private apisConstant: ApiConstantsService,
    public dialogRef: MatDialogRef<EditInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public parent: any
  ) {
    this.pageId             = JSON.parse(localStorage.getItem('pageID') ?? '[]');
    this.PopUpTitle         = JSON.parse(localStorage.getItem('popUpTitle') ?? '[]');
    this.SaveButtonTitle    = JSON.parse(localStorage.getItem('saveButton') ?? '[]');
    this.CancelButtonTitle  = JSON.parse(localStorage.getItem('cancelButton') ?? '[]');
    this.HeaderButtonTitle  = JSON.parse(localStorage.getItem('HeaderButtonTitle') ?? '[]' );
    this.pagetitleData      = JSON.parse(localStorage.getItem('pagetitleData') ?? '[]');
  }

  ngOnInit(): void {
    this.modalForm = this.fb.group(this.parent.data);
    this.resData = this.parent.allData;
    this.apisConstant.getEditControlInfo(this.pageId,this.parent.data,this.pagetitleData);
    this.apisConstant.gotEditMaster.subscribe((value) => {
      if (value) {
        this.resultData1            = this.apisConstant.master.data;
        this.dropDownData           = this.apisConstant.master.referencedTableData;
        this.filteredDropDownData   = this.dropDownData?.filter((item: any) => {
          return this.resultData1.some((config: any) => {
            if (config.Type == 'select') {
              return item.tableName === config.Name;
            } else {
              return;
            }
          });
        });
      }
      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.modalForm = this.fb.group({});
    this.resultData1.forEach((item: any) => {
      const controlName   = item.Name;
      const initialValue  = item.AddedValue || '';
      const validators    = item.IsRequired ? [Validators.required,Validators.pattern("\S.*"), Validators.pattern("[a-zA-Z0-9\s]+")]  : [];
      this.modalForm.addControl(controlName,this.fb.control(initialValue, validators));
    });
  }

  submit() {
    let result: any = {};
    const result1 = this.areRequiredFieldsFilled(this.resultData1,this.modalForm.value);

    if (result1) {
      this.resultData1.forEach((item: any) => {
        result[item.TableControl] = this.modalForm.value[item.Name];
      });
      let parentDataArray = Array.isArray(this.parent.data) ? this.parent.data : [this.parent.data];

      if (result.NAME == parentDataArray[0].NAME) {
        this.apisConstant.editData(result, this.pagetitleData, this.parent.data).subscribe((res: any) => {
          this.submitted = false;
          this.saveSuccess(this.PopUpTitle + " " + "is updated Successfully");
        });
      } else if (result.NAME != parentDataArray[0].NAME.trim()) {
        this.filterInput = this.resData.data.filter((ob: any) => ob.NAME == result.NAME.trim());
        if (this.filterInput?.length > 0) {
          this.messagedata = result.NAME + ' already exists in : ' + this.pagetitleData;
          return this.messagedata;
        } else {
          this.apisConstant.editData(result, this.pagetitleData, this.parent.data).subscribe((res: any) => {
              this.submitted = false;
              this.saveSuccess(this.PopUpTitle + " " +"is updated Successfully");
            });
        }
      }
      this.close();
    } else {
      if (this.modalForm.invalid) {
        return;
      }
    }
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

  areRequiredFieldsFilled(data: any, formV: any) {
    for (let item of data) {
      let value = formV[item.Name] !== undefined && formV[item.Name] !== null
      ? String(formV[item.Name]).trim()
      : '';
      console.log('value: ', value);
      if (item.IsRequired && value === '') {
        this.messagedata =  'Blank space is not allowed';
        return false;
      } else if (/^[^a-zA-Z0-9]+$/.test(value)) {
        this.messagedata = 'Special characters are not allowed';
        return false;
      } else if (value.length > 512) {
        this.messagedata = 'Text length cannot exceed more than 512 characters';
        return false;
      } else if (formV[item.Name] < 0) {
        this.messagedata = 'Negative values are not allowed.';
        return false;
      }
    }
    return true;
  }

  close() {
    this.dialogRef.close(true);
    setTimeout(() => {
      this.apisConstant.getPageDetails(this.pagetitleData);
    }, 2000);
  }
}
