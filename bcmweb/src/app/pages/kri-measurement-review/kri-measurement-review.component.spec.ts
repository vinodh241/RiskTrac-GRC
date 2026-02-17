import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriMeasurementReviewComponent } from './kri-measurement-review.component';

describe('KriMeasurementReviewComponent', () => {
  let component: KriMeasurementReviewComponent;
  let fixture: ComponentFixture<KriMeasurementReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriMeasurementReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriMeasurementReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
