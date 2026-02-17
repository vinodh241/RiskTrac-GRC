import { Component, ChangeDetectorRef, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterContentChecked {
  title = 'RiskTrac';
  isMenuVisible = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterContentChecked() {
    const showMenu = localStorage.getItem('showmenu') === 'true';
    if (this.isMenuVisible !== showMenu) {
      this.isMenuVisible = showMenu;
      this.cdRef.detectChanges();
    }
  }
}
