import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicReviewWidgetComponent } from './periodic-review-widget.component';

describe('PeriodicReviewWidgetComponent', () => {
  let component: PeriodicReviewWidgetComponent;
  let fixture: ComponentFixture<PeriodicReviewWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeriodicReviewWidgetComponent]
    });
    fixture = TestBed.createComponent(PeriodicReviewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
