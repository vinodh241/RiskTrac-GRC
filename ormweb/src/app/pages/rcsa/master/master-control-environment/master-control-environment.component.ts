import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { ControlAutomationScoreService } from 'src/app/services/rcsa/master/control-environment/control-automation-score.service';
import { ControlFrequencyScoreService } from 'src/app/services/rcsa/master/control-environment/control-frequency-score.service';
import { ControlInPaceService } from 'src/app/services/rcsa/master/control-environment/control-in-pace.service';
import { ControlNatureScoreService } from 'src/app/services/rcsa/master/control-environment/control-nature-score.service';
import { ControlTotalScoreService } from 'src/app/services/rcsa/master/control-environment/control-total-score.service';
import { OverallControlEnvironmentRatingService } from 'src/app/services/rcsa/master/control-environment/overall-control-environment-rating.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-master-control-environment',
  templateUrl: './master-control-environment.component.html',
  styleUrls: ['./master-control-environment.component.scss']
})
export class MasterControlEnvironmentComponent implements OnInit {
  exceedCharLenErr: any;
  type: any;
  duplicate: any;
  displayedControlTypeColumns = ['Index', 'ControlType', 'Action', 'Status'];
  controlTypeForm = this.fb.group({
    ControlTypeID: [null],
    ControlType: ['', Validators.required]
  });
  GridFormsControlType = this.fb.group({
    GridRows: this.fb.array<FormGroup>([])
  });
  dataSourceControlType = new MatTableDataSource<FormGroup>();
  addControlTypeDialog = false;
  saveControlTypeError = '';
  @ViewChild('ctSort', { read: MatSort }) ctSort!: MatSort;

  constructor(private controlInPaceService: ControlInPaceService,
    private configScoreRatingService: ConfigScoreRatingService,
    private controlNatureScoreService: ControlNatureScoreService,
    private controlAutomationScoreService: ControlAutomationScoreService,
    private controlFrequencyScoreService: ControlFrequencyScoreService,
    private controlTotalScoreService: ControlTotalScoreService,
    private overallControlEnvironmentRatingService: OverallControlEnvironmentRatingService,
    private router: Router,
    public utils: UtilsService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    @Inject(DOCUMENT) private _document: any
  ) { }

  ngOnInit(): void {
    this.GridFormsControlInPlace = this._formBuilder.group({
      GridRows: this._formBuilder.array([])
    });
    this.GridFormsControlNatureScore = this._formBuilder.group({
      GridRows: this._formBuilder.array([])
    });
    this.GridFormsControlAutomationScore = this._formBuilder.group({
      GridRows: this._formBuilder.array([])
    });
    this.GridFormsControlFrequencyScore = this._formBuilder.group({
      GridRows: this._formBuilder.array([])
    });
    this.getPageLoadData();
  }

  getPageLoadData(): void {
    this.configScoreRatingService.getMasterControlEnvironmentScreen().subscribe(data => {
      next: {
        if (data.success == 1) {
          this.processControlInPlace(data);
          this.processControlNatureScore(data);
          this.processControlAutomationScore(data);
          this.processControlFrequencyScore(data);
          this.processControlTotalScoreMasterData(data);
          this.processControlTotalScore(data);
          this.processMasterOverallControlEnvironmentRatingData(data);
          this.processOverallControlEnvironmentRating(data);
          this.processControlType(data);
        } else {
          if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
        }
      }
    });
  }

  //#region ControlInPlace
  displayedControlInPlaceColumns: string[] = ['Index', 'RatingName', 'Action', 'Status'];
  dataSourceControlInPlace = new MatTableDataSource<any>();
  gridDataSourceControlInPlace: any;
  addControlInPlaceDialog: boolean = false;
  masterControlInPlaceForm = new FormGroup({
    txtRateName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    txtRateId: new FormControl(0)
  });
  GridFormsControlInPlace!: FormGroup;
  saveControlInPlaceError: String = "";
  // @ts-ignore
  @ViewChild(MatSort) sortControlInPlace: MatSort;



  processControlInPlace(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ControlInPace.length > 0) {
        let docs: any = this.gridDataSourceControlInPlace = data.result.recordset.ControlInPace;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
          });
          this.GridFormsControlInPlace = this.fb.group({
            GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
              Name: new FormControl(val.Name, [Validators.required]),
              ControlInPaceID: new FormControl(val.ControlInPaceID),
              IsActive: new FormControl(val.IsActive),
              RowNumber: new FormControl(val.RowNumber),
              action: new FormControl('existingRecord'),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            })
            )) //end of fb array
          }); // end of form group creation
          this.dataSourceControlInPlace = new MatTableDataSource((
            this.GridFormsControlInPlace.get('GridRows') as FormArray).controls);
          this.dataSourceControlInPlace.sort = this.sortControlInPlace
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  editControlInPlaceData(GridFormElement: any, i: number) {
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
  }

  // On click of correct button in table (after click on edit) this method will call
  saveEditControlInPlaceData(GridFormElement: any, i: any) {
    const rowvalue = (GridFormElement.get('GridRows').at(i).get('Name')?.value)?.trim();
    let filteredRecords = this.gridDataSourceControlInPlace.filter((ob: any, inx: any) => inx != i);
    this.checkCharLengthDuplicate(rowvalue, 'Name', filteredRecords).then((allowToSave) => {
      if (allowToSave) {
        return;
      }
      GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
      let data = {
        "name": rowvalue,
        "createdBy": "palani",
        "id": GridFormElement.get('GridRows').at(i).get('ControlInPaceID')?.value
      }
      this.controlInPaceService.updateData(data).subscribe(res => {
        next:
        if (res.success == 1) {
          this.cancelControlInPace();
          this.addControlInPlaceDialog = false;
          this.saveSuccess(res.message);
          this.saveControlInPlaceError = "";
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveControlInPlaceError = res.error.errorMessage;
          this.CancelControlInPlace(GridFormElement, i);
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    });
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelControlInPlace(GridFormElement: any, i: any) {
    let obj = this.gridDataSourceControlInPlace.find((a: any) => a.ControlInPaceID == GridFormElement.get('GridRows').at(i).get('ControlInPaceID')?.value)
    GridFormElement.get('GridRows').at(i).get('Name').patchValue(obj?.Name);
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
    this.clearMessage();
  }

  initiatAddControlInPace(): void {
    this.addControlInPlaceDialog = true;
  }

  cancelControlInPace(): void {
    this.masterControlInPlaceForm.reset();
    this.addControlInPlaceDialog = false;
    this.saveControlInPlaceError = "";
    this.clearMessage();
  }

  saveControlInPlaceData(): void {
    if (this.masterControlInPlaceForm.get('txtRateId')?.value == 0 || this.masterControlInPlaceForm.get('txtRateId')?.value == null) {
      const rowvalue = (this.masterControlInPlaceForm.get('txtRateName')?.value)?.trim();
      this.checkCharLengthDuplicate(rowvalue, 'Name', this.gridDataSourceControlInPlace).then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "name": rowvalue
        }
        this.controlInPaceService.addNew(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.cancelControlInPace();
            this.addControlInPlaceDialog = false;
            this.saveSuccess(res.message);
            this.saveControlInPlaceError = "";
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveControlInPlaceError = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      })
    }
    else {
      const rowvalue = (this.masterControlInPlaceForm.get('txtRateName')?.value)?.trim();
      this.checkCharLengthDuplicate(rowvalue, 'Name', this.gridDataSourceControlInPlace).then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "name": (this.masterControlInPlaceForm.get('txtRateName')?.value)?.trim(),
          "id": this.masterControlInPlaceForm.get('txtRateId')?.value
        }
        this.controlInPaceService.updateData(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.cancelControlInPace();
            this.addControlInPlaceDialog = false;
            this.saveSuccess(res.message);
            this.saveControlInPlaceError = "";
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveControlInPlaceError = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      })
    }
  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });
    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.saveControlInPlaceError = this.saveControlNatureScoreerror = this.saveControlAutomationScoreerror = this.saveControlFrequencyScoreerror = this.saveControlTotalScoreerror = this.saveOverallControlEnvironmentRatingerror = "";
        this.getPageLoadData();
      }, timeout)
    });
  }

  editControlInPlace(row: any): void {
    this.resetForm();
    this.setValue(row);
    this.addControlInPlaceDialog = true;
  }

  resetForm(): void {
    this.masterControlInPlaceForm.reset();
  }

  setValue(data: any): void {
    this.masterControlInPlaceForm.patchValue({ txtRateName: data.Name, txtRateId: data.ControlInPaceID });
  }

  changedControlInPlace(data: any, event: any): void {
    let obj = {
      "id": data.get('ControlInPaceID')?.value,
      "isActive": !data.get('IsActive')?.value
    }
    this.controlInPaceService.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.saveSuccess(res.message);
        this.saveControlInPlaceError = "";
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveControlInPlaceError = res.error.errorMessage;
        event.source.checked = !event.source.checked;
      }
      error: (err: any) =>
      console.log("err::", err);
    });
  }

  //#endregion
  //#region Control Nature Score
  displayedControlNatureScoreColumns: string[] = ['Index', 'RatingName', 'RatingScore', 'Action', 'Status'];
  dataSourceControlNatureScore = new MatTableDataSource<any>();
  gridDataSourceControlNatureScore: any;
  addControlNatureScoredg: boolean = false;
  controlNatureScoreForm = new FormGroup({
    txtRateName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    txtratescore: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtRateId: new FormControl(0)
  });
  GridFormsControlNatureScore!: FormGroup;
  saveControlNatureScoreerror: String = "";
  // @ts-ignore
  @ViewChild(MatSort) sortControlNatureScore: MatSort;

  getControlNatureScore(): void {
    this.controlNatureScoreService.getAll().subscribe(res => {
      next:
      this.processControlNatureScore(res);
    });
  }

  processControlNatureScore(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ControlNatureScore.length > 0) {
        let docs: any = this.gridDataSourceControlNatureScore = data.result.recordset.ControlNatureScore;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
          });
          this.GridFormsControlNatureScore = this.fb.group({
            GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
              NatureofControl: new FormControl(val.NatureofControl, [Validators.required]),
              Score: new FormControl(val.Score, [Validators.required]),
              ControlNatureID: new FormControl(val.ControlNatureID),
              IsActive: new FormControl(val.IsActive),
              RowNumber: new FormControl(val.RowNumber),
              action: new FormControl('existingRecord'),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            })
            )) //end of fb array
          }); // end of form group cretation
          this.dataSourceControlNatureScore = new MatTableDataSource((
            this.GridFormsControlNatureScore.get('GridRows') as FormArray).controls);
          this.dataSourceControlNatureScore.sort = this.sortControlNatureScore
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  editControlNatureScoreData(GridFormElement: any, i: number) {
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
  }

  // On click of correct button in table (after click on edit) this method will call
  saveEditControlNatureScoreData(GridFormElement: any, i: any) {
    const rowValue = (GridFormElement.get('GridRows').at(i).get('NatureofControl')?.value)?.trim();
    this.checkCharLength(rowValue, 'ControlNatureScore').then((allowToSave) => {
      if (allowToSave) {
        return;
      }
      GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
      let data = {
        "natureOfControl": rowValue,
        "score": GridFormElement.get('GridRows').at(i).get('Score')?.value,
        "id": GridFormElement.get('GridRows').at(i).get('ControlNatureID')?.value,
        "createdBy": "palani"
      }
      this.controlNatureScoreService.updateData(data).subscribe(res => {
        next:
        if (res.success == 1) {
          this.cancelControlNatureScore();
          this.addControlNatureScoredg = false;
          this.saveSuccess(res.message);
          this.saveControlNatureScoreerror = "";
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveControlNatureScoreerror = res.error.errorMessage;
          this.CancelControlNatureScore(GridFormElement, i);
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    });
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelControlNatureScore(GridFormElement: any, i: any) {
    let obj = this.gridDataSourceControlNatureScore.find((a: any) => a.ControlNatureID == GridFormElement.get('GridRows').at(i).get('ControlNatureID')?.value)
    GridFormElement.get('GridRows').at(i).get('NatureofControl').patchValue(obj?.NatureofControl);
    GridFormElement.get('GridRows').at(i).get('Score').patchValue(obj?.Score);
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
    this.clearMessage();
  }

  initiatAddControlNatureScore(): void {
    this.addControlNatureScoredg = true;
  }

  cancelControlNatureScore(): void {
    this.resetControlNatureScore();
    this.addControlNatureScoredg = false;
    this.saveControlNatureScoreerror = "";
    this.clearMessage();
  }

  resetControlNatureScore(): void {
    this.controlNatureScoreForm.reset();
  }

  editControlNatureScore(row: any): void {
    this.resetControlNatureScore();
    this.setControlNatureScoreValue(row);
    this.addControlNatureScoredg = true;
  }

  setControlNatureScoreValue(data: any): void {
    this.controlNatureScoreForm.patchValue({ txtRateName: data.NatureofControl, txtratescore: data.Score, txtRateId: data.ControlNatureID });
  }

  changedControlNatureScore(data: any, event: any): void {
    let obj = {
      "id": data.get('ControlNatureID')?.value,
      "isActive": !data.get('IsActive')?.value
    }
    this.controlNatureScoreService.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.saveSuccess(res.message);
        this.saveControlNatureScoreerror = "";
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveControlNatureScoreerror = res.error.errorMessage;
        event.source.checked = !event.source.checked;
      }
      error: (err: any) =>
      console.log("err::", err);
    });
  }

  saveControlNatureScore(): void {
    if (this.controlNatureScoreForm.get('txtControlNatureScoreID')?.value == 0 || this.controlNatureScoreForm.get('txtControlNatureScoreID')?.value == null) {
      const rowValue = (this.controlNatureScoreForm.get('txtRateName')?.value)?.trim();
      this.checkCharLength(rowValue, 'ControlNatureScore').then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "natureOfControl": rowValue,
          "score": this.controlNatureScoreForm.get('txtratescore')?.value,
          "createdBy": "palani"
        }
        this.controlNatureScoreService.addNew(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.cancelControlNatureScore();
            this.addControlNatureScoredg = false;
            this.saveSuccess(res.message);
            this.saveControlNatureScoreerror = "";
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveControlNatureScoreerror = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      })
    }
    else {
      let data = {
        "natureOfControl": (this.controlNatureScoreForm.get('txtRateName')?.value)?.trim(),
        "score": this.controlNatureScoreForm.get('txtratescore')?.value,
        "id": this.controlNatureScoreForm.get('txtRateId')?.value,
        "createdBy": "palani"
      }
      this.controlNatureScoreService.updateData(data).subscribe(res => {
        next:
        if (res.success == 1) {
          this.cancelControlNatureScore();
          this.addControlNatureScoredg = false;
          this.saveSuccess(res.message);
          this.saveControlNatureScoreerror = "";
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveControlNatureScoreerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    }
  }

  //#endregion
  //#region control automation
  displayedControlAutomationScoreColumns: string[] = ['Index', 'RatingName', 'RatingScore', 'Action', 'Status'];
  dataSourceControlAutomationScore = new MatTableDataSource<any>();
  gridDataSourceControlAutomationScore: any;
  addControlAutomationScoredg: boolean = false;
  controlAutomationScoreForm = new FormGroup({
    txtRateName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    txtratescore: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtRateId: new FormControl(0)
  });
  GridFormsControlAutomationScore!: FormGroup;
  saveControlAutomationScoreerror: String = "";
  // @ts-ignore
  @ViewChild(MatSort) sortAutomation: MatSort;

  getControlAutomationScore(): void {
    this.controlAutomationScoreService.getAll().subscribe(res => {
      next:
      this.processControlAutomationScore(res);
    });
  }

  processControlAutomationScore(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ControlAutomationScore.length > 0) {
        let docs: any = this.gridDataSourceControlAutomationScore = data.result.recordset.ControlAutomationScore;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
          });
          this.GridFormsControlAutomationScore = this.fb.group({
            GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
              LevelOfControl: new FormControl(val.LevelOfControl, [Validators.required, Validators.minLength(2)]),
              Score: new FormControl(val.Score, [Validators.required]),
              ControlAutomationID: new FormControl(val.ControlAutomationID),
              IsActive: new FormControl(val.IsActive),
              RowNumber: new FormControl(val.RowNumber),
              action: new FormControl('existingRecord'),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            })
            )) //end of fb array
          }); // end of form group cretation
          this.dataSourceControlAutomationScore = new MatTableDataSource((
            this.GridFormsControlAutomationScore.get('GridRows') as FormArray).controls);
          this.dataSourceControlAutomationScore.sort = this.sortAutomation
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  editControlAutomationScoreData(GridFormElement: any, i: number) {
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
  }

  // On click of correct button in table (after click on edit) this method will call
  saveEditControlAutomationScoreData(GridFormElement: any, i: any) {
    const rowValue = (GridFormElement.get('GridRows').at(i).get('LevelOfControl')?.value)?.trim()
    this.checkCharLength(rowValue, 'ControlAutomationScore').then((allowToSave) => {
      if (allowToSave) {
        return;
      }
      GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
      let data = {
        "levelOfControl": (GridFormElement.get('GridRows').at(i).get('LevelOfControl')?.value)?.trim(),
        "score": GridFormElement.get('GridRows').at(i).get('Score')?.value,
        "id": GridFormElement.get('GridRows').at(i).get('ControlAutomationID')?.value,
        "createdBy": "palani"
      }
      this.controlAutomationScoreService.updateData(data).subscribe(res => {
        next:
        if (res.success == 1) {
          this.cancelControlAutomationScore();
          this.addControlAutomationScoredg = false;
          this.saveSuccess(res.message);
          this.saveControlAutomationScoreerror = "";
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveControlAutomationScoreerror = res.error.errorMessage;
          this.CancelControlAutomationScore(GridFormElement, i);
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    })
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelControlAutomationScore(GridFormElement: any, i: any) {
    let obj = this.gridDataSourceControlAutomationScore.find((a: any) => a.ControlAutomationID == GridFormElement.get('GridRows').at(i).get('ControlAutomationID')?.value)
    GridFormElement.get('GridRows').at(i).get('LevelOfControl').patchValue(obj?.LevelOfControl);
    GridFormElement.get('GridRows').at(i).get('Score').patchValue(obj?.Score);
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
    this.clearMessage();
  }

  initiatAddControlAutomationScore(): void {
    this.addControlAutomationScoredg = true;
  }

  cancelControlAutomationScore(): void {
    this.resetControlAutomationScore();
    this.addControlAutomationScoredg = false;
    this.saveControlAutomationScoreerror = "";
    this.clearMessage();
  }

  resetControlAutomationScore(): void {
    this.controlAutomationScoreForm.reset();
  }

  editControlAutomationScore(row: any): void {
    this.resetControlAutomationScore();
    this.setControlAutomationScoreValue(row);
    this.addControlAutomationScoredg = true;
  }

  setControlAutomationScoreValue(data: any): void {
    this.controlAutomationScoreForm.patchValue({ txtRateName: data.LevelOfControl, txtratescore: data.Score, txtRateId: data.ControlAutomationID });
  }

  changedControlAutomationScore(data: any, event: any): void {
    let obj = {
      "id": data.get('ControlAutomationID')?.value,
      "isActive": !data.get('IsActive')?.value
    }
    this.controlAutomationScoreService.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.saveSuccess(res.message);
        this.saveControlAutomationScoreerror = "";
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveControlAutomationScoreerror = res.error.errorMessage;
        event.source.checked = !event.source.checked;
      }
      error: (err: any) =>
      console.log("err::", err);
    });
  }

  saveControlAutomationScore(): void {
    if (this.controlAutomationScoreForm.get('txtControlAutomationScoreID')?.value == 0 || this.controlAutomationScoreForm.get('txtControlAutomationScoreID')?.value == null) {
      const rowValue = (this.controlAutomationScoreForm.get('txtRateName')?.value)?.trim();
      this.checkCharLength(rowValue, 'ControlAutomationScore').then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "levelOfControl": rowValue,
          "score": this.controlAutomationScoreForm.get('txtratescore')?.value,
          "createdBy": "palani"
        }
        this.controlAutomationScoreService.addNew(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.cancelControlAutomationScore();
            this.addControlAutomationScoredg = false;
            this.saveSuccess(res.message);
            this.saveControlAutomationScoreerror = "";
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveControlAutomationScoreerror = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      });
    }
    else {
      const rowValue = (this.controlAutomationScoreForm.get('txtRateName')?.value)?.trim();
      this.checkCharLength(rowValue, 'ControlAutomationScore').then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "LevelOfControl": rowValue,
          "score": this.controlAutomationScoreForm.get('txtratescore')?.value,
          "id": this.controlAutomationScoreForm.get('txtRateId')?.value,
          "createdBy": "palani"
        }
        this.controlAutomationScoreService.updateData(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.cancelControlAutomationScore();
            this.addControlAutomationScoredg = false;
            this.saveSuccess(res.message);
            this.saveControlAutomationScoreerror = "";
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveControlAutomationScoreerror = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      })
    }
  }
  //#endregion control automation
  //#region Frequency
  displayedControlFrequencyScoreColumns: string[] = ['Index', 'RatingName', 'RatingScore', 'Action', 'Status'];
  dataSourceControlFrequencyScore = new MatTableDataSource<any>();
  gridDataSourceControlFrequencyScore: any;
  addControlFrequencyScoredg: boolean = false;
  controlFrequencyScoreForm = new FormGroup({
    txtRateName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    txtratescore: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtRateId: new FormControl(0)
  });
  GridFormsControlFrequencyScore!: FormGroup;
  saveControlFrequencyScoreerror: String = "";
  // @ts-ignore
  @ViewChild(MatSort) sortFrequency: MatSort;

  getControlFrequencyScore(): void {
    this.controlFrequencyScoreService.getAll().subscribe(res => {
      next:
      this.processControlFrequencyScore(res);
    });
  }

  processControlFrequencyScore(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ControlFrequencyScore.length > 0) {
        let docs: any = this.gridDataSourceControlFrequencyScore = data.result.recordset.ControlFrequencyScore;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
          });
          this.GridFormsControlFrequencyScore = this.fb.group({
            GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
              Frequency: new FormControl(val.Frequency, [Validators.required]),
              Score: new FormControl(val.Score, [Validators.required]),
              ControlFrequencyID: new FormControl(val.ControlFrequencyID),
              IsActive: new FormControl(val.IsActive),
              RowNumber: new FormControl(val.RowNumber),
              action: new FormControl('existingRecord'),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            })
            )) //end of fb array
          }); // end of form group cretation
          this.dataSourceControlFrequencyScore = new MatTableDataSource((
            this.GridFormsControlFrequencyScore.get('GridRows') as FormArray).controls);
          this.dataSourceControlFrequencyScore.sort = this.sortFrequency
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  editControlFrequencyScoreData(GridFormElement: any, i: number) {
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
  }

  // On click of correct button in table (after click on edit) this method will call
  saveEditControlFrequencyScoreData(GridFormElement: any, i: any) {
    const rowValue = (GridFormElement.get('GridRows').at(i).get('Frequency')?.value)?.trim();
    this.checkCharLength(rowValue, 'ControlFrequencyScore').then((allowToSave) => {
      if (allowToSave) {
        return;
      }
      GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
      let data = {
        "frequency": rowValue,
        "score": GridFormElement.get('GridRows').at(i).get('Score')?.value,
        "id": GridFormElement.get('GridRows').at(i).get('ControlFrequencyID')?.value,
        "createdBy": "palani"
      }
      this.controlFrequencyScoreService.updateData(data).subscribe(res => {
        next:
        if (res.success == 1) {
          this.cancelControlFrequencyScore();
          this.addControlFrequencyScoredg = false;
          this.saveSuccess(res.message);
          this.saveControlFrequencyScoreerror = "";
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveControlFrequencyScoreerror = res.error.errorMessage;
          this.CancelControlFrequencyScore(GridFormElement, i);
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    })
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelControlFrequencyScore(GridFormElement: any, i: any) {
    let obj = this.gridDataSourceControlFrequencyScore.find((a: any) => a.ControlFrequencyID == GridFormElement.get('GridRows').at(i).get('ControlFrequencyID')?.value)
    GridFormElement.get('GridRows').at(i).get('Frequency').patchValue(obj?.Frequency);
    GridFormElement.get('GridRows').at(i).get('Score').patchValue(obj?.Score);
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
    this.clearMessage();
  }

  initiatAddControlFrequencyScore(): void {
    this.addControlFrequencyScoredg = true;
  }

  cancelControlFrequencyScore(): void {
    this.resetControlFrequencyScore();
    this.addControlFrequencyScoredg = false;
    this.saveControlFrequencyScoreerror = "";
    this.clearMessage();
  }

  resetControlFrequencyScore(): void {
    this.controlFrequencyScoreForm.reset();
  }

  editControlFrequencyScore(row: any): void {
    this.resetControlFrequencyScore();
    this.setControlFrequencyScoreValue(row);
    this.addControlFrequencyScoredg = true;
  }

  setControlFrequencyScoreValue(data: any): void {
    this.controlFrequencyScoreForm.patchValue({ txtRateName: data.Frequency, txtratescore: data.Score, txtRateId: data.ControlFrequencyID });
  }

  changedControlFrequencyScore(data: any, event: any): void {
    let obj = {
      "id": data.get('ControlFrequencyID')?.value,
      "isActive": !data.get('IsActive')?.value
    }
    this.controlFrequencyScoreService.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.saveSuccess(res.message);
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveControlFrequencyScoreerror = res.error.errorMessage;
        event.source.checked = !event.source.checked;
      }
      error: (err: any) =>
      console.log("err::", err);
    });
  }

  saveControlFrequencyScore(): void {
    if (this.controlFrequencyScoreForm.get('txtControlFrequencyScoreID')?.value == 0 || this.controlFrequencyScoreForm.get('txtControlFrequencyScoreID')?.value == null) {
      const rowValue = (this.controlFrequencyScoreForm.get('txtRateName')?.value)?.trim();
      this.checkCharLength(rowValue, 'ControlFrequencyScore').then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "frequency": rowValue,
          "score": this.controlFrequencyScoreForm.get('txtratescore')?.value,
          "createdBy": "palani"
        }
        this.controlFrequencyScoreService.addNew(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.cancelControlFrequencyScore();
            this.addControlFrequencyScoredg = false;
            this.saveSuccess(res.message);
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveControlFrequencyScoreerror = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      })
    }
    else {
      const rowValue = (this.controlFrequencyScoreForm.get('txtRateName')?.value)?.trim();
      this.checkCharLength(rowValue, 'ControlFrequencyScore').then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "Frequency": rowValue,
          "score": this.controlFrequencyScoreForm.get('txtratescore')?.value,
          "id": this.controlFrequencyScoreForm.get('txtRateId')?.value,
          "createdBy": "palani"
        }
        this.controlFrequencyScoreService.updateData(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.cancelControlFrequencyScore();
            this.addControlFrequencyScoredg = false;
            this.saveSuccess(res.message);
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveControlFrequencyScoreerror = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      })
    }
  }

  //#endregion
  //#region Control total
  iseditControlTotalScoredg: boolean = false;
  controlTotalScoreTags: any;
  beforeControlTotalScoreTags: any;
  controlTotalScoresourcedata: any;
  controlTotalScoresourcedatascore: any;
  controlTotalScoresourcedataoperator: any;
  saveControlTotalScoreerror: string = "";

  getMasterData() {
  }

  processControlTotalScoreMasterData(data: any): void {
    if (data.success == 1) {
      let id = 0;
      if (data.result.recordset.ControlTotalScoreConfig.length > 0) {
        let docs: Array<any> = data.result.recordset.ControlTotalScoreConfig
        if (docs) {
          this.controlTotalScoresourcedata = docs;
          id = 0;
          this.controlTotalScoresourcedatascore = [];
          docs.filter((s: any) => s.IsOperator === false).forEach((doc: any) => {
            id++;
            doc.RowNumber = id.toString();
            this.controlTotalScoresourcedatascore.push(doc);
          });
          id = 0;
          this.controlTotalScoresourcedataoperator = [];
          docs.filter((s: any) => s.IsOperator === true).forEach((doc: any) => {
            id++;
            doc.RowNumber = id.toString();
            this.controlTotalScoresourcedataoperator.push(doc);
          });
        }
      }
    }
    else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  processControlTotalScore(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ControlTotalScore.length > 0) {
        let docs = data.result.recordset.ControlTotalScore[0].ComputationCode.split(',');
        this.controlTotalScoreTags = [];
        let lineitem: any;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            lineitem = { ...this.controlTotalScoresourcedata.find((value: any) => value.ConfigScoreAndRatingID?.toString() == doc) };
            lineitem.RowNumber = id.toString();
            this.controlTotalScoreTags.push(lineitem);
          });
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  addControlTotalScoretagitem(data: any): void {
    if (this.iseditControlTotalScoredg) {
      if (this.controlTotalScoreTags?.length ?? 0 != 0) {
        data.RowNumber = (this.controlTotalScoreTags?.length ?? 0 + 1).toString();
        this.controlTotalScoreTags.push(data);
      }
      else {
        data.RowNumber = (1).toString();
        this.controlTotalScoreTags = [];
        this.controlTotalScoreTags.push(data);
      }
    }
  }

  editControlTotalScoreinitiate(): void {
    this.beforeControlTotalScoreTags = { ...this.controlTotalScoreTags };
    this.iseditControlTotalScoredg = true;
  }

  CancelControlTotalScore() {
    this.controlTotalScoreTags = Object.assign(new Array<any>, this.beforeControlTotalScoreTags);
    this.iseditControlTotalScoredg = false;
    this.saveControlTotalScoreerror = "";
  }

  RemoveControlTotalScoreData(data: any): void {
    let n: number = 0;
    let tempdata: Array<any> = [];
    this.controlTotalScoreTags.forEach((doc: any) => {
      if (doc.RowNumber != data.RowNumber) {
        n += 1;
        doc.RowNumber = n.toString();
        tempdata.push(doc);
      }
    });
    this.controlTotalScoreTags = tempdata;
  }

  saveControlTotalScoreData(): void {
    let computation: string = "";
    let computationCode: string = "";
    this.controlTotalScoreTags.forEach((item: any) => {
      if (item.ConfigField === "Custom Value") {
        computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID + "-" + item.ConfigField;
        computation += " '" + item.Description + "'";
      }
      else {
        computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID;
        computation += " " + item.ConfigField;
      }
    });
    let data: any = {
      "computation": computation,
      "computationCode": computationCode,
      "createdBy": "palani"
    };
    this.controlTotalScoreService.addNew(data).subscribe(res => {
      next:
      if (res.success == 1) {
        this.CancelControlTotalScore();
        this.saveSuccess(res.message);
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveControlAutomationScoreerror = res.error.errorMessage;
      }
      error: (err: any) =>
      console.log("err::", err);
    });
  }
  //#endregion Control total
  //#region Overall control environment
  displayedOverallControlEnvironmentRatingColumns: string[] = ['RowNumber', 'RatingName', 'Computation', 'ColorCode', 'Action', 'Status'];
  dataSourceOverallControlEnvironmentRating!: MatTableDataSource<any>;
  OverallControlEnvironmentRatingForm = new FormGroup({
    txtRateName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    txtcolorcode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtcolorname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtRateId: new FormControl(0)
  });
  iseditOverallControlEnvironmentRatingdg: boolean = false;
  isCustomTextEnabled: boolean = false;
  tagsOverallControlEnvironmentRating: Array<any> = [];
  sourcedataOverallControlEnvironmentRating: Array<any> = [];
  sourcedatascoreOverallControlEnvironmentRating: Array<any> = [];
  sourcedataoperatorOverallControlEnvironmentRating: Array<any> = [];
  beforeOverallControlEnvironmentRatingtags: Array<any> = [];
  OverallControlEnvironmentRatingID: number = 0;
  color: string = '';
  saveOverallControlEnvironmentRatingerror: string = "";
  beforeEditedFormulatext: any;

  getMasterOverallControlEnvironmentRatingData() {
  }

  processMasterOverallControlEnvironmentRatingData(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ControlEnvironmentRatingConfig.length > 0) {
        let docs: Array<any> = data.result.recordset.ControlEnvironmentRatingConfig
        let id = 0;
        if (data.result.recordset.ControlEnvironmentRatingConfig.length > 0) {
          let docs: Array<any> = data.result.recordset.ControlEnvironmentRatingConfig
          if (docs) {
            this.sourcedataOverallControlEnvironmentRating = docs;
            id = 0;
            this.sourcedatascoreOverallControlEnvironmentRating = [];
            docs.filter((s: any) => s.IsOperator === false).forEach((doc: any) => {
              id++;
              doc.RowNumber = id.toString();
              this.sourcedatascoreOverallControlEnvironmentRating.push(doc);
            });
            id = 0;
            this.sourcedataoperatorOverallControlEnvironmentRating = [];
            docs.filter((s: any) => s.IsOperator === true).forEach((doc: any) => {
              id++;
              doc.RowNumber = id.toString();
              this.sourcedataoperatorOverallControlEnvironmentRating.push(doc);
            });
          }
        }
      }
    }
    else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getgridOverallControlEnvironmentRatingdata(): void {
    this.overallControlEnvironmentRatingService.getAll().subscribe(res => {
      next:
      this.processOverallControlEnvironmentRating(res);
    });
  }

  processOverallControlEnvironmentRating(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.OverallControlEnvironmentRating.length > 0) {
        let lineitem: any;
        if (data.result.recordset.OverallControlEnvironmentRating) {
          let id = 0;
          let customText: string;
          let temptext: string;
          let computationarray;
          let docs: Array<any> = data.result.recordset.OverallControlEnvironmentRating;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id.toString();
            computationarray = doc.ComputationCode?.split(',');
            customText = '';
            computationarray?.forEach((item: any) => {
              temptext = item.split('-');
              if (temptext.length > 1) {
                lineitem = { ...this.sourcedataOverallControlEnvironmentRating.find(value => value.ConfigScoreAndRatingID?.toString() == temptext[0]) };
                customText += " '" + temptext[1] + "'";
              }
              else {
                lineitem = { ...this.sourcedataOverallControlEnvironmentRating.find(value => value.ConfigScoreAndRatingID?.toString() == item) };
                customText += " " + lineitem.ConfigDisplay;
              }
            });
            doc.Computationtext = customText;
          });
          this.dataSourceOverallControlEnvironmentRating = new MatTableDataSource(docs);
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  editOverallControlEnvironmentRating(data: any): void {
    this.iseditOverallControlEnvironmentRatingdg = true;
    this.tagsOverallControlEnvironmentRating = [];
    this.beforeEditedFormulatext = data.Computationtext;
    this.OverallControlEnvironmentRatingID = data.OverallControlEnvironmentRatingID;
    let computationarray = data.ComputationCode?.split(',');
    let lineitem: any;
    let id: number = 0;
    computationarray?.forEach((item: any) => {
      id += 1;
      let temptext = item.split('-');
      if (temptext.length > 1) {
        lineitem = { ...this.sourcedataOverallControlEnvironmentRating.find(value => value.ConfigScoreAndRatingID?.toString() == temptext[0]) };
        lineitem.ConfigDisplay = temptext[1];
      }
      else {
        lineitem = { ...this.sourcedataOverallControlEnvironmentRating.find(value => value.ConfigScoreAndRatingID?.toString() == item) };
      }
      lineitem.RowNumber = id;
      this.tagsOverallControlEnvironmentRating.push(lineitem);
    });
    this.color = data.ColorCode;
    this.OverallControlEnvironmentRatingForm.patchValue({ txtRateId: data.OverallControlEnvironmentRatingID, txtcolorcode: data.ColourCode, txtRateName: data.RiskRating, txtcolorname: data.ColourName });
    this.OverallControlEnvironmentRatingForm.disable({ emitEvent: false });
  }

  addOverallControlEnvironmentRatingtagitem(data: any): void {
    if (this.iseditOverallControlEnvironmentRatingdg) {
      data.RowNumber = (this.tagsOverallControlEnvironmentRating.length + 1).toString();
      if (data.ConfigField != "Custom") {
        this.tagsOverallControlEnvironmentRating.push(data);
      }
      else {
        this.isCustomTextEnabled = !this.isCustomTextEnabled;
      }
    }
  }

  CancelCustomtext() {
    this.isCustomTextEnabled = false;
    this.clearMessage();
  }

  addOverallControlEnvironmentRatingCustomText(data: any) {
    let lineitem: any = { ...this.sourcedataOverallControlEnvironmentRating.find(value => value.ConfigField === "Custom") };
    lineitem.ConfigDisplay = data;
    this.tagsOverallControlEnvironmentRating.push(lineitem);
    this.isCustomTextEnabled = false;
  }

  initiateAddOverallControlEnvironmentRating(): void {
    this.tagsOverallControlEnvironmentRating = [];
    this.beforeEditedFormulatext = "";
    this.iseditOverallControlEnvironmentRatingdg = true;
    this.OverallControlEnvironmentRatingForm.reset();
    this.OverallControlEnvironmentRatingID = 0;
    this.isCustomTextEnabled = false;
  }

  editinitiate(): void {
    this.beforeOverallControlEnvironmentRatingtags = { ...this.tagsOverallControlEnvironmentRating };
    this.iseditOverallControlEnvironmentRatingdg = true;
  }

  CancelOverallControlEnvironmentRating() {
    this.tagsOverallControlEnvironmentRating = Object.assign(new Array<any>, this.beforeOverallControlEnvironmentRatingtags);
    this.iseditOverallControlEnvironmentRatingdg = false;
    this.saveOverallControlEnvironmentRatingerror = "";
    this.clearMessage();
  }

  changedOverallControlEnvironmentRating(data: any, event: any): void {
    let obj = {
      "id": data.OverallControlEnvironmentRatingID,
      "isActive": !data.IsActive
    }
    this.overallControlEnvironmentRatingService.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.saveSuccess(res.message);
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveOverallControlEnvironmentRatingerror = res.error.errorMessage;
        event.source.checked = !event.source.checked;
      }
      error: (err: any) =>
      console.log("err::", err);
    });
  }

  RemoveOverallControlEnvironmentRatingData(data: any): void {
    let n: number = 0;
    let tempdata: Array<any> = [];
    this.tagsOverallControlEnvironmentRating.forEach((doc: any) => {
      if (doc.RowNumber != data.RowNumber) {
        n += 1;
        doc.RowNumber = n.toString();
        tempdata.push(doc);
      }
    });
    this.tagsOverallControlEnvironmentRating = tempdata;
  }

  colorchangedOverallControlEnvironmentRating(): void {
    this.OverallControlEnvironmentRatingForm.patchValue({ txtcolorcode: this.color });
  }

  saveOverallControlEnvironmentRatingData(): void {
    let computation: string = "";
    let computationCode: string = "";
    this.tagsOverallControlEnvironmentRating.forEach((item: any) => {
      if (item.ConfigField === "Custom") {
        computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID + "-" + item.ConfigDisplay;
        computation += " '" + item.ConfigDisplay + "'";
      }
      else {
        computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID;
        computation += " " + item.ConfigField;
      }
    });
    if (this.OverallControlEnvironmentRatingForm.get('txtRateId')?.value == null || this.OverallControlEnvironmentRatingForm.get('txtRateId')?.value == 0) {
      const rowValue = (this.OverallControlEnvironmentRatingForm.get('txtRateName')?.value)?.trim()
      this.checkCharLength(rowValue, 'OverallControlEnvironmentRating').then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "riskRating": rowValue,
          "colourName": this.OverallControlEnvironmentRatingForm.get('txtcolorname')?.value,
          "colourCode": this.OverallControlEnvironmentRatingForm.get('txtcolorcode')?.value,
          "computation": computation,
          "computationCode": computationCode,
          "createdBy": "palani"
        }
        this.overallControlEnvironmentRatingService.addNew(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.CancelOverallControlEnvironmentRating();
            this.saveSuccess(res.message);
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveOverallControlEnvironmentRatingerror = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      })
    }
    else {
      const rowValue = (this.OverallControlEnvironmentRatingForm.get('txtRateName')?.value)?.trim()
      this.checkCharLength(rowValue, 'OverallControlEnvironmentRating').then((allowToSave) => {
        if (allowToSave) {
          return;
        }
        let data = {
          "riskRating": (this.OverallControlEnvironmentRatingForm.get('txtRateName')?.value)?.trim(),
          "colourName": this.OverallControlEnvironmentRatingForm.get('txtcolorname')?.value,
          "colourCode": this.OverallControlEnvironmentRatingForm.get('txtcolorcode')?.value,
          "id": this.OverallControlEnvironmentRatingForm.get('txtRateId')?.value,
          "computation": computation,
          "computationCode": computationCode,
          "lastUpdatedBy": "palani"
        }
        this.overallControlEnvironmentRatingService.updateData(data).subscribe(res => {
          next:
          if (res.success == 1) {
            this.CancelOverallControlEnvironmentRating();
            this.saveSuccess(res.message);
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveOverallControlEnvironmentRatingerror = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        });
      });
    }
  }

  //#endregion Overall control environment
  keyPressNumber(event: any) {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async checkCharLength(data: any, type: string): Promise<boolean> {
    if (data.length > 500) {
      this.exceedCharLenErr = 'Length should not exceeds more than 500 characters';
      this.type = type;
      return true;
    } else {
      this.clearMessage();
      return false;
    }
  }

  clearMessage() {
    this.exceedCharLenErr = '';
    this.type = '';
  }

  async checkCharLengthDuplicate(data: any, type: string, allData: any): Promise<boolean> {
    this.duplicate = Object.values(allData)
      ?.filter((ele: any) => !ele.EditMode)
      .some((ele: any) => ele[type]?.trim().toLowerCase() === data.trim().toLowerCase());
    if (data.length > 500) {
      this.exceedCharLenErr = 'Length should not exceeds more than 500 characters';
      this.type = type;
      return true;
    } else if (this.duplicate) {
      this.exceedCharLenErr = 'Record already exists';
      this.type = type;
      return this.duplicate ? this.exceedCharLenErr : false
    } else {
      this.clearMessage();
      return false;
    }
  }

  // Control Type Start
  get ControlTypeRows(): FormArray<FormGroup> {
    return this.GridFormsControlType.get('GridRows') as FormArray<FormGroup>;
  }

  get ControlTypeGrid(): FormArray<FormGroup> {
    return this.GridFormsControlType.get('GridRows') as FormArray<FormGroup>;
  }

  editControlTypeData(form: FormGroup, i: number) {
    this.ControlTypeRows.at(i).get('isEditable')?.setValue(false);
  }

  cancelControlType(form: FormGroup, i: number) {
    this.ControlTypeRows.at(i).get('isEditable')?.setValue(true);
  }

  processControlType(data: any): void {
    if (data?.success === 1) {
      const raw = data?.result?.recordset?.ControlTypes;
      if (Array.isArray(raw) && raw.length > 0) {
        const docs: {
          ControlTypeID: number | null;
          ControlType: string;
          IsActive: boolean;
          RowNumber: number;
        }[] = raw
          .filter((x: any) => x && typeof x === 'object')
          .map((x: any) => ({
            ControlTypeID: x.ControlTypeID != null ? Number(x.ControlTypeID) : null,
            ControlType: (x.ControlType ?? '').toString().trim(),
            IsActive: !!x.IsActive,
            RowNumber: 0
          }))
          .filter(x => x.ControlType.length > 0);

        docs.sort((a, b) => (a.ControlTypeID ?? 0) - (b.ControlTypeID ?? 0));

        let id = 0;
        docs.forEach(d => { d['RowNumber'] = ++id; });

        this.GridFormsControlType = this.fb.group({
          GridRows: this.fb.array(
            docs.map((val: any) => this.fb.group({
              ControlType: new FormControl(val.ControlType, [Validators.required, Validators.maxLength(500)]),
              ControlTypeID: new FormControl(val.ControlTypeID),
              IsActive: new FormControl(val.IsActive),
              RowNumber: new FormControl(val.RowNumber),
              action: new FormControl('existingRecord'),
              isEditable: new FormControl(true),
              isNewRow: new FormControl(false),
            }))
          )
        });

        this.dataSourceControlType = new MatTableDataSource(
          (this.GridFormsControlType.get('GridRows') as FormArray).controls as FormGroup[]
        );

        this.dataSourceControlType.sortingDataAccessor = (row: FormGroup, column: string) => {
          const v = (name: string) => row.get(name)?.value;
          switch (column) {
            case 'Index': return Number(v('RowNumber')) || 0;
            case 'ControlType': return (v('ControlType') || '').toString().toLowerCase();
            case 'ControlTypeID': return Number(v('ControlTypeID')) || 0;
            default: return v(column);
          }
        };

        if (this.ctSort) {
          this.dataSourceControlType.sort = this.ctSort;
          this.ctSort.active = 'ControlTypeID';
          this.ctSort.direction = 'asc';
          this.ctSort.sortChange.emit();
        }
      } else {
        this.GridFormsControlType = this.fb.group({
          GridRows: this.fb.array<FormGroup>([])
        });
        this.dataSourceControlType = new MatTableDataSource<FormGroup>([]);
      }
    } else {
      if (data?.error?.errorCode === 'TOKEN_EXPIRED') {
        this.utils.relogin(this._document);
      } else {
        this.saveControlTypeError = data?.error?.errorMessage || 'Failed to fetch Control Types';
        this.GridFormsControlType = this.fb.group({
          GridRows: this.fb.array<FormGroup>([])
        });
        this.dataSourceControlType = new MatTableDataSource<FormGroup>([]);
      }
    }
  }

  saveEditControlTypeData(form: FormGroup, i: number) {
    const row = this.ControlTypeRows.at(i);

    const payload = {
      controlTypes: [{
        ControlTypeID: row.get('ControlTypeID')?.value,
        ControlType: row.get('ControlType')?.value,
        isActive: row.get('IsActive')?.value ? 1 : 0
      }]
    };

    this.configScoreRatingService.updateControlType(payload).subscribe(res => {
      if (res?.success) {
        row.get('isEditable')?.setValue(true);
        next:
        if (res.success == 1) {
          this.CancelOverallControlEnvironmentRating();
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveOverallControlEnvironmentRatingerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      } else {
        this.saveControlTypeError = "Failed to update Control Type";
      }
    });
  }

  changedControlType(row: FormGroup, event: any, index: number) {
    row.get('IsActive')?.setValue(event.checked);

    const payload = {
      controlTypes: [{
        ControlTypeID: row.get('ControlTypeID')?.value,
        ControlType: row.get('ControlType')?.value,
        isActive: event.checked ? 1 : 0
      }]
    };

    this.configScoreRatingService.updateControlType(payload).subscribe(res => {
      if (res?.success) {
        next:
        if (res.success == 1) {
          this.CancelOverallControlEnvironmentRating();
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveOverallControlEnvironmentRatingerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      } else {
        this.saveControlTypeError = "Failed to update Control Type";
      }
    });
  }

  initiateAddControlType() {
    this.addControlTypeDialog = true;
    this.controlTypeForm.reset({ ControlTypeID: null });
  }

  cancelAddControlType() {
    this.addControlTypeDialog = false;
  }

  saveControlTypeData() {
    const payload = {
      controlTypes: [{
        ControlTypeID: null,
        ControlType: this.controlTypeForm.value.ControlType,
        isActive: 1
      }]
    };

    this.configScoreRatingService.addControlType(payload).subscribe(res => {
      if (res?.success) {
        this.addControlTypeDialog = false;
        next:
        if (res.success == 1) {
          this.CancelOverallControlEnvironmentRating();
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveOverallControlEnvironmentRatingerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);

      } else {
        this.saveControlTypeError = "Failed to save Control Type";
      }
    });
  }
  // Control Type END
}