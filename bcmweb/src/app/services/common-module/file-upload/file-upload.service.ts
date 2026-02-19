import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { RestService } from '../../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService extends RestService{

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,
    private utils: UtilsService,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  uploadEvidenceFile(data:FormData, url: string) {
    return this.upload(url, data);
  }
}
