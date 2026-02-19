import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService } from '../../rest/rest.service';
import { UtilsService } from '../../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

@Injectable({
  providedIn: 'root'
})

export class SubmitReviewService extends RestService {

  public masterComments: any;
  public gotReviewComments: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getComments(url: any, commentsPayload: any) {
    if (environment.dummyData) {
      this.processCommentsData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "CommentsHistory": [{
            "CommentID": 1,
            "Comment": "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
            "DateTime": "2024-01-10T13:23:28.490Z",
            "CommentUserName": "Yousef Broughton"
          }, {
            "CommentID": 2,
            "Comment": "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
            "DateTime": "2024-01-10T13:23:28.490Z",
            "CommentUserName": "Yousef Broughton"
          }]
        }
      });
    }
    else {
      this.post(url, { data: commentsPayload}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processCommentsData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processCommentsData(response: any) {
    this.masterComments = response.result;
    this.gotReviewComments.next(true);
  }

  submitCommentResponse(url?: any, payload?: any) {
    return this.post(url, { data: payload });
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
