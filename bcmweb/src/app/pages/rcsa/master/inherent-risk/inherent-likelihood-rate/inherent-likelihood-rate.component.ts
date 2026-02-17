import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InherentLikelihoodRankService } from 'src/app/services/rcsa/master/inherent-risk/inherent-likelihood-rate.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

export interface InherentLikelihoodRate {
  Index: number,
  RatingName: string;
  RatingScore:number;
  StatusName: string;
  StatusID: number;
  InherentLikelihoodRateID: number;
}


@Component({
  selector: 'app-inherent-likelihood-rate',
  templateUrl: './inherent-likelihood-rate.component.html',
  styleUrls: ['./inherent-likelihood-rate.component.scss']
})

export class InherentLikelihoodRateComponent implements OnInit {
  displayedInherentLikelihoodRateColumns: string[] = ['Index', 'RatingName','RatingScore','Action','Status'];
  dataSourceInherentLikelihoodRate!: MatTableDataSource<InherentLikelihoodRate>;
  addInherentLikelihoodRatedg : boolean= false;
  
  inherentLikelihoodRateForm=new FormGroup({
    txtInherentLikelihoodRate: new FormControl('', [Validators.required, Validators.minLength(2)]),
    txtInherentLikelihoodScore: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtInherentLikelihoodRateID: new FormControl(0)
});

 // @ts-ignore
 @ViewChild(MatPaginator) paginator: MatPaginator;
 // @ts-ignore
 @ViewChild(MatSort) sort: MatSort;

  constructor(  
    private service: InherentLikelihoodRankService, 
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document:any) { }

  ngOnInit(): void {
    this.getInherentLikelihoodRate();
  }

  ngAfterViewInit() {
  }

  getInherentLikelihoodRate(): void{
    if (environment.dummyData) {
        let data = {
            "success": 1,
            "message": "Data fetch from DB successful.",
            "result": {
                "InherentLikelihoodRates": [
                    {
                        "RatingName": "Inherent Likelihood1",
                        "StatusName": "Enabled",
                        "RatingScore": "1",
                        "StatusID": "1",
                        "RatingCategoryID": 1
                    },
                    {
                        "RatingName": "Inherent Likelihood2",
                        "StatusName": "Disabled",
                        "RatingScore": "2",
                        "StatusID": "0",
                        "RatingCategoryID": 2
                    }
                ]
            },
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
            "error": {
                "errorCode": null,
                "errorMessage": null
            }
        };
        this.processInherentLikelihoodRate(data);
    } else {
        this.service.getAll().subscribe(res => {
            next:
            this.processInherentLikelihoodRate(res);
        });
    }
}

processInherentLikelihoodRate(data: any): void {
    if (data.success == 1) {
        if (data.result.InherentLikelihoodRates.length > 0) {
            let docs = data.result.InherentLikelihoodRates;
            if (docs) {
                let id = 0;
                docs.forEach((doc: any) => {
                    id++;
                    doc.Index = id;
                })
                this.dataSourceInherentLikelihoodRate = new MatTableDataSource(docs);
                this.dataSourceInherentLikelihoodRate.paginator = this.paginator
                this.dataSourceInherentLikelihoodRate.sort = this.sort
            }
        }
    } else {
        if(data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }
}
initiatAddInherentLikelihoodRate():void{
    this.addInherentLikelihoodRatedg=true;
}

cancelInherentLikelihoodRate():void{
    this.inherentLikelihoodRateForm.reset();
    this.addInherentLikelihoodRatedg=false;
}

saveInherentLikelihoodRate():void{
    this.cancelInherentLikelihoodRate();
    //console.log(this.txtRiskCategoryName.value);
    this.addInherentLikelihoodRatedg=false;
}

editInherentLikelihoodRate(row: any): void {
    this.resetInherentLikelihoodRate();
     this.setInherentLikelihoodRateValue(row);
     this.addInherentLikelihoodRatedg=true;
     console.log("row", row);
 }

setInherentLikelihoodRateValue(data: any):void { 
     this.inherentLikelihoodRateForm.patchValue({ txtInherentLikelihoodRate: data.RatingName, txtInherentLikelihoodScore: data.RatingScore, txtInherentLikelihoodRateID:data.InherentLikelihoodRateID });
   }
resetInherentLikelihoodRate():void{
    this.inherentLikelihoodRateForm.reset();
   }

changedInherentLikelihoodRate(event: MatSlideToggleChange):void{
}
}
