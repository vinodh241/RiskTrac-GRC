import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { RestService } from '../../rest/rest.service';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../utils/utils.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

export interface ApplList {
  Index: number;
  ApplicationName: string;
  PrimaryContactFullName: string;
  PrimaryContactMobileNumber: number;
  PrimaryContactEmailID: string;
  AlternateContactFullName: string;
  AlternateContactMobileNumber: number
  AlternateContactEmailID: string
  ContractTAT: number
  TATTimeUnit: number
}

@Injectable({
  providedIn: 'root'
})

export class MasterVendorsService extends RestService {

  public masterVendors!: any;
  public Vendors!: any;
  public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotVendors: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public serviceProvider!: any;
  public serviceProviderSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);

  requestData: any;

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,
    private utils: UtilsService,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getVendorMasterData(): void {
    if (environment.dummyData) {
      this.processVendorsList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "vendorsServiceProvidersList": [
            {
              "Vendor_Id": 1,
              "Vendor_Name": "Temenos",
              "Application_ID": 1,
              "Applications": "T1 (Temenos)",
              "PrimaryContact": [{ "Name": "Mounir Baccouche", "MobNo": "+971-56-6444-62", "OfficeNo": "", "EmailID": "mounirb@temenos.com" }],
              "AlternateContact": [{ "Name": "Ram", "MobNo": "+971-56-6444-32", "OfficeNo": "", "EmailID": "ram@temenos.com" }],
              "ContractTAT": "1 Hrs",
              "IsActive": "false"
            },
            {
              "Vendor_Id": 1,
              "Vendor_Name": "Temenos",
              "Application_ID": 2,
              "Applications": "T2 (Temenos)",
              "PrimaryContact": [{ "Name": "Mounir", "MobNo": "+971-56-6114-62", "OfficeNo": "", "EmailID": "mounirb@temenos.com" }],
              "AlternateContact": [{ "Name": "Ram", "MobNo": "+971-56-6444-62", "OfficeNo": "", "EmailID": "mortin@temenos.com" }],
              "ContractTAT": "2 Hrs",
              "IsActive": "false"
            },
            {
              "Vendor_Id": 2,
              "Vendor_Name": "Temenos1",
              "Application_ID": 3,
              "Applications": "T3 (Temenos)",
              "PrimaryContact": [{ "Name": "Baccouche", "MobNo": "+971-56-1444-62", "OfficeNo": "", "EmailID": "baccouche@temenos.com" }],
              "AlternateContact": [{ "Name": "accouche", "MobNo": "+971-67-6754-62", "OfficeNo": "", "EmailID": "accouche@temenos.com" }],
              "ContractTAT": "3 Hrs",
              "IsActive": "false"
            },
            {
              "Vendor_Id": 2,
              "Vendor_Name": "Temenos1",
              "Application_ID": 4,
              "Applications": "T4 (Temenos)",
              "PrimaryContact": [{ "Name": "Ouche", "MobNo": "+989-56-9044-62", "OfficeNo": "", "EmailID": "ouche@temenos.com" }],
              "AlternateContact": [{ "Name": "Roshni", "MobNo": "+923-56-6444-62", "OfficeNo": "", "EmailID": "roshni@temenos.com" }],
              "ContractTAT": "4 Hrs",
              "IsActive": "false"
            }
          ],
          "ServiceProviderList": [{ "Vendor_Id": 1, "Vendor_Name": "Temenos" }, { "Vendor_Id": 2, "Vendor_Name": "Temenos1" }],
          "ApplicationSupportList": [{ "Application_ID": 1, "Applications": "T1 (Temenos)" }, { "Application_ID": 2, "Applications": "T2 (Temenos)" }, { "Application_ID": 3, "Applications": "T3 (Temenos)" }, { "Application_ID": 4, "Applications": "T4 (Temenos)" }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1Nis"
      })
    }
    else {
      this.post("/bcm/vendor-master-page/get-vendor-details", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processVendorsList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  getVendorAppl() {
    if (environment.dummyData) {
      this.processVendors({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ApplicationSupportList": [
            { "Application_ID": 1, "Applications": "T1 (Temenos)" },
            { "Application_ID": 2, "Applications": "T2 (Temenos)" },
            { "Application_ID": 3, "Applications": "T3 (Temenos)" },
            { "Application_ID": 4, "Applications": "T4 (Temenos)" }
          ]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1Nis"
      })
    }
    else {
      this.post("/bcm/vendor-master-page/get-application-support-details", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processVendors(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  addVendorDetails(venName: any, data: any[], mode: any) {
    const uniqueVendorIDs = Array.from(new Set(data.map((item: any) => item.Vendor_Id)));
    const vendorID = uniqueVendorIDs[0]

    this.requestData = {
      VendorID: vendorID ? vendorID : null,
      VendorName: venName,
      SupportTeams: []
    }

    data.forEach((item: any) => {
      this.requestData["SupportTeams"].push({
        "PrimaryContactFullName": item.PrimaryContactFullName,
        "PrimaryContactEmailID": item.PrimaryContactEmailID,
        "PrimaryContactMobileNumber": item.PrimaryContactMobileNumber,
        "PrimaryContactOfficePhone": item.PrimaryContactOfficePhone ? item.PrimaryContactOfficePhone : null,
        "AlternateContactFullName": item.AlternateContactFullName,
        "AlternateContactEmailID": item.AlternateContactEmailID,
        "AlternateContactMobileNumber": item.AlternateContactMobileNumber,
        "AlternateContactOfficePhone": item.AlternateContactOfficePhone ? item.AlternateContactOfficePhone : null,
        "ApplicationID": item.ApplicationID ? item.ApplicationID : null,
        "TATTime": Number(item.ContractTAT),
        "TATTimeUnit": item.TATTimeUnitID
      })
    });
    return this.post(mode == 'Add' ? "/bcm/vendor-master-page/add-vendor-master" : "/bcm/vendor-master-page/update-vendor-master", { data: this.requestData });
  }

  processVendorsList(response: any): void {
    this.masterVendors = response.result
    this.gotMaster.next(true);
  }

  processVendors(response: any): void {
    this.Vendors = response.result
    this.gotVendors.next(true);
  }

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this._dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: title,
        content: message
      }
    });
  }

}
