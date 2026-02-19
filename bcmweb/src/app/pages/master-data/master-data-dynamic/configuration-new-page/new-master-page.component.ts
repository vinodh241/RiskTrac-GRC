import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiConstantsService } from 'src/app/services/api-constants/api-constants.service';
import { MasterSiteService } from 'src/app/services/master-data/master-site/master-site.service';

@Component({
  selector: 'app-new-master-page',
  templateUrl: './new-master-page.component.html',
  styleUrls: ['./new-master-page.component.scss'],
})
export class NewMasterPageComponent implements OnInit {
  addPageForm!: FormGroup;
  submitted = false;
  http_res_msg: boolean = false;
  validatemsg: any = '';
  validatemsg1: boolean = false;
  validatemsginput: any = '';
  validatemsginput1: boolean = false;
  show_save_btn1: any = true;
  show_save_btn2: any = true;
  totalPage: any = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public service: MasterSiteService,
    private apiConstant: ApiConstantsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initialzeForm();
  }
  initialzeForm() {
    /***********************************Validators*********************************************** */
    this.addPageForm = this.fb.group({
      PageTitle: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
      ],
      PageDisplayName: ['', [Validators.required]],
      AddButtonTitle: ['', [Validators.required]],
      PopupTitle: ['', [Validators.required]],
      SaveButtonTitle: ['', [Validators.required]],
      CancelButtonTitle: ['', [Validators.required]],
    });
  }

  addPage() {
    this.submitted = true;
    this.http_res_msg = true;

    if (this.addPageForm.valid) {
      this.submitted = false;
      this.validatemsg = 'Wait...';
      this.apiConstant
        .addWebPageConfiguration(this.addPageForm.value)
        .subscribe((res: any) => {
          next: this.validatemsg1 = true;
          this.validatemsg = 'Page is added. Thank you!';
          this.show_save_btn1 = false;
          this.submitted = false;
          this.http_res_msg = false;
          error: (error: any) => {
            if (error.status === 404) {
              this.validatemsg1 = true;
              this.validatemsg = 'Unable to Submit Form: Please Try Again';
            }
          };
        });

      const test: any = {};

      this.http.post<any>(this.apiConstant.GET_all_page, test);
      this.addPageForm.reset();
      // let data = JSON.stringify(this.addPageForm.value)
      // this.service.createTable(data)
    }
  }

  removeSpecialCharacter(event: any) {
    var k;
    k = event.charCode;
    if (event.which == 32) {
      event.preventDefault();
      return false;
    }
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  get f() {
    return this.addPageForm.controls;
  }

  close() {
    const test: any = {};

    this.http.post<any>(this.apiConstant.GET_all_page, test);
    this.dialog.closeAll();
  }
}
