import { Component, OnInit } from '@angular/core';
import { PlotAtrDataSortingOptions } from 'highcharts';
import { EmailService } from 'src/app/services/email/email.service';


interface EmailTemplate {
  name: string;
  age: string;
  details: string;
  toEmailId: string;
  templateType: string;
}

@Component({
  selector: 'app-generate-email',
  templateUrl: './generate-email.component.html',
  styleUrls: ['./generate-email.component.scss']
})
export class GenerateEmailComponent implements OnInit {

  userguid: any;
  emailform: any;
  emailTemplate: any = {
    name: '',
    age: '',
    details: '',
    toEmailId: '',
    templateType: 'A'
  };

  constructor(private service: EmailService) { }

  ngOnInit(): void {
    this.userguid = localStorage.getItem("userguid");
    //this.emailTemplate.userId = this.userguid;
  }

  generate() {
    if (!this.emailTemplate.toEmailId) {
      return alert("Email Id cannot be empty");
    }

    let data: any = [];
    Object.keys(this.emailTemplate).forEach(key => {
      data.push({ key: key, value: this.emailTemplate[key] })
    });

    console.log(data);
    this.service.triggerEmail(this.userguid, data);
  }

}
