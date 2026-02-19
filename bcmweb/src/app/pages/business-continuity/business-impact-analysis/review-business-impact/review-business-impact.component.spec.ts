import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewBusinessImpactComponent } from './review-business-impact.component';

describe('ReviewBusinessImpactComponent', () => {
  let component: ReviewBusinessImpactComponent;
  let fixture: ComponentFixture<ReviewBusinessImpactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewBusinessImpactComponent]
    });
    fixture = TestBed.createComponent(ReviewBusinessImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
