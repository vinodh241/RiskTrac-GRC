import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { InherentRiskService } from 'src/app/services/rcsa/inherent-risk/inherent-risk.service';
import { ControlAutomationScoreService } from 'src/app/services/rcsa/master/control-environment/control-automation-score.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { NewInherentRiskComponent } from 'src/app/pages/rcsa/inherent-risk/new-inherent-risk/new-inherent-risk.component';
import { TableUtil } from "./tableUtil";
import { FileUploader } from 'ng2-file-upload';
import * as XLSX from 'xlsx';
import { keys } from 'highcharts';
import { fileNamePattern } from 'src/app/core-shared/commonFunctions';

export interface DataModel {
    RowNumber?: number,
    SLNO: string;
    GroupID: number;
    GroupName: string;
    UnitID: number;
    UnitName: string;
    ProcessID: number;
    ProcessName: string;
    RiskCategoryID: number;
    RiskCategoryName: string;
    Risk: string;
    InherentLikelihoodID: number;
    InherentLikelihoodName: string;
    InherentRiskRatingID: number;
    InherentRiskRatingName: string;
    InherentImpactRatingID: number;
    InherentImpactRatingName: string;
    OverallInherentRisk: string;
    OverallInherentName: string;
    IsActive: boolean;
}

@Component({
    selector: 'app-inherent-risk',
    templateUrl: './inherent-risk.component.html',
    styleUrls: ['./inherent-risk.component.scss']
})
export class InherentRiskComponent implements OnInit {

    displayedColumns: string[] = ['RowNumber', 'SLNO', 'Group', 'Unit', 'Process', 'RiskCategory', 'Risk', 'InherentLikelihood', 'InherentImpactRating', 'OverallInherentName', 'Action', 'Status'];
    dataSource!: MatTableDataSource<DataModel>;
    saveerror: string = "";
    exportActive: boolean = false;
    excelData: any;
    matColumns: string[] = ["RowNumber", "Process"];
    showexportData: boolean = false;
    isStandardUser:boolean=false;
    // @ts-ignore
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ts-ignore
    @ViewChild(MatSort) sort: MatSort;
    // @ts-ignore
    @ViewChild('TABLE', { static: true }) table: ElementRef;

    filenameWithoutExtension: any[] = [];
    invalidfile: boolean = false;
    bulkInherentRiskData: FormData = new FormData();
    ExcelValidExtension: Array<string> = ['xlsx'];
    selectedExcelJson: any[] = [];
    excelValidHeaders = ["#", "Group *", "Auditable Unit*", "Risk Category*", "Process", "Risk*", "Inherent Likelihood Rating*", "Inherent Impact Rating*"];
    fileName: string =  ''
    validFileNameErr: boolean = false;
    disableToggle:number = 0;
    importButtonFlag:boolean = false
    
    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });

    constructor(private service: InherentRiskService,
        public utils: UtilsService,
        public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any
    ) { }

    ngOnInit(): void {
        this.getgriddata();
        this.isStandardUser=this.utils.isStandardUser();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.showexportData = this.dataSource.filteredData.length > 0 ? true : false;
    }

    exportAsXLSX() {
        let obj: any = [];
        if (this.dataSource.filteredData.length > 0) {
            this.dataSource.filteredData.forEach((m: any) => {
                obj.push({
                    SLNO: m.SLNO,
                    Group: m.GroupName,
                    Unit: m.UnitName,
                    Process: m.ProcessName,
                    "Risk Category": m.RiskCategoryName,
                    Risk: m.Risk,
                    "Likelihood Rating": m.InherentLikelihoodName,
                    "Impact Rating": m.InherentImpactRatingName,
                    "Overall Inherent Risk Rating": m.OverallInherentName,
                    "Status":m.IsActive?"Active":"Inactive"
                });
            });
            TableUtil.exportArrayToExcel(obj, "Inherent_Risk");
        }
    }

    getgriddata(): void {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "recordset": [
                        {
                            "SLNO": "FA-12",
                            "GroupID": 1,
                            "GroupName": "Group 1",
                            "UnitID": 1,
                            "UnitName": "Unit 1",
                            "ProcessID": 1,
                            "ProcessName": "Process 1",
                            "RiskCategoryID": 1,
                            "RiskCategoryName": "RiskCategory 1",
                            "Risk": "Automation",
                            "InherentLikelihoodID": 1,
                            "InherentLikelihoodName": "InherentLikelihoodName",
                            "InherentImpactRatingID": 1,
                            "InherentImpactRatingName": "InherentImpactRatingName",
                            "OverallInherentName": "InherentImpactRatingName",
                            "OverallInherentRisk": "OverallInherentRisk",
                            "IsActive": true,
                            "InherentRisksID": 1
                        },
                        {
                            "SLNO": "FA-13",
                            "GroupID": 1,
                            "GroupName": "Group 1",
                            "UnitID": 1,
                            "UnitName": "Unit 1",
                            "ProcessID": 1,
                            "ProcessName": "Process 1",
                            "RiskCategoryID": 1,
                            "RiskCategoryName": "RiskCategory 1",
                            "Risk": "Automation",
                            "InherentLikelihoodID": 1,
                            "InherentLikelihoodName": "InherentLikelihoodName",
                            "InherentImpactRatingID": 1,
                            "InherentImpactRatingName": "InherentImpactRatingName",
                            "InherentRiskRatingID": 1,
                            "InherentRiskRatingName": "InherentImpactRatingName",
                            "OverallInherentRisk": "OverallInherentRisk",
                            "IsActive": true,
                            "InherentRisksID": 1
                        },
                        {
                            "SLNO": "FA-14",
                            "GroupID": 1,
                            "GroupName": "Group 1",
                            "UnitID": 1,
                            "UnitName": "Unit 1",
                            "ProcessID": 1,
                            "ProcessName": "Process 1",
                            "RiskCategoryID": 1,
                            "RiskCategoryName": "RiskCategory 1",
                            "Risk": "Automation",
                            "InherentLikelihoodID": 1,
                            "InherentLikelihoodName": "InherentLikelihoodName",
                            "InherentRiskRatingID": 1,
                            "InherentRiskRatingName": "InherentImpactRatingName",
                            "InherentImpactRatingID": 1,
                            "InherentImpactRatingName": "InherentImpactRatingName",
                            "OverallInherentRisk": "OverallInherentRisk",
                            "IsActive": true,
                            "InherentRisksID": 1
                        },
                        {
                            "SLNO": "FA-15",
                            "GroupID": 1,
                            "GroupName": "Group 1",
                            "UnitID": 1,
                            "UnitName": "Unit 1",
                            "ProcessID": 1,
                            "ProcessName": "Process 1",
                            "RiskCategoryID": 1,
                            "RiskCategoryName": "RiskCategory 1",
                            "Risk": "Automation",
                            "InherentLikelihoodID": 1,
                            "InherentLikelihoodName": "InherentLikelihoodName",
                            "InherentRiskRatingID": 1,
                            "InherentRiskRatingName": "InherentImpactRatingName",
                            "InherentImpactRatingID": 1,
                            "InherentImpactRatingName": "InherentImpactRatingName",
                            "OverallInherentRisk": "OverallInherentRisk",
                            "IsActive": true,
                            "InherentRisksID": 1
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
            if (data.result.recordset.length > 0) {
                let docs = data.result.recordset;
                this.excelData = docs;
                if (docs && docs[0].SLNO!=undefined) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.RowNumber = id;
                    })
                    this.dataSource = new MatTableDataSource(docs);
                    this.dataSource.paginator = this.paginator
                    this.dataSource.sort = this.sort
                    this.showexportData = this.dataSource.filteredData.length > 0 ? true : false;
                    this.disableToggle  = this.dataSource.filteredData.filter((ob:any) => ob.IsActive == 1)?.length

                }
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    initiateAdd(): void {
        const assesment = this.dialog.open(NewInherentRiskComponent, {
            disableClose: true,
            width: "120vh",
            minHeight: "80vh",
            data: {
                "mode": "add"
            }
        })
        assesment.afterClosed().subscribe(result => {
            if(result)
                this.getgriddata();
        })
        //this.adddg = true;
    }

    editData(data: any): void {
        if (this.canFullAccess()) {
            data.mode = "edit";
            const assesment = this.dialog.open(NewInherentRiskComponent, {
                disableClose: true,
                width: "120vh",
                minHeight: "80vh",
                data: data
            })
            assesment.afterClosed().subscribe(result => {
                if(result)
                    this.getgriddata();
            })
        }
    }

    changed(data: any): void {
        console.log('✌️data --->', data);
        if(this.canFullAccess()){
            let obj = {
                "id": data.InherentRisksID,
                "isActive": !data.IsActive
            }
            this.service.updateStatus(obj).subscribe(res => {
                next:

                if (res.success == 1) {
                    this.changeDetectorRefs.detectChanges();
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
                this.getgriddata();
            }, timeout)
        });
    }

    canFullAccess(): boolean {
        let result = false;
        result = ((this.utils.isFunctionalAdmin() || this.utils.isPowerUser()) && this.utils.isRiskManagementUnit());
        return result;
    }

    seletedFileDetails(event: any) {
        this.importButtonFlag = true;
        const fileInput = event.target;
        if (this.uploader.queue.length > 1) {
            console.log('this.uploader.queue.length: '+this.uploader.queue)
            let latestFile = this.uploader.queue[this.uploader.queue.length - 1]
            this.uploader.queue = [];
            this.uploader.queue.push(latestFile);
        }
        this.invalidfile = false;
        for (let j = 0; j < this.uploader.queue.length; j++) {
            let fileItem: File = this.uploader.queue[j]._file;
            this.fileName = fileItem.name;
            this.filenameWithoutExtension = this.fileName.split('.').slice();
            let extension = this.fileName.split('.').pop() as string;
            if (this.ExcelValidExtension.includes(extension.toLowerCase())) {
                this.invalidfile = false;
                const reader: FileReader = new FileReader();
                reader.readAsBinaryString(fileItem);
                reader.onload = (e: any) => {
                /* create workbook */
                const binarystr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

                /* selected the first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                /* save data */
                const data = XLSX.utils.sheet_to_json(ws, {defval : null}); // to get 2d array pass 2nd parameter as object {header: 1}
                console.log("data",data); // Data will be logged in array format containing objects
                this.selectedExcelJson = JSON.parse(JSON.stringify(data)) || [];

                let isValidHeaders = false, isElementsValid = true;
                this.selectedExcelJson.forEach((excelJson)=>{
                    let list = [...Object.keys(excelJson).map((ele: any) => ele.trim())]
                    list.forEach(header => {
                        if (this.excelValidHeaders.includes(header)) {
                            isValidHeaders = true;
                        }
                        if(header.includes('*') && !excelJson[header].trim()){
                            isElementsValid = false;
                        }
                    });
                    if(isValidHeaders && isElementsValid) {
                        console.log('isElementsValid: ', isElementsValid);
                        console.log('isValidHeaders: ', isValidHeaders);
                        this.importButtonFlag = true;
                        console.log("insdie if")
                        this.bulkInherentRiskData = new FormData;
                        this.bulkInherentRiskData.append('InherentRiskData', JSON.stringify(data));
                        this.bulkInherentRiskData.append('fileName', JSON.stringify(this.fileName));
                    } else {
                        this.popupInfoError("Unsuccessful", "Please select a valid template file with all mandatory parameters.")
                    }
                    console.log(isValidHeaders,"invalid", isElementsValid);
                })

              fileInput.value = '';
              this.uploader.clearQueue();
            };
            } else {
                this.invalidfile = true;
                this.popupInfoError("Unsuccessful", "InValid File Type")
            }
            if (fileNamePattern(this.fileName)) {
                this.validFileNameErr = true;
                this.popupInfoError("Unsuccessful","Special Characters are not allowed in File name")
            }else {
                this.validFileNameErr = false;
            }
        }
    }




    bulkUploadExcelFile() {
        if(this.filenameWithoutExtension.length > 0) {
            this.service.bulkUploadInherentRisk(this.bulkInherentRiskData).subscribe(res => {
                next:
                localStorage.setItem('token', res.token);
                if (res.success == 1) {

                    this.popupInfo("Success", res.message)
                    this.importButtonFlag = false
                    setTimeout(() => {
                        this.getgriddata();
                    }, 2000);
                    this.filenameWithoutExtension = [];
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfoError("Unsuccessful", res.error.errorMessage)
                }
            });
            this.bulkInherentRiskData = new FormData;
        }
    }

    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: message
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
            }, timeout)
        });
    }

    popupInfoError(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: message
            }
        });

        confirm.afterOpened().subscribe(result => {
            this.fileName = ''
            this.importButtonFlag = false;
            setTimeout(() => {
                confirm.close();
            }, timeout)
        });
    }


    downloadSampleFile() {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = "assets/SampleTemplate/RCSA_Template.xlsx";
        link.download = 'RCSA_Template.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }


}
