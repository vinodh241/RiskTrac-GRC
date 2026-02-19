import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { MasterMetricLibraryService } from 'src/app/services/master-data/master-metric-library/master-metric-library.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

export interface CurrentControls {
  Index: number;
  FrameworkName: any;
  FrameworkID: any;
  DomainName: any;
  DomainID: any;
  ControlName: any;
  ControlID: any;
  isSaved: boolean;
}

@Component({
  selector: 'app-add-metrics-library',
  templateUrl: './add-metrics-library.component.html',
  styleUrls: ['./add-metrics-library.component.scss'],
})
export class AddMetricsLibraryComponent implements OnInit {
  defineMetricLibraryForm!: FormGroup;
  submitted: boolean = false;
  controlData: any = '';
  filteredFBCC: any;
  isOwnerExists: boolean = false;
  metricLibraryData: any;
  mod: any;
  blockEdit: boolean = false;
  selectedValue:boolean = true
  owner: any;
  displayedColumns: string[] = [
    'Index',
    'framework',
    'domain',
    'frameworkControl',
    'actions',
  ];
  targetValueList:any =[{
    'id':1,
    'targetValue':"Yes"
  },{
    'id':2,
    'targetValue':"No"
  }]
  dataSource = new MatTableDataSource<CurrentControls>();
  filteredDomainOptions: any = [];
  filteredFrameworkControlOptions: any = [];
  formData: any;
  saveerror: any;
  filteredDomains: any;
  isDescriptionExists: any;
  saveFlag: boolean = false;
  targetValue: boolean = false
  targetLength : boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public parent: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddMetricsLibraryComponent>,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    public MasterMetricService: MasterMetricLibraryService
  ) {
    this.MasterMetricService.getMetricLibraryMasterInfo();
    this.initialzeData();
  }

  ngOnInit(): void {
    this.metricLibraryData = this.parent.data;
   // console.log('this.metricLibraryData: ', this.metricLibraryData);
    this.mod = this.parent.mod;
    console.log('this.mod: ', this.mod);
    this.MasterMetricService.gotInfoMaster.subscribe((value: any) => {
      if (value) {
        this.filteredFBCC =
          this.MasterMetricService.metricData.MetricOwnersList;
        this.initialzeData();
        if (this.mod == 'Edit') {
          if (this.metricLibraryData.TargetType == 'Absolute value') {
            this.targetValue = true;
            console.log('this.targetValue: 1', this.targetValue);
          } else if (this.metricLibraryData.TargetType == 'Yes/No') {
            this.targetValue = false;

            console.log('this.targetValue: 2', this.targetValue);
          }
          this.patchData();
          this.defineMetricLibraryForm.get('targetValue')?.enable();
          this.dataSource = this.metricLibraryData.Linked_Framework_Controls;
        } else {
          this.dataSource = new MatTableDataSource();
          this.initialzeData();
          this.newMetricCode();
        }
      }
    });
  }

  initialzeData() {
    this.defineMetricLibraryForm = this.fb.group({
      metricCode: ['', [Validators.required]],
      metricType: ['', [Validators.required]],
      metricOwner: ['', [Validators.required]],
      metricOwnerID: [''],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      targetType: ['', [Validators.required]],
      threshold: ['', [Validators.required]],
      targetValue: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      datapoint1Num: ['', [Validators.required]],
      datapoint2Deno: ['', [Validators.required]],
      addNewForm: this.fb.group({
        framework: [''],
        domain: [''],
        frameworkControl: [''],
      }),
    });
    this.defineMetricLibraryForm.get('targetValue')!.disable();
  }

  newMetricCode() {
    setTimeout(() => {
      this.defineMetricLibraryForm.patchValue({
        metricCode:
          this.MasterMetricService.metricData.NewMetricCode[0].NewMetricCode,
      });
    }, 1000);
  }

  close() {
    this.dialog.closeAll();
  }

  get f() {
    return this.defineMetricLibraryForm.controls;
  }

  patchData() {
    console.log('this.metricLibraryData: ', this.metricLibraryData);

    setTimeout(() => {
      this.defineMetricLibraryForm.patchValue({
        metricCode: this.metricLibraryData.MetricCode,
        metricType: this.metricLibraryData.MetricTypeID,
        metricOwner: this.metricLibraryData.MetricOwner,
        metricOwnerID: this.metricLibraryData.MetricOwnerID,
        title: this.metricLibraryData.MetricTitle,
        description: this.metricLibraryData.MetricDescription,
        targetType: this.metricLibraryData.TargetTypeID,
        threshold: this.metricLibraryData.ThresholdID,
        targetValue: this.metricLibraryData.TargetValue,
        frequency: this.metricLibraryData.FrequencyID,
        datapoint1Num: this.metricLibraryData.DataPointNumerator,
        datapoint2Deno: this.metricLibraryData.DataPointDenominator,
      });
      this.dataSource = new MatTableDataSource(
        this.MasterMetricService.addIndex(this.dataSource, true)
      );
    }, 1000);
    console.log("this.defineMetricLibraryForm",this.defineMetricLibraryForm)
  }

  filterFBCC(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredFBCC =
      this.MasterMetricService.metricData.MetricOwnersList.filter(
        (owner: any) => owner.MetricOwnerName.toLowerCase().includes(searchTerm)
      );
    this.defineMetricLibraryForm.controls['metricOwnerID'].setValue('');
    this.isOwnerExists = false;
  }

  setMetricOwner(ele: any) {
    this.defineMetricLibraryForm.controls['metricOwnerID'].setValue(
      ele.MetricOwnerGUID
    );
  }

  deleteControl(control: any) {

    const index = this.dataSource.data.findIndex(
      (item: any) => item.Index === control.Index
    );
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource(
      this.MasterMetricService.addIndex(this.dataSource.data, false)
    );
    this.dataSource._updateChangeSubscription();
  }

  saveControl(control: any) {
    this.blockEdit = false;
    this.formData = this.defineMetricLibraryForm.value.addNewForm;
    this.dataSource.data = this.dataSource.data.map((x: any) =>
      x.Index === control.Index
        ? {
            ...x,
            FrameworkName: this.formData.framework.FrameworkName,
            FrameworkID: this.formData.framework.FrameworkID,
            DomainName: this.formData.domain.DomainName,
            DomainID: this.formData.domain.DomainID,
            ControlName: this.formData.frameworkControl.ControlName,
            ControlID: this.formData.frameworkControl.ControlID,
            isSaved: false,
          }
        : x
    );

    const addNewForm = this.defineMetricLibraryForm.get(
      'addNewForm'
    ) as FormGroup;
    addNewForm.markAsUntouched();
    addNewForm.markAsPristine();
    this.saveFlag = false;
  }

  addNewControl() {
    this.blockEdit = true;
    const addNewForm = this.defineMetricLibraryForm.get(
      'addNewForm'
    ) as FormGroup;
    addNewForm.markAsUntouched();
    addNewForm.markAsPristine();
    addNewForm.reset()
    this.dataSource.data.push({
      Index: this.dataSource.data.length + 1,
      FrameworkID: null,
      FrameworkName: '',
      DomainName: '',
      DomainID: null,
      ControlName: '',
      ControlID: null,
      isSaved: true,
    });
   // console.log('this.dataSource.data: ', this.dataSource.data);

    this.dataSource._updateChangeSubscription();
  }

  filterDomain(rowData: any) {
   // console.log('rowData: ', rowData);
    this.filteredDomainOptions = JSON.parse(
      JSON.stringify(
        this.MasterMetricService.metricData.Domains.filter(
          (d: any) => d.FrameworkID == rowData.FrameworkID
        )
      )
    );
    this.filteredFrameworkControlOptions = [];
   // console.log('this.filteredDomainOptions: ', this.filteredDomainOptions);
  }

  filterDomainData(rowData: any) {
   // console.log('rowData: ', rowData);
    this.filteredFrameworkControlOptions = JSON.parse(
      JSON.stringify(
        this.MasterMetricService.metricData.FrameworkControls.filter(
          (control: any) => {
            // Check if the DomainID of the control exists in filteredDomainOptions
            return this.filteredDomainOptions.some(
              (domain: any) =>
                domain.DomainID === control.DomainID &&
                control.FrameworkID == rowData.FrameworkID
            );
          }
        )
      )
    );
  }

  checkControlSave(data: any) {
    return data.some((x: any) => x.isSaved);
  }

  onSubmit() {
   // console.log('this.filteredFBCC', this.filteredFBCC);
    this.submitted = true;
    // console.log('this.defineMetricLibraryForm.invalid: ', this.defineMetricLibraryForm);

    if (this.defineMetricLibraryForm.invalid || this.blockEdit || this.dataSource.data?.length == 0) return;
    this.MasterMetricService.addUpdateMetricData(
      this.defineMetricLibraryForm.value,
      this.mod,
      this.dataSource.data,
      this.metricLibraryData
    ).subscribe((res: any) => {
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.saveSuccess(
          this.mod == 'Add'
            ? 'Metric Library is added successfully'
            : 'Metric Library is updated successfully'
        );
        this.MasterMetricService.processMetricList(res);
      } else {
        if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
          this.utils.relogin(this._document);
        else this.saveerror = res.error.errorMessage;
      }
    //  console.log('err::', 'error');
    });
  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '5vh',
      panelClass: 'success',
      data: {
        title: 'Success',
        content: content,
      },
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
        this.MasterMetricService.getMetricData();
      }, timeout);
    });
  }

  checkDescriptionExist(e: any) {
    if (this.metricLibraryData) {
      this.isDescriptionExists = this.parent.allData.some(
        (x: any) =>
          x.MetricTitle.toLowerCase().trim() ==
            e.target.value.toLowerCase().trim() &&
          x.MetricsLibraryID !== this.metricLibraryData.MetricsLibraryID
      );
    } else {
      this.isDescriptionExists = this.parent.allData.some(
        (x: any) =>
          x.MetricTitle.toLowerCase().trim() ==
          e.target.value.toLowerCase().trim()
      );
    }
  }
  checkControlData(ele: any) {
    this.saveFlag = true;
  }
  cancel(control: any) {
    this.blockEdit = false;
    const index = this.dataSource.data.findIndex(
      (item: any) => item.Index === control.Index
    );
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource(
      this.MasterMetricService.addIndex(this.dataSource.data, false)
    );
    this.dataSource._updateChangeSubscription();
  }

  concatenateControlIDs(option: any): string {
    return (
      option.FrameworkID.toString() +
      '.' +
      option.DomainID.toString() +
      '.' +
      option.ControlID.toString()
    );
  }
  concatenateDomainIDs(option: any): string {
    return option.FrameworkID.toString() + '.' + option.DomainID.toString();
  }
  selectTarget(ele:any){
   console.log('ele: ', ele);
   this.defineMetricLibraryForm.get('targetValue')?.enable();
   this.selectedValue = true
   this.targetLength = true
   console.log('selectedValue: ', this.selectedValue);

  if(ele.TargetType == "Absolute value"){
    this.targetValue = true
   console.log('this.targetValue: 1', this.targetValue);
  }else if(ele.TargetType == "Yes/No"){
    this.targetValue = false
   console.log('this.targetValue: 2', this.targetValue);
  }
  }
}
