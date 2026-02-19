import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService } from '../../rest/rest.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

@Injectable({
  providedIn: 'root',
})
export class MasterBusinessServiceService extends RestService {
  public masterBusiness!: any;
  public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public businessData!: any;
  public gotInfoMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any
  ) {
    super(_http, _dialog);
  }

  getBusinessData(): void {
    if (environment.dummyData) {
      this.processBusinessList({
        success: 1,
        message: 'Data fetch from DB successful.',
        result: {
          businessService: [
            {
              'BusinessS&A_Id': '1',
              Application_Name: 'T24 (Temenos)',
              Business_Function: 'Finance',
              Deployment_Site: 'Amlak HO Al Khobar DR Center',
              Business_Owner: 'Naseer El-Ghazzawy',
              IT_Owner: 'Mansur Abbas',
              Support_Lead: 'Gabr Saqqaf',
              RTO: '24 hrs',
              RPO: '24 hrs',
            },
            {
              Application_Name: 'T24 (Temenos)',
              Business_Function: 'Finance',
              Deployment_Site: 'Amlak HO Al Khobar DR Center',
              Business_Owner: 'Naseer El-Ghazzawy',
              IT_Owner: 'Mansur Abbas',
              Support_Lead: 'Gabr Saqqaf',
              RTO: '24 hrs',
              RPO: '24 hrs',
            },
            {
              Application_Name: 'T24 (Temenos)',
              Business_Function: 'Finance',
              Deployment_Site: 'Amlak HO Al Khobar DR Center',
              Business_Owner: 'Naseer El-Ghazzawy',
              IT_Owner: 'Mansur Abbas',
              Support_Lead: 'Gabr Saqqaf',
              RTO: '24 hrs',
              RPO: '24 hrs',
            },
          ],
        },
        error: {
          errorCode: null,
          errorMessage: null,
        },
        token: 'eyJ0eXAiOiJKV',
      });
    } else {
      this.post(
        '/business-continuity-management/master/get-businessServicesAndApps-master',
        {}
      ).subscribe((res) => {
        next: if (res.success == 1) {
          // console.log(res);

          this.processBusinessList(res);
        } else {
          if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
            this.utils.relogin(this._document);
          else this.popupInfo('Unsuccessful', res.error.errorMessage);
        }
      });
    }
  }
  processBusinessList(response: any): void {
    this.masterBusiness = response.result;
    this.gotMaster.next(true);
  }
  getBusinessServiceMasterInfo() {
    if (environment.dummyData) {
      this.processAddEditBusinessService({
        success: 1,
        message: 'Data fetch from DB successful.',
        result: {
          ApplicationTypeList: [
            {
              ApplicationTypeID: '1',
              ApplicationType: 'Business Service',
            },
            {
              ApplicationTypeID: '2',
              ApplicationType: 'Business Application',
            },
          ],
          BusinessFunctionsList: [
            {
              BusinessFunctionID: '1',
              BusinessFunctionName: 'Human Resource',
            },
          ],
          Sites: [
            {
              SiteID: '1',
              SiteName: 'Amlak',
            },
            {
              SiteID: '2',
              SiteName: 'Riyad',
            },
          ],
          BusinessOwnersList: [
            {
              UserGUID: 'C83496D1-4267-EE11-B013-000C296CF4F3',
              BusinessOwnerName: 'Sal Barton',
            },
          ],
          ITOwnersList: [
            {
              UserGUID: 'C83496D1-4267-EE11-B013-000C296CF4F3',
              OwnerName: 'Barton',
            },
          ],
          SupportLeadList: [
            {
              UserGUID: 'C83496D1-4267-EE11-B013-000C296CF4F3',
              LeadName: 'Sal',
            },
          ],
          SupportTeamList: [
            {
              UserGUID: 'C83496D1-4267-EE11-B013-000C296CF4F3',
              Team_Member: 'Yousef Broughton',
              Business_Group: 'HR & Admin',
            },
            {
              UserGUID: 'C83496D1-4267-EE11-B013-000C296CF4F3',
              Team_Member: 'Criticality Distribution',
              Business_Group: 'HR & Admin',
            },
          ],
        },
        error: {
          errorCode: null,
          errorMessage: null,
        },
      });
    } else {
      this.post(
        '/business-continuity-management/master/get-businessServicesAndApps-master-info',
        {}
      ).subscribe((res) => {
        next: if (res.success == 1) {
          // console.log(res);

          this.processAddEditBusinessService(res);
        } else {
          if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
            this.utils.relogin(this._document);
          else this.popupInfo('Unsuccessful', res.error.errorMessage);
        }
      });
    }
  }
  processAddEditBusinessService(response: any): void {
    this.businessData = response.result;
    // console.log('businessData: ', this.businessData);
    this.gotInfoMaster.next(true);
  }
  deleteBusiness(data: any) {
    // console.log('data: ', data);
    return this.post(
      '/business-continuity-management/master/businessServicesAndApps/delete-businessServicesApps-master',
      {
        data: {
          ApplicationID: Number(data.ApplicationID),
        },
      }
    );
  }

  updateBusinessData(data: any) {
    return this.post(
      '/business-continuity-management/master/businessServicesAndApps/update-businessServicesAndApps-master',
      { data: data }
    );
  }

  addBusinessData(data: any) {
    return this.post(
      '/business-continuity-management/master/businessServicesAndApps/add-businessServicesAndApps-master',
      { data: data }
    );
  }
  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this._dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: title,
        content: message,
      },
    });

    confirm.afterOpened().subscribe((result) => {
      setTimeout(() => {
        confirm.close();
        // this.router.navigate(['']);
      }, timeout);
    });
  }
  addIndex(docs: any, addEditMode: any) {
    let Index = 1;
    docs.forEach((data: any) => {
      data.Index = Index;
      if (addEditMode) data.isEdit = false;
      Index++;
    });
    return docs;
  }
  addBulkBusinessServicesMaster(data: FormData) {
    return this.upload(
      // '/bcm/dynamic-master/getUpdatedToken',
      '/business-continuity-management/master/businessServicesAndApps/add-bulk-business-services-master',
      data
    );
  }
}
