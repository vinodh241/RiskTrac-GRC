import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/rcsa/inherent-risk/group.service';
import { InherentRiskService } from 'src/app/services/rcsa/inherent-risk/inherent-risk.service';
import { UnitService } from 'src/app/services/rcsa/inherent-risk/unit.service';
import { OverAllInherentRiskRatingService } from 'src/app/services/rcsa/master/inherent-risk/over-all-inherent-risk-rating.service';
import { ProcessService } from 'src/app/services/rcsa/master/inherent-risk/process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { RiskCategoryService } from 'src/app/services/rcsa/master/inherent-risk/risk-category.service';
import { InherentLikelihoodRankService } from 'src/app/services/rcsa/master/inherent-risk/inherent-likelihood-rate.service';
import { InherentImpactRateService } from 'src/app/services/rcsa/master/inherent-risk/inherent-impact-rate.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';

@Component({
  selector: 'app-new-inherent-risk',
  templateUrl: './new-inherent-risk.component.html',
  styleUrls: ['./new-inherent-risk.component.scss']
})
export class NewInherentRiskComponent implements OnInit {
  copy: any;
  groupDS: any;
  unitDS: any;
  unitsDS: any;
  processDS: any;
  riskCategoryDS: any;
  inherentLikelihoodDS: any;
  inherentImpactRatingDS: any;
  inherentRiskRatingDS: any;

  saveerror: string = "";
  masterForm = new FormGroup({
    ddlGroup: new FormControl(null, [Validators.required]),
    ddlUnit: new FormControl(null, [Validators.required]),
    ddlProcess: new FormControl(null),
    ddlRiskCategory: new FormControl(null, [Validators.required]),
    ddlInherentLikelihood: new FormControl(null, [Validators.required]),
    ddlInherentImpactRating: new FormControl(null, [Validators.required]),
    txtRisk: new FormControl('', [Validators.required]),
    txtRateId: new FormControl('')
  });
  constructor(
    private service: InherentRiskService,
    private configScoreRatingService: ConfigScoreRatingService,
    private groupService: GroupService,
    private unitService: UnitService,
    private processService: ProcessService,
    private riskCategoryService: RiskCategoryService,
    private inherentLikelihoodRankService: InherentLikelihoodRankService,
    private inherentImpactRateService: InherentImpactRateService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewInherentRiskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any

  ) {
    if (data) {
      this.copy = JSON.parse(JSON.stringify(data));
    }
  }

  ngOnInit(): void {
    // this.getActiveGroup();
    // this.getActiveProcess();
    // this.getActiveRiskCategory();
    // this.getActiveInherentLikelihoodRating();
    // this.getActiveInherentImpactRating();
    this.getPageLoadData();
  }

  getPageLoadData(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": {
            "Group": [
              {
                "GroupID": 1,
                "Name": "Management",
                "Abbreviation": "MMG",
                "Description": "Management",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 2,
                "Name": "Retail",
                "Abbreviation": "RTG",
                "Description": "Retail",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 3,
                "Name": "Corporate",
                "Abbreviation": "CRG",
                "Description": "Corporate",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 4,
                "Name": "Operations & Shared Services",
                "Abbreviation": "OSG",
                "Description": "Operations & Shared Services",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 5,
                "Name": "Finance",
                "Abbreviation": "FIG",
                "Description": "Finance",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 6,
                "Name": "Risk & Credit",
                "Abbreviation": "RCG",
                "Description": "Risk & Credit",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 7,
                "Name": "HR & Admin",
                "Abbreviation": "HRG",
                "Description": "HR & Admin",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 8,
                "Name": "Legal & Governance",
                "Abbreviation": "LGG",
                "Description": "Legal & Governance",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 9,
                "Name": "Strategy & Marketing",
                "Abbreviation": "SMG",
                "Description": "Strategy & Marketing",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              },
              {
                "GroupID": 10,
                "Name": "Audit",
                "Abbreviation": "AUG",
                "Description": "Audit",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              }
            ],
            "Unit": [
              {
                "UnitID": 3,
                "GroupID": 3,
                "Name": "Corporate Business",
                "Abbreviation": "CB",
                "Description": "Corporate Business",
                "IsModuleOwner": false,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-14T11:25:55.170Z",
                "CreatedBy": "BASE SCRIPT",
                "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
                "LastUpdatedBy": "BASE SCRIPT"
              }
            ],
            "Process": [
              {
                "ProcessID": 2,
                "Name": "Process 2 Update",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-13T09:26:21.377Z",
                "CreatedBy": "456",
                "LastUpdatedDate": "2022-12-13T09:28:44.620Z",
                "LastUpdatedBy": "456"
              }
            ],
            "RiskCategory": [
              {
                "RiskCategoryID": 2,
                "Category": "Category 21",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T17:57:28.963Z",
                "CreatedBy": "sangeetha",
                "LastUpdatedDate": "2022-12-12T01:16:55.957Z",
                "LastUpdatedBy": ""
              },
              {
                "RiskCategoryID": 3,
                "Category": "Financial",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-26T21:04:27.687Z",
                "CreatedBy": "vamshii",
                "LastUpdatedDate": "2022-11-26T21:04:27.687Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 5,
                "Category": "Risk 3",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:51:14.827Z",
                "CreatedBy": "Sangeetha",
                "LastUpdatedDate": "2022-12-09T10:51:14.827Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 6,
                "Category": "test1",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:57:32.267Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:57:32.267Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 7,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:21.357Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:21.357Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 8,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:22.760Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:22.760Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 9,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:23.450Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:23.450Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 10,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:24.027Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:24.027Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 11,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:24.637Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:24.637Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 12,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:25.293Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:25.293Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 13,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:25.887Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:25.887Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 14,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:26.793Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:26.793Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 15,
                "Category": "wew",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:58:27.997Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:58:27.997Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 16,
                "Category": "ef",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T10:59:01.043Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T10:59:01.043Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 17,
                "Category": "RiskCat1",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T23:39:53.503Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-09T23:39:53.503Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 18,
                "Category": "test10",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-10T13:53:20.170Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-10T13:53:20.170Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 19,
                "Category": "Risk test",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T11:01:58.840Z",
                "CreatedBy": "",
                "LastUpdatedDate": "2022-12-12T11:01:58.840Z",
                "LastUpdatedBy": null
              },
              {
                "RiskCategoryID": 20,
                "Category": "Risk Update test",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-12T11:02:44.587Z",
                "CreatedBy": "456",
                "LastUpdatedDate": "2022-12-12T11:05:26.700Z",
                "LastUpdatedBy": "456"
              }
            ],
            "InherentLikelihood": [
              {
                "InherentLikelihoodRatingID": 3,
                "Rating": "Likely",
                "Score": 3,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-24T11:21:57.783Z",
                "CreatedBy": "Babu",
                "LastUpdatedDate": "2022-11-24T11:21:57.783Z",
                "LastUpdatedBy": "Babu"
              },
              {
                "InherentLikelihoodRatingID": 4,
                "Rating": "Very Likely",
                "Score": 4,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-24T11:21:57.783Z",
                "CreatedBy": "Babu",
                "LastUpdatedDate": "2022-11-24T11:21:57.783Z",
                "LastUpdatedBy": "Babu"
              },
              {
                "InherentLikelihoodRatingID": 5,
                "Rating": "Expected1",
                "Score": 5,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-24T11:21:57.783Z",
                "CreatedBy": "Babu",
                "LastUpdatedDate": "2022-12-09T23:56:02.353Z",
                "LastUpdatedBy": ""
              },
              {
                "InherentLikelihoodRatingID": 6,
                "Rating": "TestRating20Upda",
                "Score": 20,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-26T21:34:33.220Z",
                "CreatedBy": "Kumar",
                "LastUpdatedDate": "2022-12-09T23:54:38.277Z",
                "LastUpdatedBy": ""
              },
              {
                "InherentLikelihoodRatingID": 7,
                "Rating": "test10",
                "Score": 12,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-10T13:53:46.007Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-10T13:53:46.007Z",
                "LastUpdatedBy": null
              }
            ],
            "InherentImpactRating": [
              {
                "InherentImpactRatingID": 1,
                "Rating": "Catastrophical",
                "Score": 1,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:19:06.323Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-12-11T23:52:00.257Z",
                "LastUpdatedBy": ""
              },
              {
                "InherentImpactRatingID": 2,
                "Rating": "Minor",
                "Score": 2,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:19:27.110Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-11-20T20:19:27.110Z",
                "LastUpdatedBy": null
              },
              {
                "InherentImpactRatingID": 3,
                "Rating": "Moderate",
                "Score": 3,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:19:40.710Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-11-20T22:54:55.007Z",
                "LastUpdatedBy": "venu"
              },
              {
                "InherentImpactRatingID": 4,
                "Rating": "Major",
                "Score": 4,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:19:52.727Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-11-20T20:30:14.247Z",
                "LastUpdatedBy": "vamshi"
              },
              {
                "InherentImpactRatingID": 5,
                "Rating": "Catastrophical",
                "Score": 5,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:20:17.827Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-11-20T20:29:28.667Z",
                "LastUpdatedBy": "vamshi"
              },
              {
                "InherentImpactRatingID": 6,
                "Rating": "Catastrophical+1",
                "Score": 5,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-26T21:41:16.603Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-11-26T21:41:16.603Z",
                "LastUpdatedBy": null
              },
              {
                "InherentImpactRatingID": 7,
                "Rating": "Test",
                "Score": 1,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T23:57:18.800Z",
                "CreatedBy": "",
                "LastUpdatedDate": "2022-12-10T00:07:16.627Z",
                "LastUpdatedBy": ""
              },
              {
                "InherentImpactRatingID": 8,
                "Rating": "",
                "Score": 0,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-10T00:03:21.023Z",
                "CreatedBy": "",
                "LastUpdatedDate": "2022-12-10T00:03:21.023Z",
                "LastUpdatedBy": null
              },
              {
                "InherentImpactRatingID": 9,
                "Rating": "123",
                "Score": 3,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-10T00:07:42.143Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-10T00:07:42.143Z",
                "LastUpdatedBy": null
              }
            ],
            "InherentRiskInfo": [
              {
                "InherentImpactRatingID": 1,
                "Rating": "Insignificant",
                "Score": 1,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:19:06.323Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-12-20T12:07:37.600Z",
                "LastUpdatedBy": "456"
              },
              {
                "InherentImpactRatingID": 2,
                "Rating": "Minor",
                "Score": 2,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:19:27.110Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-12-17T02:25:25.993Z",
                "LastUpdatedBy": ""
              },
              {
                "InherentImpactRatingID": 3,
                "Rating": "Moderate",
                "Score": 3,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:19:40.710Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-11-20T22:54:55.007Z",
                "LastUpdatedBy": "venu"
              },
              {
                "InherentImpactRatingID": 4,
                "Rating": "Major",
                "Score": 4,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-20T20:19:52.727Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-11-20T20:30:14.247Z",
                "LastUpdatedBy": "vamshi"
              },
              {
                "InherentImpactRatingID": 6,
                "Rating": "Catastrophical",
                "Score": 5,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-11-26T21:41:16.603Z",
                "CreatedBy": "vamshi",
                "LastUpdatedDate": "2022-12-17T20:38:34.453Z",
                "LastUpdatedBy": ""
              },
              {
                "InherentImpactRatingID": 7,
                "Rating": "Test",
                "Score": 1,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-09T23:57:18.800Z",
                "CreatedBy": "",
                "LastUpdatedDate": "2022-12-10T00:07:16.627Z",
                "LastUpdatedBy": ""
              },
              {
                "InherentImpactRatingID": 9,
                "Rating": "1233",
                "Score": 33,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-10T00:07:42.143Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-17T02:09:40.877Z",
                "LastUpdatedBy": ""
              },
              {
                "InherentImpactRatingID": 10,
                "Rating": "Insignificant",
                "Score": 1,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-17T01:56:09.047Z",
                "CreatedBy": "palani",
                "LastUpdatedDate": "2022-12-17T01:56:09.047Z",
                "LastUpdatedBy": null
              },
              {
                "InherentImpactRatingID": 11,
                "Rating": "!@!@#",
                "Score": -1,
                "IsActive": true,
                "IsDeleted": false,
                "CreatedDate": "2022-12-19T14:47:16.420Z",
                "CreatedBy": "456",
                "LastUpdatedDate": "2022-12-21T01:29:12.500Z",
                "LastUpdatedBy": "456"
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
      this.processGroup(data);
      this.processUnits(data);
      this.processProcessData(data);
      this.processRiskCategory(data);
      this.processInherentLikelihoodRating(data);
      this.processInherentImpactRating(data);


    } else {
      let obj = {};
      this.configScoreRatingService.getInherentRiskScreen(obj).subscribe(data => {
        next: {

          this.processGroup(data);
          this.processUnits(data);
          this.processProcessData(data);
          this.processRiskCategory(data);
          this.processInherentLikelihoodRating(data);
          this.processInherentImpactRating(data);
          if (this.copy.mode == "edit") {

            this.processUnit(data,false);
            this.setEditData();
          }
        }
      });
    }
  }
  ngAfterViewInit(): void {

  }

  groupOnChange(data: any) {
    this.getActiveUnit(this.masterForm.get('ddlGroup')?.value ?? 0, 0);
    this.masterForm.patchValue({
      ddlUnit: null
    });
  }

  getActiveGroup(): void {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Group fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "GroupID": 1,
              "Name": "Management",
              "Abbreviation": "MMG",
              "Description": "Management",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 2,
              "Name": "Retail",
              "Abbreviation": "RTG",
              "Description": "Retail",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 3,
              "Name": "Corporate",
              "Abbreviation": "CRG",
              "Description": "Corporate",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 4,
              "Name": "Operations & Shared Services",
              "Abbreviation": "OSG",
              "Description": "Operations & Shared Services",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 5,
              "Name": "Finance",
              "Abbreviation": "FIG",
              "Description": "Finance",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 6,
              "Name": "Risk & Credit",
              "Abbreviation": "RCG",
              "Description": "Risk & Credit",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 7,
              "Name": "HR & Admin",
              "Abbreviation": "HRG",
              "Description": "HR & Admin",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 8,
              "Name": "Legal & Governance",
              "Abbreviation": "LGG",
              "Description": "Legal & Governance",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 9,
              "Name": "Strategy & Marketing",
              "Abbreviation": "SMG",
              "Description": "Strategy & Marketing",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "GroupID": 10,
              "Name": "Audit",
              "Abbreviation": "AUG",
              "Description": "Audit",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Group fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processGroup(data);
    } else {
      this.groupService.getActive().subscribe(res => {
        next:
        this.processGroup(res);
      });
    }
  }

  processUnits(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.Unit.length > 0) {
        this.unitsDS = data.result.recordset.Unit;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  processGroup(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.Group.length > 0) {
        this.groupDS = data.result.recordset.Group;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getActiveUnit(id: number, defaultId: number): void {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Unit fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "UnitID": 3,
              "GroupID": 3,
              "Name": "Corporate Business",
              "Abbreviation": "CB",
              "Description": "Corporate Business",
              "IsModuleOwner": false,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-14T11:25:55.170Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2022-11-14T11:25:55.170Z",
              "LastUpdatedBy": "BASE SCRIPT"
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Unit fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processUnit(data,false);
    } else {
      let obj = { "groupID": id };

      // this.unitService.getActiveByGroupId(obj).subscribe(res => {
      //   next:        
      let uData = this.unitsDS.filter((s: any) => s.GroupID === id);
      this.processUnit(uData, true);
      if (defaultId > 0) {
        this.masterForm.patchValue({
          ddlUnit: this.copy.UnitID
        });
      }
      // });
    }
  }


  processUnit(data: any, isdropdownChanged: any): void {    
    if (this.copy.mode == "edit") {
      if (isdropdownChanged) {
        this.unitDS = data;
      }
      else {
        if (data.success == 1) {
          if (data.result.recordset.Unit.length > 0) {
            this.unitDS = data.result.recordset.Unit;
            let uData = this.unitsDS.filter((s: any) => s.GroupID === this.copy.GroupID);
            if (uData.length > 0)
              this.unitDS = uData;
          }
        } else {
          if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
        }
      }
    }
    else
      this.unitDS = data;
  }

  getActiveProcess(): void {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Process fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "ProcessID": 2,
              "Name": "Process 2 Update",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-13T09:26:21.377Z",
              "CreatedBy": "456",
              "LastUpdatedDate": "2022-12-13T09:28:44.620Z",
              "LastUpdatedBy": "456"
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Process fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processProcessData(data);
    } else {
      this.processService.getActive().subscribe(res => {
        next:
        this.processProcessData(res);
      });
    }

  }
  processProcessData(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.Process.length > 0) {
        this.processDS = data.result.recordset.Process;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getActiveRiskCategory(): void {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Risk Category fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "RiskCategoryID": 2,
              "Category": "Category 21",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-20T17:57:28.963Z",
              "CreatedBy": "sangeetha",
              "LastUpdatedDate": "2022-12-12T01:16:55.957Z",
              "LastUpdatedBy": ""
            },
            {
              "RiskCategoryID": 3,
              "Category": "Financial",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-26T21:04:27.687Z",
              "CreatedBy": "vamshii",
              "LastUpdatedDate": "2022-11-26T21:04:27.687Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 5,
              "Category": "Risk 3",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:51:14.827Z",
              "CreatedBy": "Sangeetha",
              "LastUpdatedDate": "2022-12-09T10:51:14.827Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 6,
              "Category": "test1",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:57:32.267Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:57:32.267Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 7,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:21.357Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:21.357Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 8,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:22.760Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:22.760Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 9,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:23.450Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:23.450Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 10,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:24.027Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:24.027Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 11,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:24.637Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:24.637Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 12,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:25.293Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:25.293Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 13,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:25.887Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:25.887Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 14,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:26.793Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:26.793Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 15,
              "Category": "wew",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:58:27.997Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:58:27.997Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 16,
              "Category": "ef",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T10:59:01.043Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T10:59:01.043Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 17,
              "Category": "RiskCat1",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T23:39:53.503Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-09T23:39:53.503Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 18,
              "Category": "test10",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-10T13:53:20.170Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-10T13:53:20.170Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 19,
              "Category": "Risk test",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T11:01:58.840Z",
              "CreatedBy": "",
              "LastUpdatedDate": "2022-12-12T11:01:58.840Z",
              "LastUpdatedBy": null
            },
            {
              "RiskCategoryID": 20,
              "Category": "Risk Update test",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-12T11:02:44.587Z",
              "CreatedBy": "456",
              "LastUpdatedDate": "2022-12-12T11:05:26.700Z",
              "LastUpdatedBy": "456"
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Risk Category fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processRiskCategory(data);
    } else {
      this.riskCategoryService.getActive().subscribe(res => {
        next:
        this.processRiskCategory(res);
      });
    }
  }
  processRiskCategory(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.RiskCategory.length > 0) {
        this.riskCategoryDS = data.result.recordset.RiskCategory;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getActiveInherentLikelihoodRating(): void {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Inherent Likelihood Rating fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "InherentLikelihoodRatingID": 3,
              "Rating": "Likely",
              "Score": 3,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-24T11:21:57.783Z",
              "CreatedBy": "Babu",
              "LastUpdatedDate": "2022-11-24T11:21:57.783Z",
              "LastUpdatedBy": "Babu"
            },
            {
              "InherentLikelihoodRatingID": 4,
              "Rating": "Very Likely",
              "Score": 4,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-24T11:21:57.783Z",
              "CreatedBy": "Babu",
              "LastUpdatedDate": "2022-11-24T11:21:57.783Z",
              "LastUpdatedBy": "Babu"
            },
            {
              "InherentLikelihoodRatingID": 5,
              "Rating": "Expected1",
              "Score": 5,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-24T11:21:57.783Z",
              "CreatedBy": "Babu",
              "LastUpdatedDate": "2022-12-09T23:56:02.353Z",
              "LastUpdatedBy": ""
            },
            {
              "InherentLikelihoodRatingID": 6,
              "Rating": "TestRating20Upda",
              "Score": 20,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-26T21:34:33.220Z",
              "CreatedBy": "Kumar",
              "LastUpdatedDate": "2022-12-09T23:54:38.277Z",
              "LastUpdatedBy": ""
            },
            {
              "InherentLikelihoodRatingID": 7,
              "Rating": "test10",
              "Score": 12,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-10T13:53:46.007Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-10T13:53:46.007Z",
              "LastUpdatedBy": null
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Inherent Likelihood Rating fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processInherentLikelihoodRating(data);
    } else {
      this.inherentLikelihoodRankService.getActive().subscribe(res => {
        next:
        this.processInherentLikelihoodRating(res);
      });
    }
  }
  processInherentLikelihoodRating(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.InherentLikelihood.length > 0) {
        this.inherentLikelihoodDS = data.result.recordset.InherentLikelihood;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getActiveInherentImpactRating(): void {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Inherent Impact Rating fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "InherentImpactRatingID": 1,
              "Rating": "Catastrophical",
              "Score": 1,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-20T20:19:06.323Z",
              "CreatedBy": "vamshi",
              "LastUpdatedDate": "2022-12-11T23:52:00.257Z",
              "LastUpdatedBy": ""
            },
            {
              "InherentImpactRatingID": 2,
              "Rating": "Minor",
              "Score": 2,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-20T20:19:27.110Z",
              "CreatedBy": "vamshi",
              "LastUpdatedDate": "2022-11-20T20:19:27.110Z",
              "LastUpdatedBy": null
            },
            {
              "InherentImpactRatingID": 3,
              "Rating": "Moderate",
              "Score": 3,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-20T20:19:40.710Z",
              "CreatedBy": "vamshi",
              "LastUpdatedDate": "2022-11-20T22:54:55.007Z",
              "LastUpdatedBy": "venu"
            },
            {
              "InherentImpactRatingID": 4,
              "Rating": "Major",
              "Score": 4,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-20T20:19:52.727Z",
              "CreatedBy": "vamshi",
              "LastUpdatedDate": "2022-11-20T20:30:14.247Z",
              "LastUpdatedBy": "vamshi"
            },
            {
              "InherentImpactRatingID": 5,
              "Rating": "Catastrophical",
              "Score": 5,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-20T20:20:17.827Z",
              "CreatedBy": "vamshi",
              "LastUpdatedDate": "2022-11-20T20:29:28.667Z",
              "LastUpdatedBy": "vamshi"
            },
            {
              "InherentImpactRatingID": 6,
              "Rating": "Catastrophical+1",
              "Score": 5,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-11-26T21:41:16.603Z",
              "CreatedBy": "vamshi",
              "LastUpdatedDate": "2022-11-26T21:41:16.603Z",
              "LastUpdatedBy": null
            },
            {
              "InherentImpactRatingID": 7,
              "Rating": "Test",
              "Score": 1,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-09T23:57:18.800Z",
              "CreatedBy": "",
              "LastUpdatedDate": "2022-12-10T00:07:16.627Z",
              "LastUpdatedBy": ""
            },
            {
              "InherentImpactRatingID": 8,
              "Rating": "",
              "Score": 0,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-10T00:03:21.023Z",
              "CreatedBy": "",
              "LastUpdatedDate": "2022-12-10T00:03:21.023Z",
              "LastUpdatedBy": null
            },
            {
              "InherentImpactRatingID": 9,
              "Rating": "123",
              "Score": 3,
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2022-12-10T00:07:42.143Z",
              "CreatedBy": "palani",
              "LastUpdatedDate": "2022-12-10T00:07:42.143Z",
              "LastUpdatedBy": null
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Inherent Impact Rating fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processInherentImpactRating(data);
    } else {
      this.inherentImpactRateService.getActive().subscribe(res => {
        next:
        this.processInherentImpactRating(res);
      });
    }
  }
  processInherentImpactRating(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.InherentImpactRating.length > 0) {
        this.inherentImpactRatingDS = data.result.recordset.InherentImpactRating;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  setEditData(): void {
    this.masterForm.patchValue({
      ddlGroup: this.copy.GroupID,
      ddlUnit: this.copy.UnitID,
      ddlProcess: this.copy.ProcessID,
      ddlRiskCategory: this.copy.RiskCategoryID,
      ddlInherentLikelihood: this.copy.InherentLikelihoodID,
      ddlInherentImpactRating: this.copy.InherentImpactRatingID,
      txtRisk: this.copy.Risk,
      txtRateId: this.copy.InherentRisksID,
    });
    //this.getActiveUnit(this.copy.GroupID, this.copy.UnitID);
  }
  validateSave(): void {
    let obj: any = {

      "unitID": this.masterForm.get('ddlUnit')?.value,
      "processID": this.masterForm.get('ddlProcess')?.value,
      "riskCategoryID": this.masterForm.get('ddlRiskCategory')?.value,
      "inherentLikelihoodID": this.masterForm.get('ddlInherentLikelihood')?.value,
      "inherentImpactRatingID": this.masterForm.get('ddlInherentImpactRating')?.value,
      "risk": this.masterForm.get('txtRisk')?.value
    };
    if (this.masterForm.get('txtRateId')?.value == "" || this.masterForm.get('txtRateId')?.value == null) {
      this.service.addNew(obj).subscribe(res => {
        next:
        if (res.success == 1) {
          this.dialogRef.close(true);
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveerror = res.error.errorMessage;
        }
        error:
        console.log("err::", "error");
      });
    }
    else {
      obj.id = this.masterForm.get('txtRateId')?.value;
      this.service.updateData(obj).subscribe(res => {
        next:
        if (res.success == 1) {
          this.dialogRef.close(true);
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveerror = res.error.errorMessage;
        }
        error:
        console.log("err::", "error");
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
      }, timeout)
    });
  }

}
