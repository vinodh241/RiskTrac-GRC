import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ControlNatureScoreService } from 'src/app/services/rcsa/master/control-environment/control-nature-score.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { FormGroup, Validators,FormControl} from '@angular/forms';

export interface RateModel {
  Index: number,
  RatingName: string;
  RatingScore:number;
  StatusName: string;
  StatusID: number;
  RateID: number;
}

@Component({
  selector: 'app-control-nature-score',
  templateUrl: './control-nature-score.component.html',
  styleUrls: ['./control-nature-score.component.scss']
})
export class ControlNatureScoreComponent implements OnInit {

  displayedColumns: string[] = ['Index', 'RatingName','RatingScore','Action', 'Status'];
  adddg : boolean= false;
  masterForm=new FormGroup({
      txtratename: new FormControl('', [Validators.required, Validators.minLength(2)]),
      txtratescore: new FormControl('', [Validators.required, Validators.minLength(1)]),
      txtrateid: new FormControl(0)
});
dataSource!: MatTableDataSource<RateModel>;
// @ts-ignore
@ViewChild(MatPaginator) paginator: MatPaginator;
// @ts-ignore
@ViewChild(MatSort) sort: MatSort;

 constructor( private service: ControlNatureScoreService, 
   public utils: UtilsService,
   @Inject(DOCUMENT) private _document:any
) { }

 ngOnInit(): void {
   this.getgriddata();
 }

 
 getgriddata(): void{
   if (environment.dummyData) {
       let data = {
           "success": 1,
           "message": "Data fetch from DB successful.",
           "result": {
               "ControlNatureScores": [
                   {
                       "RatingName": "NA(Not Available)",
                       "StatusID": "1",
                       "StatusName": "Enabled",
                       "RatingScore": "1",
                       "RateID": 1
                   },
                   {
                       "RatingName": "Corrective",
                       "StatusName": "Disabled",
                       "RatingScore": "2",
                       "StatusID": "0",
                       "RateID": 2
                   },
                   {
                       "RatingName": "Detective",
                       "StatusName": "Disabled",
                       "RatingScore": "2",
                       "StatusID": "0",
                       "RateID": 3
                   },
                   {
                       "RatingName": "Preventive",
                       "StatusName": "Disabled",
                       "RatingScore": "2",
                       "StatusID": "0",
                       "RateID": 4
                   }
               ]
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
       if (data.result.ControlNatureScores.length > 0) {
           let docs = data.result.ControlNatureScores;
           if (docs) {
               let id = 0;

               docs.forEach((doc: any) => {
                   id++;
                   doc.Index = id;
               })
               this.dataSource = new MatTableDataSource(docs);
               this.dataSource.paginator = this.paginator
               this.dataSource.sort = this.sort
           }
       }
   } else {
       if(data.error.errorCode == "TOKEN_EXPIRED")
           this.utils.relogin(this._document);
   }
}

initiateAdd():void{
   this.adddg=true;
}


save():void{
   //console.log(this.riskCategoryForm.get('txtRiskCategoryName').value );
   this.cancelForm();
   this.adddg=false;
}

edit(row: any): void {
    this.resetForm();
    this.setValue(row);
    this.adddg=true;
    console.log("row", row);
}

cancelForm():void{
    this.resetForm();
    this.adddg=false;
 }
 
 resetForm():void{
    this.masterForm.reset();
 }
setValue(data: any):void { 
    this.masterForm.patchValue({ txtratename: data.RatingName, txtratescore: data.RatingScore,txtrateid:data.RateID });
 }

changed(InherentImpactRateId: any):void{
}

}