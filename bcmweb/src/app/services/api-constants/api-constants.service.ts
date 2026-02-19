import { Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { MatSort } from '@angular/material/sort';
import { RestService } from '../rest/rest.service';
import { UtilsService } from '../utils/utils.service';

const API_URL = environment.bcmapiUrl;
@Injectable({
  providedIn: 'root',
})
export class ApiConstantsService extends RestService {
  response: any;
  public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotcontrolMaster: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public gotEditMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotConfigMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotInputMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public master!: any;
  public masterData!: any;
  records: any;
  headerList: any;
  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any
  ) {
    super(_http, _dialog);
  }
  GET_all_page = API_URL + '/bcm/dynamic-master/getWebPageConfiguration';
  GET_page_vise_table_data = API_URL + '/bcm/dynamic-master/execProcedure';
  POST_Page_data = API_URL + '/bcm/dynamic-master/addWebPageConfiguration';
  POST_Page_vise_input_data = API_URL + '/bcm/dynamic-master/addWebPageControlConfiguration';
  GET_MASTER_DATA = API_URL + '/bcm/dynamic-master/getInfoMasterFields';
  GET_PAGE_DATA = API_URL + '/bcm/dynamic-master/getPageDetails';
  GET_POPUP_CONTROLS = API_URL + '/bcm/dynamic-master/getWebPageControlConfiguration';
  ADD_DATA_RECORD = API_URL + '/bcm/dynamic-master/addData';
  STATUS_DATA = API_URL + '/bcm/dynamic-master/editRecordStatus';
  EDIT_DATA = API_URL + '/bcm/dynamic-master/getEditControlInfo';
  EDIT_CONTROL = API_URL + '/bcm/dynamic-master/editData';
  GET_PAGE_INFO = API_URL + '/bcm/dynamic-master/getPageInfo';

  getWebPageConfiguration(): void {
    this.post('/bcm/dynamic-master/getWebPageConfiguration', {}).subscribe((res) => {
      if (res.success == 0) {
        if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
          this.utils.relogin(this._document);
        else this.popupInfo('Unsuccessful', res.error.errorMessage);
      } else {
        this.processConfigData(res);
      }
    });
  }

  addWebPageConfiguration(data: any) {
    return this.post('/bcm/dynamic-master/addWebPageConfiguration', { data: data });
  }

  addWebPageControlConfiguration(data: any) {
    return this.post('/bcm/dynamic-master/addWebPageControlConfiguration', { data: data });
  }

  getInfoMasterFields(PageTitle: any): void {
    const payload = {
      PageTitle: PageTitle,
    };
    this.post('/bcm/dynamic-master/getInfoMasterFields', { data: payload }).subscribe(
      (res) => {
        if (res.success == 0) {
          if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
            this.utils.relogin(this._document);
          else this.popupInfo('Unsuccessful', res.error.errorMessage);
        } else {
          this.processInputData(res);
        }
      }
    );
  }

  getPageDetails(PageTitle: any): void {
    const payload = {
      PageTitle: PageTitle,
    };
    this.post('/bcm/dynamic-master/getPageDetails', { PageTitle: PageTitle }).subscribe(
      (res) => {
        if (res.success == 0) {
          if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
            this.utils.relogin(this._document);
          else this.popupInfo('Unsuccessful', res.error.errorMessage);
        } else {
          this.processData(res);
        }
      }
    );
  }

  getPageInfo(PageTitle: any): void {
    this.post('/bcm/dynamic-master/getPageInfo', { PageTitle: PageTitle }).subscribe(
      (res) => {
        this.processData(res);
      }
    );
  }

  getWebPageControlConfiguration(PageID: any, PageTitle: any): void {
    const payload = {
      PageID: PageID,
      PageTitle: PageTitle,
    };
    this.post('/bcm/dynamic-master/getWebPageControlConfiguration', {
      data: payload,
    }).subscribe((res) => {
      if (res.success == 0) {
        if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
          this.utils.relogin(this._document);
        else this.popupInfo('Unsuccessful', res.error.errorMessage);
      } else {
        this.processWebPageControlConfiguration(res);
      }
    });
  }

  getWebPageConfiguration1() {
    return this.post('/bcm/dynamic-master/getWebPageConfiguration', {});
  }

  addData(data: any, title: any) {
    const payload = {
      TableData: data,
      PageTitle: title,
    };
    return this.post('/bcm/dynamic-master/addData', { data: payload });
  }

  editRecordStatus(data: any) {
    return this.post('/bcm/dynamic-master/editRecordStatus', { data: data });
  }

  editData(result: any, pageTitle: any, data: any) {
    const payload = {
      TableData: result,
      PageTitle: pageTitle,
      IDInfo: data,
    };
    return this.post('/bcm/dynamic-master/editData', { data: payload });
  }

  getEditControlInfo(PageID: any, rowData: any, PageTitle: any): void {
    const payload = {
      PageID: PageID,
      rowData: rowData,
      PageTitle: PageTitle,
    };
    this.post('/bcm/dynamic-master/getEditControlInfo', { data: payload }).subscribe(
      (res) => {
        if (res.success == 0) {
          if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
            this.utils.relogin(this._document);
          else this.popupInfo('Unsuccessful', res.error.errorMessage);
        } else {
          this.processEditData(res);
        }
      }
    );
  }

  processWebPageControlConfiguration(response: any): void {
    this.masterData = response;
    this.gotcontrolMaster.next(true);
  }

  processEditData(res: any) {
    this.master = res;
    this.gotEditMaster.next(true);
  }
  processData(response: any): void {
    this.master = response;
    this.gotMaster.next(true);
  }
  processConfigData(res:any){
    this.master = res
    this.gotConfigMaster.next(true)
  }
  processInputData(response: any): void {
    this.master = response;
    this.gotInputMaster.next(true);
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
      }, timeout);
    });
  }
}
