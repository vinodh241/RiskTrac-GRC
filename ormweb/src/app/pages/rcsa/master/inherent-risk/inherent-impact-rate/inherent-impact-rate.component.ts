import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InherentImpactRateService } from 'src/app/services/rcsa/master/inherent-risk/inherent-impact-rate.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { FormGroup, Validators,FormControl} from '@angular/forms';
import { RiskCategory } from '../risk-category/risk-category.component';


export interface InherentImpactRate {
  Index: number,
  RatingName: string;
  RatingScore:number;
  StatusName: string;
  StatusID: number;
  InherentImpactRateID: number;
}

@Component({
  selector: 'app-inherent-impact-rate',
  templateUrl: './inherent-impact-rate.component.html',
  styleUrls: ['./inherent-impact-rate.component.scss']
})
export class InherentImpactRateComponent implements OnInit {

  displayedInherentImpactRateColumns: string[] = ['Index', 'RatingName','RatingScore','Action', 'Status'];
  addInherentImpactRatedg : boolean= false;
  inherentImpactRateForm=new FormGroup({
    txtInherentImpactRate: new FormControl('', [Validators.required, Validators.minLength(2)]),
    txtInherentImpactScore: new FormControl('', [Validators.required, Validators.minLength(1)]),
    txtInherentImpactRateID: new FormControl(0)
});
dataSourceInherentImpactRate!: MatTableDataSource<InherentImpactRate>;
 // @ts-ignore
 @ViewChild(MatPaginator) paginator: MatPaginator;
 // @ts-ignore
 @ViewChild(MatSort) sort: MatSort;

  constructor( private service: InherentImpactRateService, 
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document:any
) { }

  ngOnInit(): void {
    this.getInherentImpactRate();
  }

  
  getInherentImpactRate(): void{
    if (environment.dummyData) {
        let data = {
            "success": 1,
            "message": "Data fetch from DB successful.",
            "result": {
                "InherentImpactRates": [
                    {
                        "RatingName": "Inherent Impact1",
                        "StatusID": "1",
                        "StatusName": "Enabled",
                        "RatingScore": "1",
                        "RatingCategoryID": 1
                    },
                    {
                        "RatingName": "Inherent Impact2",
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
        this.processInherentImpactRate(data);
    } else {
        this.service.getAll().subscribe(res => {
            next:
            this.processInherentImpactRate(res);
        });
    }
}

processInherentImpactRate(data: any): void {
    if (data.success == 1) {
        if (data.result.InherentImpactRates.length > 0) {
            let docs = data.result.InherentImpactRates;
            if (docs) {
                let id = 0;
                docs.forEach((doc: any) => {
                    id++;
                    doc.Index = id;
                })
                this.dataSourceInherentImpactRate = new MatTableDataSource(docs);
                this.dataSourceInherentImpactRate.paginator = this.paginator
                this.dataSourceInherentImpactRate.sort = this.sort
            }
        }
    } else {
        if(data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }
}

initiatAddInherentImpactRate():void{
    this.addInherentImpactRatedg=true;
}

cancelInherentImpactRate():void{
    this.resetIngerentImpactRate();
    this.addInherentImpactRatedg=false;
}

resetIngerentImpactRate():void{
    this.inherentImpactRateForm.reset();
}

saveInherentImpactRate():void{
    //console.log(this.riskCategoryForm.get('txtRiskCategoryName').value );
    this.cancelInherentImpactRate();
    this.addInherentImpactRatedg=false;
}

editInherentImpactRate(row: any): void {
   this.resetIngerentImpactRate();
    this.setInherentImpactRateValue(row);
    this.addInherentImpactRatedg=true;
    console.log("row", row);
}

setInherentImpactRateValue(data: any):void { 
    this.inherentImpactRateForm.patchValue({ txtInherentImpactRate: data.RatingName, txtInherentImpactScore: data.RatingScore,txtInherentImpactRateID:data.InherentImpactRateID });
  }

changedInherentImpactRate(InherentImpactRateId: any):void{
}

}
