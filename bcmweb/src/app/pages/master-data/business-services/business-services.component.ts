import { Component, Inject, OnInit } from '@angular/core';
import { MasterBusinessServiceService } from 'src/app/services/master-data/master-business-service/master-business-service.service';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewBusinessPopupComponent } from './new-business-popup/new-business-popup.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as XLSX from 'xlsx-js-style';
import { FileUploader} from 'ng2-file-upload';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { InvalidFileDetailsComponent } from './invalid-file-details/invalid-file-details.component';

@Component({
  selector: 'app-business-services',
  templateUrl: './business-services.component.html',
  styleUrls: ['./business-services.component.scss'],
})
export class BusinessServicesComponent implements OnInit {
  displayedColumns: string[] = [
    'Position',
    'ApplicationName',
    'BusinessGroup',
    'DeploymentSite',
    'BusinessOwner',
    'ITOwner',
    'SupportLead',
    'RTO',
    'RPO',
    'Action',
  ];
  allBusinessData: any;
  dataSource = new MatTableDataSource<Element>();
  addApplicationForm!: FormGroup;
  businessService: any;
  selection: boolean = true;
  sortedData: Element[];
  invalidfile: boolean = false;
  ExcelValidExtension: Array<string> = ['xlsx'];
  selectedExcelJson: any[] = [];
  // excelValidHeaders = ["#", "Application_Name*", "ApplicationType*", "Business Function*", "Site*", "Business Owner*", "Business Owner EmailID*", "IT Owner*","IT Owner EmailID*","Support Lead*","Support Lead EmailID*","RTO Value*","RTO Unit*","RPO Value*","RPO Unit*","Support Team*","Support Team EmailID*"];
  excelValidHeaders = ["#", "Application Name*", "Application Type*", "Business Function*","Site*(Multiple Site's should be separated by ';' )","IT Owner EmailID*","Support Lead EmailID*","RTO Value*","RTO Unit*","RPO Value*","RPO Unit*","Support Team EmailID*(Multiple email ID's should be separated by ';' )"];
  fileName: string =  ''
  filenameWithoutExtension: any[] = [];
  validFileNameErr: boolean = false;
  bulkBusinesServiceData: FormData = new FormData();
  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    url: '',
  });
  invalidData: any;
  importButtonFlag: boolean = false;


  constructor(
    public MasterBusinessService: MasterBusinessServiceService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public authService: AuthService,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
  ) {
    this.authService.activeTab.next("master-data");
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.sortedData = this.dataSource.data.slice(); // Clone the data
  }

  ngOnInit(): void {
    this.addApplicationForm = this.fb.group({
      applicationName: ['', Validators.required],
      applicationType: ['', Validators.required],
      businessFunction: ['', Validators.required],
      rtoValue: ['', Validators.required],
      rtoUnit: ['', Validators.required],
      rpoValue: ['', Validators.required],
      rpoUnit: ['', Validators.required],
      selectedSites: this.fb.array([]),
      businessOwner: ['', Validators.required],
      itOwner: [''],
      supportLead: [''],
      supportTeam: this.fb.group({
        searchMembers: ['', Validators.required],
        teamMembers: this.fb.array([]),
      }),
    });
    this.MasterBusinessService.getBusinessData();
    this.MasterBusinessService.gotMaster.subscribe((value) => {
      if(value){
      this.businessService = this.MasterBusinessService.masterBusiness.BusinessServicesAppsMasterList;
        this.dataSource = this.MasterBusinessService.masterBusiness.BusinessServicesAppsMasterList?.map((app:any) => {
          const sitesArray = app.Sites.length ? JSON.parse(app.Sites) : [];
          const siteNames = sitesArray.map((site: { SiteID: number; SiteName: string }) => site.SiteName);
          app.siteNameNew = siteNames.join(', ');
          return app
        });
      }
    });
  }

  addEdit(mod?: any, data?: any) {
    const dialog = this.dialog.open(NewBusinessPopupComponent, {
      disableClose: true,
      maxWidth: '100vw',
      panelClass: ['business', 'full-screen-modal'],
      data: {
        mod: mod,
        data: data,
        allData : this.businessService,
        title: "Edit New Application"
      },
    });
    dialog.afterClosed().subscribe((result) => {});
  }

  add(mod?: any) {
    const dialog = this.dialog.open(NewBusinessPopupComponent, {
      disableClose: true,
      maxWidth: '100vw',
      panelClass: ['business', 'full-screen-modal'],
      data: {
        mod: mod,
        allData : this.businessService,
        title : "Add New Application"
      },
    });
    dialog.afterClosed().subscribe((result) => {});
  }

  onFileChange(event: any): void {
    this.readExcel(event.target.files[0]);
  }

  readExcel(data: File): void {
    const reader: FileReader = new FileReader();
    // Read the data as a binary string
    reader.readAsBinaryString(data);
   }

  uploadSuccess() {
    const timeout = 1000; // 1 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'success',
      data: {
        title: 'Success',
        content: 'File Imported successfully',
      },
    });

    confirm.afterOpened().subscribe((result) => {
      setTimeout(() => {
        confirm.close();
        this.MasterBusinessService.getBusinessData();
      }, timeout);
    });
  }
  uploadFailed() {
    const timeout = 1000; // 1 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'success',
      data: {
        title: 'Failed',
        content: "File doesn't have required data",
      },
    });

    confirm.afterOpened().subscribe((result) => {
      setTimeout(() => {
        confirm.close();
        this.MasterBusinessService.getBusinessData();
      }, timeout);
    });
  }
  dataFailed() {
    const timeout = 1000; // 1 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'success',
      data: {
        title: 'Failed',
        content: 'File is empty',
      },
    });

    confirm.afterOpened().subscribe((result) => {
      setTimeout(() => {
        confirm.close();
        this.MasterBusinessService.getBusinessData();
      }, timeout);
    });
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      const searchFields: any = [
        'ApplicationName',
        'BusinessFunction',
        'siteNameNew',
        'BusinessOwnerName',
        'ITOwnerName',
        'LeadName',
        'RecoveryPoint',
        'RecoveryTime'
      ];

      this.dataSource = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields,this.MasterBusinessService.masterBusiness['BusinessServicesAppsMasterList']))), false)
  }

  deleteBusiness(data?: any) {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: "ConfirmDialogComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: "Confirm Deletion",
        content: "This action will permanently delete the record.\nYou may not be able to retrieve it.\n\nDo you still want to delete it?"
      }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.MasterBusinessService.deleteBusiness(data).subscribe((res: any) => {
          next:
          this.deleteSuccess();
          error:
          console.log("err::", "error");
        });
      }
    });
  }
  deleteSuccess(): any {
    const timeout = 1000; // 1 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "success",
      backdropClass: 'static',
      data: {
        title: "Success",
        content: "Business Services is deleted successfully"
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.MasterBusinessService.getBusinessData();
      }, timeout)
    });
  }

  sortData(event: any) {
    const sortedData = this.sortByData(event, this.businessService);
    this.dataSource = new MatTableDataSource(sortedData);

  }

  sortByData(sort: any, tableData: any[]): any[] {
    if (!sort.active || sort.direction === '' || !tableData || tableData.length === 0) {
      return tableData;
    }
    return tableData.slice().sort((a: any, b: any) => {
      const aValue = (a[sort.active] || '').toString().toUpperCase();
      const bValue = (b[sort.active] || '').toString().toUpperCase();

      return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }

  download(){
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = "assets/SampleTemplate/Business_Services_And_Apps_Bulk_Import_List.xlsx";
    link.download = 'Business_Services_And_Apps_Bulk_Import_List.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  seletedFileDetails(event: any) {
    this.invalidData = []
    const fileInput = event.target;
    if (this.uploader.queue.length > 1) {
        let latestFile = this.uploader.queue[this.uploader.queue.length - 1];
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
                let data = XLSX.utils.sheet_to_json(ws, { defval: null }); // to get 2d array pass 2nd parameter as object {header: 1}

                // Remove empty keys and filter out null/empty values
                data = data.map((row: any) => {
                    return Object.fromEntries(
                        Object.entries(row).filter(([key, value]) => !key.startsWith('__EMPTY') && value !== null && value !== "")
                    );
                });

                console.log("data", data); // Data will be logged in array format containing objects
                this.selectedExcelJson = JSON.parse(JSON.stringify(data)) || [];

                let isValidHeaders = false, isElementsValid = true;
                this.selectedExcelJson.forEach((excelJson) => {
                    let list = [...Object.keys(excelJson).map((ele: any) => ele.trim())];

                    // Validate headers first
                    isValidHeaders = list.every(header => this.excelValidHeaders.includes(header));

                    // Validate values if headers are valid
                    if (isValidHeaders) {
                        list.forEach(header => {
                            if (header.includes('*') && !excelJson[header]?.toString()?.trim()) {
                                isElementsValid = false;
                            }
                        });
                    }

                    if (isValidHeaders && isElementsValid) {
                        this.importButtonFlag = true;
                        this.bulkBusinesServiceData = new FormData;
                        this.bulkBusinesServiceData.append('BusinessServiceBulk', JSON.stringify(data));
                        this.bulkBusinesServiceData.append('fileName', JSON.stringify(this.fileName));
                    } else {
                        this.popupInfoError("Unsuccessful", "Invalid File imported. Please select a valid file");
                    }

                    console.log("isValidHeaders:", isValidHeaders, "isElementsValid:", isElementsValid);
                });


                fileInput.value = '';
                // this.uploader.clearQueue();
            };
        } else {
            this.invalidfile = true;
            this.popupInfoError("Unsuccessful", "Invalid File imported. Please select a valid file");
        }
        if (this.fileNamePattern(this.fileName)) {
            this.validFileNameErr = true;
            this.popupInfoError("Unsuccessful", "Special Characters are not allowed in File name");
        } else {
            this.validFileNameErr = false;
        }
    }
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
            this.MasterBusinessService.getBusinessData();
        }, timeout)
    });
  }

  fileNamePattern(fileName: string) {
    const match = /[\^`\;@\&\+\$\%\!\#\{}]/;

    if (match.test(fileName)) {
      return true;
    }
    return false;
  }


  bulkUploadExcelFile() {
    console.log(" this.bulkBusinesServiceData",this.bulkBusinesServiceData)
    if(this.filenameWithoutExtension.length > 0) {
        this.MasterBusinessService.addBulkBusinessServicesMaster(this.bulkBusinesServiceData).subscribe(res => {
            next:
            localStorage.setItem('token', res.token);
            if (res.success == 1) {
              this.fileName = ''

                this.popupInfo("Success", res.message)
                this.invalidData = res.result.inValidData
                if(this.invalidData.length > 0){
                  this.importButtonFlag = false
                }
                this.filenameWithoutExtension = [];
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }
}

invalidExcelData(){
  const dialog = this.dialog.open(InvalidFileDetailsComponent, {
    disableClose: true,
    width: '100vw',
    panelClass: ['business', 'full-screen-modal'],
    data: {
      // mod: mod,
      allData : this.invalidData,
      title : "Invalid File Details"
    },
  });
  dialog.afterClosed().subscribe((result) => {
    // if(result){

    // }
  });
}

}
