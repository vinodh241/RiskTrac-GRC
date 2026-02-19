import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentRiskListingComponent } from './assessment-risk-listing.component';

describe('AssessmentRiskListingComponent', () => {
  let component: AssessmentRiskListingComponent;
  let fixture: ComponentFixture<AssessmentRiskListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentRiskListingComponent]
    });
    fixture = TestBed.createComponent(AssessmentRiskListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
