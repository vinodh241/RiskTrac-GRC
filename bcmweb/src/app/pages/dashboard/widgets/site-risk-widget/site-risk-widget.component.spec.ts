import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteRiskWidgetComponent } from './site-risk-widget.component';

describe('SiteRiskWidgetComponent', () => {
  let component: SiteRiskWidgetComponent;
  let fixture: ComponentFixture<SiteRiskWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteRiskWidgetComponent]
    });
    fixture = TestBed.createComponent(SiteRiskWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
