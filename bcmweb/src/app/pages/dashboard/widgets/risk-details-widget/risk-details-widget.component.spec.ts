import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDetailsWidgetComponent } from './risk-details-widget.component';

describe('RiskDetailsWidgetComponent', () => {
  let component: RiskDetailsWidgetComponent;
  let fixture: ComponentFixture<RiskDetailsWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskDetailsWidgetComponent]
    });
    fixture = TestBed.createComponent(RiskDetailsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
