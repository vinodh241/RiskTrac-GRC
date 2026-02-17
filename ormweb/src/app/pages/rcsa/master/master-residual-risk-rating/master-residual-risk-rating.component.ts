import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { OverallResidualRiskRatingService } from 'src/app/services/rcsa/master/residual-risk-rating/overall-residual-risk-rating.service';
import { ResidualRiskService } from 'src/app/services/rcsa/master/residual-risk-rating/residual-risk.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-master-residual-risk-rating',
  templateUrl: './master-residual-risk-rating.component.html',
  styleUrls: ['./master-residual-risk-rating.component.scss']
})
export class MasterResidualRiskRatingComponent implements OnInit {
  color: string = 'primary';
  displayedResidualRiskColumns: string[] = ['Index', 'Risk', 'ColourName',  'IsActive']; // 'Action',
  addResidualRiskdg: boolean = false;
  ResidualRiskForm = new FormGroup({
    txtratename: new FormControl('', [Validators.required, Validators.minLength(2)]),
    txtcolorcode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtcolorname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtrateid: new FormControl(0)
  });
  dataSourceResidualRisk!: MatTableDataSource<any>;
  saveResidualRiskerror: string = "";

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(private residualRiskService: ResidualRiskService,
    private configScoreRatingService: ConfigScoreRatingService,
    private overallResidualRiskRatingService: OverallResidualRiskRatingService,
    public utils: UtilsService,
    private router: Router,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any
  ) { }


  ngOnInit(): void {
    this.getPageLoadData();
  }

  getPageLoadData(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": {
            "ResidualRisk": [
              {
                "Risk": "Low Risk",
                "IsActive": "1",
                "ColorName": "Green",
                "ColorCode": "#00f322",
                "ResidualRiskID": 1
              },
              {
                "Risk": "Moderate Risk",
                "ColorName": "Yellow",
                "ColorCode": "#fbfa3f",
                "IsActive": "0",
                "ResidualRiskID": 2
              },
              {
                "Risk": "High Risk",
                "ColorName": "Red",
                "ColorCode": "#df0909",
                "IsActive": "0",
                "ResidualRiskID": 3
              }
            ],
            "ResidualRiskRating": [
              {
                "OverallInherentRiskRatingID": 1,
                "OverallInherentRiskRatingName": "Low Risk",
                "OverallControlEnvironmentRatingID": 1,
                "OverallControlEnvironmentRatingName": "Effective",
                "ResidualRiskID": 1,
                "ResidualRiskName": "Low Risk",
                "ResidualRiskRatingID": 1,
                "IsActive": true,
              },
              {
                "OverallInherentRiskRatingID": 1,
                "OverallInherentRiskRatingName": "Low Risk",
                "OverallControlEnvironmentRatingID": 2,
                "OverallControlEnvironmentRatingName": "Partially Effective",
                "ResidualRiskID": 1,
                "ResidualRiskName": "Low Risk",
                "ResidualRiskRatingID": 2,
                "IsActive": true,
              },
              {
                "OverallInherentRiskRatingID": 1,
                "OverallInherentRiskRatingName": "Low Risk",
                "OverallControlEnvironmentRatingID": 3,
                "OverallControlEnvironmentRatingName": "In Effective",
                "ResidualRiskID": 1,
                "ResidualRiskName": "Low Risk",
                "ResidualRiskRatingID": 3,
                "IsActive": true,
              },
              {
                "OverallInherentRiskRatingID": 2,
                "OverallInherentRiskRatingName": "Moderate Risk",
                "OverallControlEnvironmentRatingID": 1,
                "OverallControlEnvironmentRatingName": "Effective",
                "ResidualRiskID": 1,
                "ResidualRiskName": "Low Risk",
                "ResidualRiskRatingID": 4,
                "IsActive": true,
              }
            ],
            "InherentRiskRating": [
              {
                "RiskRating": "Low Risk",
                "OverallInherentRiskRatingID": 1,
                "ColourCode": "",
                "IsActive": true
              }, {
                "RiskRating": "Moderate Risk",
                "OverallInherentRiskRatingID": 2,
                "ColourCode": "",
                "IsActive": true
              }, {
                "RiskRating": "High Risk",
                "OverallInherentRiskRatingID": 3,
                "ColourCode": "",
                "IsActive": true
              }
            ],
            "ControlEnvironmentRating": [
              {
                "RiskRating": "Low Risk",
                "OverallControlEnvironmentRatingID": 1,
                "ColourCode": "",
                "IsActive": true
              }, {
                "RiskRating": "Moderate Risk",
                "OverallControlEnvironmentRatingID": 2,
                "ColourCode": "",
                "IsActive": true
              }, {
                "RiskRating": "High Risk",
                "OverallControlEnvironmentRatingID": 3,
                "ColourCode": "",
                "IsActive": true
              }
            ]
          }
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processResidualRisk(data);
      this.processResidualRiskDL(data);
      this.processcontrolenvironmentrisk(data);
      this.processInherentRisk(data);
      this.processOverallInherentRiskRating(data);
    } else {
      this.configScoreRatingService.getMasterResidualRiskScreen().subscribe(data => {
        next: {
          if (data.success == 1) {
            this.processResidualRisk(data);
            this.processResidualRiskDL(data);
            this.processcontrolenvironmentrisk(data);
            this.processInherentRisk(data);
            this.processOverallInherentRiskRating(data);
          } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
          }
        }
      });
    }
  }
  //#region ResidualRisk
  getgriddata(): void {

    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": [
            {
              "Risk": "Low Risk",
              "IsActive": "1",
              "ColorName": "Green",
              "ColorCode": "#00f322",
              "ResidualRiskID": 1
            },
            {
              "Risk": "Moderate Risk",
              "ColorName": "Yellow",
              "ColorCode": "#fbfa3f",
              "IsActive": "0",
              "ResidualRiskID": 2
            },
            {
              "Risk": "High Risk",
              "ColorName": "Red",
              "ColorCode": "#df0909",
              "IsActive": "0",
              "ResidualRiskID": 3
            }
          ]
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processResidualRisk(data);
    } else {
      this.residualRiskService.getAll().subscribe(res => {
        next:
        this.processResidualRisk(res);
      });
    }
  }

  processResidualRisk(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ResidualRisk.length > 0) {
        let docs = data.result.recordset.ResidualRisk;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.Index = id;
          })
          this.dataSourceResidualRisk = new MatTableDataSource(docs);
          this.dataSourceResidualRisk.sort = this.sort
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  colorchangedResidualRisk(): void {
    this.ResidualRiskForm.patchValue({ txtcolorcode: this.color });
  }

  initiateAddResidualRisk(): void {
    this.color = "#ff0000";
    this.addResidualRiskdg = true;
  }

  editResidualRisk(row: any): void {
    this.resetForm();
    this.setValue(row);
    this.addResidualRiskdg = true;
  }

  cancelResidualRiskForm(): void {
    this.resetForm();
    this.addResidualRiskdg = false;
    this.saveResidualRiskerror = "";
  }

  resetForm(): void {
    this.ResidualRiskForm.reset();
  }
  setValue(data: any): void {
    this.color = data.ColourCode;
    this.ResidualRiskForm.patchValue({ txtratename: data.Risk, txtcolorcode: data.ColourCode, txtcolorname: data.ColourName, txtrateid: data.ResidualRiskID });
  }

  changedResidualRisk(data: any, event: any): void {
    let obj = {
      "id": data.ResidualRiskID,
      "isActive": !data.IsActive
    }
    this.residualRiskService.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.saveSuccess(res.message);
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveResidualRiskerror = res.error.errorMessage;
        event.source.checked = !event.source.checked;
      }
      error: (err: any) =>
      console.log("err::", err);
    });
    console.log(obj);
  }


  saveResidualRisk(): void {

    if (this.ResidualRiskForm.get('txtrateid')?.value == 0 || this.ResidualRiskForm.get('txtrateid')?.value == null) {
      let data = {
        "risk": this.ResidualRiskForm.get('txtratename')?.value,
        "colourCode": this.ResidualRiskForm.get('txtcolorcode')?.value,
        "colourName": this.ResidualRiskForm.get('txtcolorname')?.value,
        "createdBy": "palani"
      }
      this.residualRiskService.addNew(data).subscribe(res => {
        next:
        if (res.success == 1) {

          this.cancelResidualRiskForm();
          this.addResidualRiskdg = false;
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveResidualRiskerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    }
    else {
      let data = {
        "risk": this.ResidualRiskForm.get('txtratename')?.value,
        "colourCode": this.ResidualRiskForm.get('txtcolorcode')?.value,
        "colourName": this.ResidualRiskForm.get('txtcolorname')?.value,
        "id": this.ResidualRiskForm.get('txtrateid')?.value,
        "createdBy": "palani"
      }
      this.residualRiskService.updateData(data).subscribe(res => {
        next:
        if (res.success == 1) {

          this.cancelResidualRiskForm();
          this.addResidualRiskdg = false;
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveResidualRiskerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    }

  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
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

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.saveResidualRiskerror = this.saveOverallRiskRatingerror = "";
        this.getPageLoadData();
      }, timeout)
    });
  }
  //#endregion ResidualRisk

  //#region OverallRiskRating
  displayedOverallRiskRatingColumns: string[] = ['Index', 'OverallInherentRiskRatingName', 'OverallControlEnvironmentRatingName', 'ResidualRiskName', 'Action', 'IsActive'];
  addOverallRiskRatingdg: boolean = false;
  OverallRiskRatingForm = new FormGroup({
    ddlInherentRisk: new FormControl(null, [Validators.required]),
    ddlControlEnvironment: new FormControl(null, [Validators.required]),
    ddlResidualRisk: new FormControl(null, [Validators.required]),
    txtRateId: new FormControl("")
  });
  dataSourceOverallRiskRating!: MatTableDataSource<any>;
  residualRiskds: Array<any> = [];
  controlEnvironmentds: Array<any> = [];
  inherentRiskds: Array<any> = [];
  saveOverallRiskRatingerror: string = "";


  getresidualrisk(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": [
            {
              "Risk": "Low Risk",
              "ResidualRiskID": 1,
              "ColourCode": "",
              "IsActive": true
            }, {
              "Risk": "Moderate Risk",
              "ResidualRiskID": 2,
              "ColourCode": "",
              "IsActive": true
            }, {
              "Risk": "High Risk",
              "ResidualRiskID": 3,
              "ColourCode": "",
              "IsActive": true
            }
          ]
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processResidualRiskDL(data);
    } else {
      this.residualRiskService.getActive().subscribe(res => {
        next:
        this.processResidualRiskDL(res);
      });
    }
  }
  processResidualRiskDL(data: any): void {
    if (data.success == 1) {
      this.residualRiskds = [];
      if (data.result.recordset.ResidualRisk.length > 0) {
        data.result.recordset.ResidualRisk.filter((s: any) => s.IsActive === true).forEach((doc: any) => {
          this.residualRiskds.push(doc);
        });
        //this.residualRiskds = { ...data.result.recordset.ResidualRisk.filter(s => s.IsActive === true) };
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getcontrolenvironmentrisk(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": [
            {
              "RiskRating": "Low Risk",
              "OverallControlEnvironmentRatingID": 1,
              "ColourCode": "",
              "IsActive": true
            }, {
              "RiskRating": "Moderate Risk",
              "OverallControlEnvironmentRatingID": 2,
              "ColourCode": "",
              "IsActive": true
            }, {
              "RiskRating": "High Risk",
              "OverallControlEnvironmentRatingID": 3,
              "ColourCode": "",
              "IsActive": true
            }
          ]
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processcontrolenvironmentrisk(data);
    } else {
      // this.overallControlEnvironmentRatingService.getActive().subscribe(res => {
      //     next:
      //     this.processcontrolenvironmentrisk(res);
      // });
    }
  }
  processcontrolenvironmentrisk(data: any): void {
    if (data.success == 1) {
      this.controlEnvironmentds = [];
      if (data.result.recordset.ControlEnvironmentRating.length > 0) {
        this.controlEnvironmentds = data.result.recordset.ControlEnvironmentRating;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
    //this.getresidualrisk();
  }
  getinherentrisk(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": [
            {
              "RiskRating": "Low Risk",
              "OverallInherentRiskRatingID": 1,
              "ColourCode": "",
              "IsActive": true
            }, {
              "RiskRating": "Moderate Risk",
              "OverallInherentRiskRatingID": 2,
              "ColourCode": "",
              "IsActive": true
            }, {
              "RiskRating": "High Risk",
              "OverallInherentRiskRatingID": 3,
              "ColourCode": "",
              "IsActive": true
            }
          ]
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processInherentRisk(data);
    } else {
      // this.overAllInherentRiskService.getActive().subscribe(res => {
      //     next:
      //     this.processInherentRisk(res);
      // });
    }
  }
  processInherentRisk(data: any): void {
    if (data.success == 1) {
      this.inherentRiskds = [];
      if (data.result.recordset.InherentRiskRating.length > 0) {
        this.inherentRiskds = data.result.recordset.InherentRiskRating;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getgridOverallInherentRiskRatingdata(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ControlAutomationScores": [
            {
              "OverallInherentRiskRatingID": 1,
              "OverallInherentRiskRatingName": "Low Risk",
              "OverallControlEnvironmentRatingID": 1,
              "OverallControlEnvironmentRatingName": "Effective",
              "ResidualRiskID": 1,
              "ResidualRiskName": "Low Risk",
              "ResidualRiskRatingID": 1,
              "IsActive": true,
            },
            {
              "OverallInherentRiskRatingID": 1,
              "OverallInherentRiskRatingName": "Low Risk",
              "OverallControlEnvironmentRatingID": 2,
              "OverallControlEnvironmentRatingName": "Partially Effective",
              "ResidualRiskID": 1,
              "ResidualRiskName": "Low Risk",
              "ResidualRiskRatingID": 2,
              "IsActive": true,
            },
            {
              "OverallInherentRiskRatingID": 1,
              "OverallInherentRiskRatingName": "Low Risk",
              "OverallControlEnvironmentRatingID": 3,
              "OverallControlEnvironmentRatingName": "In Effective",
              "ResidualRiskID": 1,
              "ResidualRiskName": "Low Risk",
              "ResidualRiskRatingID": 3,
              "IsActive": true,
            },
            {
              "OverallInherentRiskRatingID": 2,
              "OverallInherentRiskRatingName": "Moderate Risk",
              "OverallControlEnvironmentRatingID": 1,
              "OverallControlEnvironmentRatingName": "Effective",
              "ResidualRiskID": 1,
              "ResidualRiskName": "Low Risk",
              "ResidualRiskRatingID": 4,
              "IsActive": true,
            }
          ]
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processOverallInherentRiskRating(data);
    } else {
      this.overallResidualRiskRatingService.getAll().subscribe(res => {
        next:
        this.processOverallInherentRiskRating(res);
      });
    }
  }

  processOverallInherentRiskRating(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ResidualRiskRating.length > 0) {
        let docs = data.result.recordset.ResidualRiskRating;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.Index = id;
          })
          this.dataSourceOverallRiskRating = new MatTableDataSource(docs);

          this.dataSourceOverallRiskRating.sort = this.sort
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  initiateAddOverallRiskRating(): void {
    this.addOverallRiskRatingdg = true;
  }


  editOverallRiskRating(row: any): void {
    this.resetOverallRiskRatingForm();
    this.setOverallRiskRatingValue(row);
    this.addOverallRiskRatingdg = true;
  }

  cancelOverallRiskRatingForm(): void {
    this.resetOverallRiskRatingForm();
    this.addOverallRiskRatingdg = false;
    this.saveOverallRiskRatingerror = "";
  }

  resetOverallRiskRatingForm(): void {
    this.OverallRiskRatingForm.reset();
  }
  setOverallRiskRatingValue(data: any): void {
    this.OverallRiskRatingForm.patchValue({
      ddlInherentRisk: data.OverallInherentRiskRatingID, ddlControlEnvironment: data.OverallControlEnvironmentRatingID, ddlResidualRisk: data.ResidualRiskID, txtRateId: data.ResidualRiskRatingID
    });
  }

  changedOverallRiskRating(data: any, event: any): void {
    let obj = {
      "id": data.ResidualRiskRatingID,
      "isActive": !data.IsActive
    }
    this.overallResidualRiskRatingService.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.saveSuccess(res.message);
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveOverallRiskRatingerror = res.error.errorMessage;
        event.source.checked = !event.source.checked;
      }
      error: (err: any) =>
      console.log("err::", err);
    });
    console.log(obj);
  }


  saveOverallRiskRating(): void {

    if (this.OverallRiskRatingForm.get('txtRateId')?.value == null || this.OverallRiskRatingForm.get('txtRateId')?.value == '0' || this.OverallRiskRatingForm.get('txtRateId')?.value == '') {
      let data = {
        "overallInherentRiskRatingID": this.OverallRiskRatingForm.get('ddlInherentRisk')?.value,
        "overallControlEnvironmentRatingID": this.OverallRiskRatingForm.get('ddlControlEnvironment')?.value,
        "residualRiskID": this.OverallRiskRatingForm.get('ddlResidualRisk')?.value,
        "createdBy": "palani"
      }
      this.overallResidualRiskRatingService.addNew(data).subscribe(res => {
        next:
        if (res.success == 1) {

          this.cancelOverallRiskRatingForm();
          this.addOverallRiskRatingdg = false;
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveOverallRiskRatingerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    }
    else {
      let data = {
        "overallInherentRiskRatingID": this.OverallRiskRatingForm.get('ddlInherentRisk')?.value,
        "overallControlEnvironmentRatingID": this.OverallRiskRatingForm.get('ddlControlEnvironment')?.value,
        "residualRiskID": this.OverallRiskRatingForm.get('ddlResidualRisk')?.value,
        "id": this.OverallRiskRatingForm.get('txtRateId')?.value,
        "createdBy": "palani"
      }
      this.overallResidualRiskRatingService.updateData(data).subscribe(res => {
        next:
        if (res.success == 1) {

          this.cancelOverallRiskRatingForm();
          this.addOverallRiskRatingdg = false;
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveOverallRiskRatingerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    }

  }
  //#endregion OverallRiskRating

}
