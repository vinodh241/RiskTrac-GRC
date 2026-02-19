import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceAssessmentListingComponent } from './compliance-assessment-listing.component';

describe('ComplianceAssessmentListingComponent', () => {
  let component: ComplianceAssessmentListingComponent;
  let fixture: ComponentFixture<ComplianceAssessmentListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplianceAssessmentListingComponent]
    });
    fixture = TestBed.createComponent(ComplianceAssessmentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
