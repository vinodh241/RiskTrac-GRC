import { Inject, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from '../../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { RestService } from '../../rest/rest.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BehaviorSubject } from 'rxjs';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';

export interface SiteTableColumns {
  index: number;
  ShortCode: string;
  SiteName: string;
  Location: string;
  Country: string;
  SiteBusinessContinuityChampion: string;
  SiteAdminHead: string;
  BusinessFunctions: string;
  action: number;
}

@Injectable({
  providedIn: 'root'
})
export class MasterSiteService extends RestService {
  public master!: any;
  public TableSite!: MatTableDataSource<SiteTableColumns>;

  public siteInfoData: any;
  public gotMasterSiteInfoData: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getSiteMaster(): void {
    if (environment.dummyData) {
      this.processSiteList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "SiteMasterDetails": [{
            "RiskID": 1,
            "SiteID": 1,
            "SiteName": "Amlak Head Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "KSA",
            "BCChampionGUID": 1,
            "BCChampionName": "Geoffrey Weimann",
            "AdminGUID": 1,
            "AdminName": "Matteo Luettgen",
            "BussinessFunctionCount": 23,
            "IsActive": true
          },
          {
            "RiskID": 2,
            "SiteID": 2,
            "SiteName": "Riyad Branch Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "IND",
            "BCChampionGUID": 1,
            "BCChampionName": "Kmaille Swift",
            "AdminGUID": 1,
            "AdminName": "Jalen Kreiger",
            "BussinessFunctionCount": 36,
            "IsActive": false
          },
          {
            "RiskID": 3,
            "SiteID": 2,
            "SiteName": "Riyad Branch Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "IND",
            "BCChampionGUID": 1,
            "BCChampionName": "Kmaille Swift",
            "AdminGUID": 1,
            "AdminName": "Jalen Kreiger",
            "BussinessFunctionCount": 36,
            "IsActive": false
          },
          {
            "RiskID": 4,
            "SiteID": 2,
            "SiteName": "Riyad Branch Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "IND",
            "BCChampionGUID": 1,
            "BCChampionName": "Kmaille Swift",
            "AdminGUID": 1,
            "AdminName": "Jalen Kreiger",
            "BussinessFunctionCount": 36,
            "IsActive": false
          },
          {
            "RiskID": 5,
            "SiteID": 2,
            "SiteName": "Riyad Branch Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "IND",
            "BCChampionGUID": 1,
            "BCChampionName": "Kmaille Swift",
            "AdminGUID": 1,
            "AdminName": "Jalen Kreiger",
            "BussinessFunctionCount": 36,
            "IsActive": false
          },
          {
            "RiskID": 6,
            "SiteID": 2,
            "SiteName": "Riyad Branch Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "IND",
            "BCChampionGUID": 1,
            "BCChampionName": "Kmaille Swift",
            "AdminGUID": 1,
            "AdminName": "Jalen Kreiger",
            "BussinessFunctionCount": 36,
            "IsActive": false
          },
          {
            "RiskID": 7,
            "SiteID": 2,
            "SiteName": "Riyad Branch Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "IND",
            "BCChampionGUID": 1,
            "BCChampionName": "Kmaille Swift",
            "AdminGUID": 1,
            "AdminName": "Jalen Kreiger",
            "BussinessFunctionCount": 36,
            "IsActive": false
          },
          {
            "RiskID": 8,
            "SiteID": 2,
            "SiteName": "Riyad Branch Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "IND",
            "BCChampionGUID": 1,
            "BCChampionName": "Kmaille Swift",
            "AdminGUID": 1,
            "AdminName": "Jalen Kreiger",
            "BussinessFunctionCount": 36,
            "IsActive": false
          },
          {
            "RiskID": 9,
            "SiteID": 2,
            "SiteName": "Riyad Branch Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "IND",
            "BCChampionGUID": 1,
            "BCChampionName": "Kmaille Swift",
            "AdminGUID": 1,
            "AdminName": "Jalen Kreiger",
            "BussinessFunctionCount": 36,
            "IsActive": false
          },
          {
            "RiskID": 10,
            "SiteID": 3,
            "SiteName": "Amlak Head Office",
            "ShortCode": "HD",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "KSA",
            "BCChampionGUID": 1,
            "BCChampionName": "Geoffrey Weimann",
            "AdminGUID": 1,
            "AdminName": "Matteo Luettgen",
            "BussinessFunctionCount": 45,
            "IsActive": true
          },
          {
            "RiskID": 11,
            "SiteID": 4,
            "SiteName": "Amlak Head Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "KSA",
            "BCChampionGUID": 1,
            "BCChampionName": "Geoffrey Weimann",
            "AdminGUID": 1,
            "AdminName": "Matteo Luettgen",
            "BussinessFunctionCount": 213,
            "IsActive": true
          },
          {
            "RiskID": 12,
            "SiteID": 5,
            "SiteName": "Amlak Head Office",
            "ShortCode": "HO",
            "SiteAddress": "Riyadh",
            "CityID": 1,
            "City": "DR Center",
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1,
            "Country": "KSA",
            "BCChampionGUID": 1,
            "BCChampionName": "Geoffrey Weimann",
            "AdminGUID": 1,
            "AdminName": "Matteo Luettgen",
            "BussinessFunctionCount": 2,
            "IsActive": false
          }
          ]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ''
      });
    }
    else {
      this.post("/business-continuity-management/master/sites/get-site-master", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processSiteList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processSiteList(response: any): void {
    this.master = response.result;
    this.TableSite = new MatTableDataSource(addIndex((this.master.SiteMasterDetails), false));
  }

  deleteSite(id: any) {
    return this.post("/business-continuity-management/master/sites/delete-site-master", {
      "data": {
        "siteId": id,
      },
    });
  }

  getSiteMasterInfo() {
    if (environment.dummyData) {
      this.processSiteInfo({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "CityList": [{
            "CityID": 1,
            "City": "banglore",
            "StateID": 1
          }],
          "StateList": [{
            "StateID": 1,
            "State": "Karnataka",
            "CountryID": 1
          }],
          "CountryList": [{
            "CountryID": 1,
            "Country": "India",
            "CountryCode": "IND"
          }],
          "BCChampionList": [{
            "BCChampionGUID": 1234,
            "BCChampionName": "BCChamp"
          }],
          "SiteAdminList": [{
            "AdminGUID": 2345,
            "AdminName": "SAdmin"
          }]

        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ''
      });
    }
    else {
      this.post("/business-continuity-management/master/sites/get-site-master-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processSiteInfo(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processSiteInfo(response: any) {
    this.siteInfoData = response.result;
    this.gotMasterSiteInfoData.next(true)
  }

  addOrUpdateSite(siteID: any, formData: any, mode: any) {
    let bCChampionGUID = (this.siteInfoData.BCChampionList || []).filter((x: any) => x.BCChampionName.trim().toLowerCase() == formData.siteBCChamp.value.trim().toLowerCase())[0].BCChampionGUID;
    let adminHeadID = (this.siteInfoData.SiteAdminList || []).filter((x: any) => x.AdminName.trim().toLowerCase() == formData.siteAdminHead.value.trim().toLowerCase())[0].AdminGUID;
    let data = {
      "siteId": siteID,
      "siteName": formData.siteName.value,
      "siteShortCode": formData.shortCode.value,
      "siteAddress": formData.siteAdress.value,
      "cityId": formData.cityId.value,
      "countryId": formData.countryId.value,
      "bcChampionGUID": bCChampionGUID,
      "siteAdminId": adminHeadID,
      "isActive": true
    }
    return this.post(mode == "Add New" ? "/business-continuity-management/master/sites/add-site-master" : "/business-continuity-management/master/sites/update-site-master", { "data": data });
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

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }


}
