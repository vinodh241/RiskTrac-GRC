import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RiskCategoryService } from 'src/app/services/rcsa/master/inherent-risk/risk-category.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

export interface RiskCategory {
    Index: number,
    RatingName: string;
    StatusName: string;
    StatusID: number;
    RatingCategoryID: number;
}

@Component({
    selector: 'app-riskcategory-masters',
    templateUrl: './risk-category.component.html',
    styleUrls: ['./risk-category.component.scss']
})



export class RiskCategoryComponent implements OnInit {
    displayedRiskCategoryColumns: string[] = ['Index', 'RatingName', 'Action', 'Status'];
    dataSourceRiskCategory!: MatTableDataSource<RiskCategory>;
    addRiskCategorydg: boolean = false;
    riskCategoryForm = new FormGroup({
        txtRiskCategoryName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        txtRiskCategoryID: new FormControl(0)
    });

    // @ts-ignore
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ts-ignore
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private service: RiskCategoryService,
        private router: Router,
        public utils: UtilsService,
        public dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any
    ) {

    }
    ngAfterViewInit() {
        // if (this.dataSource)
        //     this.dataSource.paginator = this.paginator
    }
    ngOnInit(): void {
        this.getRiskCategories();
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceRiskCategory.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceRiskCategory.paginator) {
            this.dataSourceRiskCategory.paginator.firstPage();
        }
    }
    getRiskCategories(): void {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "RiskCategories": [
                        {
                            "RatingName": "Rate Name1",
                            "StatusName": "Enabled",
                            "StatusID": "1",
                            "RatingCategoryID": 1
                        },
                        {
                            "RatingName": "Rate Name2",
                            "StatusName": "Disabled",
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
            this.processRiskCategory(data);
        } else {
            this.service.getAll().subscribe(res => {
                next:
                this.processRiskCategory(res);
            });
        }
    }

    processRiskCategory(data: any): void {
        if (data.success == 1) {
            if (data.result.RiskCategories.length > 0) {
                let docs = data.result.RiskCategories;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.Index = id;
                    })
                    this.dataSourceRiskCategory = new MatTableDataSource(docs);
                    this.dataSourceRiskCategory.paginator = this.paginator
                    this.dataSourceRiskCategory.sort = this.sort
                }
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    initiatAddRiskCategory(): void {
        this.addRiskCategorydg = true;
    }

    cancelRiskCategory(): void {
        this.riskCategoryForm.reset();
        this.addRiskCategorydg = false;
    }

    saveRiskCategory(): void {
        this.cancelRiskCategory();
        this.addRiskCategorydg = false;
    }

    editRiskCategory(row: any): void {
        this.resetRiskCategory();
        this.setRiskCategoryValue(row);
        this.addRiskCategorydg = true;
    }

    setRiskCategoryValue(data: any): void {
        this.riskCategoryForm.patchValue({ txtRiskCategoryName: data.RatingName, txtRiskCategoryID: data.RatingCategoryID });
    }
    resetRiskCategory(): void {
        this.riskCategoryForm.reset();
    }

    changedRiskCategoryStatus(RiskCategoryId: any): void {

    }

}