import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RestService } from './services/rest/rest.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web';
  previousUrl: any;
  currentUrl: any;

  constructor(private router: Router,
    private restService: RestService) {

  }

  ngOnInit() {
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      this.restService.setPreviousUrl(this.previousUrl);
    });
  }
}
