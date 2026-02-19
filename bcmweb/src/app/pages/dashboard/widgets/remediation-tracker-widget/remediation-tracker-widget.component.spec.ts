import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediationTrackerWidgetComponent } from './remediation-tracker-widget.component';

describe('RemediationTrackerWidgetComponent', () => {
  let component: RemediationTrackerWidgetComponent;
  let fixture: ComponentFixture<RemediationTrackerWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemediationTrackerWidgetComponent]
    });
    fixture = TestBed.createComponent(RemediationTrackerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
