import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProcessService } from 'src/app/services/rcsa/master/inherent-risk/process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

export interface RateModel {
    Index: number,
    Name: string;
    //   ColourCode: string;
    //   ColourName: string;
    IsActive: boolean;
    ProcessID: number;
}

@Component({
    selector: 'app-inherent-risk-process',
    templateUrl: './process.component.html',
    styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {
    displayedProcessRiskColumns: string[] = ['Index', 'Name', 'Action', 'Status'];
    dataSource = new MatTableDataSource<any>();
    addProcessRiskdg: boolean = false;
    processRiskForm = new FormGroup({
        txtratename: new FormControl('', [Validators.required, Validators.minLength(2)]),
        txtrateid: new FormControl(0)
    });
    gridDataSource: RateModel[] = [];
    GridFormsProcessRisk!: FormGroup;
    isEditableNew: boolean = true;
    saveerror: String = "";
    // @ts-ignore
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ts-ignore
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private service: ProcessService,
        private router: Router,
        public utils: UtilsService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private _formBuilder: FormBuilder,
        @Inject(DOCUMENT) private _document: any
    ) {

    }
    ngAfterViewInit() {
        // if (this.dataSource)
        //     this.dataSource.paginator = this.paginator
    }
    ngOnInit(): void {
        this.GridFormsProcessRisk = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        });
         //this.getProcessRisks();
    }

    pageloadData(): void{
        this.getProcessRisks();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    getProcessRisks(): void {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "recordset": [
                        {
                            "Name": "Low",
                            "IsActive": "1",
                            "ProcessID": 1
                        },
                        {
                            "Name": "Moderate",
                            "IsActive": "0",
                            "ProcessID": 2
                        },
                        {
                            "Name": "High",
                            "IsActive": "0",
                            "ProcessID": 3
                        }
                    ]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            this.processRisk(data);
        } else {
            this.service.getAll().subscribe(res => {
                next:
                this.processRisk(res);
            });
        }
    }

    processRisk(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.length > 0) {
                let docs: RateModel[] = this.gridDataSource = data.result.recordset;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.Index = id;
                    });
                    this.GridFormsProcessRisk = this.fb.group({
                        GridRows: this.fb.array(docs.map(val => this.fb.group({
                            Name: new FormControl(val.Name,[Validators.required]),
                            ProcessID: new FormControl(val.ProcessID),
                            IsActive: new FormControl(val.IsActive),
                            Index: new FormControl(val.Index),
                            action: new FormControl('existingRecord'),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                        })
                        )) //end of fb array
                    }); // end of form group cretation

                    this.dataSource = new MatTableDataSource((
                        this.GridFormsProcessRisk.get('GridRows') as FormArray).controls);
                    this.dataSource.paginator = this.paginator
                    this.dataSource.sort = this.sort

                }
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }
    editData(GridFormElement: any, i: number) {
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
    }

    // On click of correct button in table (after click on edit) this method will call
    saveEditData(GridFormElement: any, i: any) {
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
        console.log(GridFormElement.get('GridRows').at(i).get('Name')?.value);
        console.log(GridFormElement.get('GridRows').at(i).get('ProcessID')?.value);
        let data = {
            "name": GridFormElement.get('GridRows').at(i).get('Name')?.value,
            "createdBy": "palani",
            "id": GridFormElement.get('GridRows').at(i).get('ProcessID')?.value
        }
        this.service.updateData(data).subscribe(res => {
            next:
            if (res.success == 1) {

                this.cancelProcessRisk();
                this.addProcessRiskdg = false;
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveerror = res.error.errorMessage;
            }
            error: (err: any) =>
            console.log("err::", err);
        });
    }

    // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
    CancelSVO(GridFormElement: any, i: any) {
        let obj = this.gridDataSource.find(a => a.ProcessID == GridFormElement.get('GridRows').at(i).get('ProcessID')?.value)
        GridFormElement.get('GridRows').at(i).get('Name').patchValue(obj?.Name);
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
    }

    initiatAddProcessRisk(): void {
        this.addProcessRiskdg = true;
    }

    cancelProcessRisk(): void {
        this.processRiskForm.patchValue({ txtratename: '' });
        this.addProcessRiskdg = false;
        this.saveerror = "";
    }

    saveData(): void {

        if (this.processRiskForm.get('txtrateid')?.value == 0) {
            console.log(this.processRiskForm.get('txtrateid')?.value);
            let data = { "name": this.processRiskForm.get('txtratename')?.value, "createdBy": "palani" }
            this.service.addNew(data).subscribe(res => {
                next:
                if (res.success == 1) {

                    this.cancelProcessRisk();
                    this.addProcessRiskdg = false;
                    this.saveSuccess(res.message);
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveerror = res.error.errorMessage;
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
                this.getProcessRisks();
            }, timeout)
        });
    }

    editProcessRisk(row: any): void {
        this.resetProcessRisk();
        this.setProcessRiskValue(row);
        this.addProcessRiskdg = true;
        console.log("row", row);
    }

    setProcessRiskValue(data: any): void {
        this.processRiskForm.patchValue({ txtratename: data.Name, txtrateid: data.ProcessID });
    }
    resetProcessRisk(): void {
        this.processRiskForm.reset();
    }

    changed(data: any): void {
        let obj = {
            // "id": data.ProcessRiskID,
            // "isActive": !data.IsActive
            "id": data.get('ProcessID')?.value,
            "isActive": !data.get('IsActive')?.value
        }
        this.service.updateStatus(obj).subscribe(res => {
            next:
            if (res.success == 1) {
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveerror = res.error.errorMessage;
            }
            error: (err: any) =>
            console.log("err::", err);
        });
        console.log(obj);
    }

}