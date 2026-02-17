import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OverAllInherentRiskRatingService } from 'src/app/services/rcsa/master/inherent-risk/over-all-inherent-risk-rating.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

export interface TagDataModel {
  Code: string,
  Description: string;
  RowNumber: string;
  Id?: number;
  IsOperator:boolean;
}



@Component({
  selector: 'app-overall-inherent-risk-rate',
  templateUrl: './overall-inherent-risk-rate.component.html',
  styleUrls: ['./overall-inherent-risk-rate.component.scss']
})
export class OverallInherentRiskRateComponent implements OnInit {

  constructor(private service: OverAllInherentRiskRatingService,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any) { }

  iseditdg: boolean = false;
  txttag = new FormControl('');
  tags: Array<TagDataModel> = [];
  sourcedata: Array<TagDataModel> = [];
  sourcedatascore: Array<TagDataModel> = [];
  sourcedataoperator: Array<TagDataModel> = [];
  beforetags: Array<TagDataModel> = [];
  ngOnInit(): void {

    this.getgriddata();
  }

  
  getgriddata(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ControltotalScores": "8,9,7,9",
          "SourceDatas": [{ "Code": "plus", "Description": "+", "RowNumber": '', "Id": 9, "IsOperator": true },
          { "Code": 'minus', "Description": '-', "RowNumber": '', "Id": 1, "IsOperator": true },
          { "Code": 'division', "Description": '/', "RowNumber": '', "Id": 2, "IsOperator": true },
          { "Code": 'asterisk', "Description": '*', "RowNumber": '', "Id": 3, "IsOperator": true },
          { "Code": 'openparentheses', "Description": '(', "RowNumber": '', "Id": 4, "IsOperator": true },
          { "Code": 'closeparentheses', "Description": ')', "RowNumber": '', "Id": 5, "IsOperator": true },
          { "Code": 'NatureScore', "Description": 'Nature Score', "RowNumber": '', "Id": 6, "IsOperator": false },
          { "Code": 'AutomationScore', "Description": 'Automation Score', "RowNumber": '', "Id": 7, "IsOperator": false },
          { "Code": 'FrequencyScore', "Description": 'Frequency Score', "RowNumber": '', "Id": 8, "IsOperator": false }]
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.process(data);
    } else {
      this.service.getAll().subscribe(res => {
        next:
        this.process(res);
      });
    }
  }

  process(data: any): void {
    if (data.success == 1) {

      if (data.result.SourceDatas.length > 0) {
        let docs: Array<TagDataModel> = data.result.SourceDatas
        let id = 0;
        if (data.result.SourceDatas.length > 0) {
          let docs: Array<TagDataModel> = data.result.SourceDatas
          if (docs) {
            this.sourcedata = docs;
            id = 0;
            docs.filter(s => s.IsOperator === false).forEach((doc: any) => {
              id++;
              doc.RowNumber = id.toString();
              this.sourcedatascore.push(doc);
            });
            id = 0;
            docs.filter(s => s.IsOperator === true).forEach((doc: any) => {
              id++;
              doc.RowNumber = id.toString();
              this.sourcedataoperator.push(doc);
            });
          }
        }
      }
      if (data.result.ControltotalScores) {
        let docs = data.result.ControltotalScores.split(',');
        this.tags = [];
        let lineitem: any;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            lineitem = {...this.sourcedata.find(value => value.Id?.toString() == doc)};
            lineitem.RowNumber = id.toString();
            this.tags.push(lineitem);
          });
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  addtagitem(data: TagDataModel): void {
    if (this.iseditdg) {
      data.RowNumber = (this.tags.length + 1).toString();
      this.tags.push(data);
    }
  }

  editinitiate(): void {
    this.beforetags = {...this.tags};
    this.iseditdg = true;
  }

  Cancel() {
    this.tags=Object.assign(new Array<TagDataModel>, this.beforetags);
    this.iseditdg = false;
  }

  RemoveData(data: TagDataModel): void {
    let n: number = 0;
    let tempdata: Array<TagDataModel> = [];
    this.tags.forEach((doc: any) => {
      if (doc.RowNumber != data.RowNumber) {
        n += 1;
        doc.RowNumber = n.toString();
        tempdata.push(doc);
      }

    });
    this.tags = tempdata;
  }
}
