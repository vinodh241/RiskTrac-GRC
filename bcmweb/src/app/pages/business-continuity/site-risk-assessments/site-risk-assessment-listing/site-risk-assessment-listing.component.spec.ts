import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteRiskAssessmentListingComponent } from './site-risk-assessment-listing.component';

describe('SiteRiskAssessmentListingComponent', () => {
  let component: SiteRiskAssessmentListingComponent;
  let fixture: ComponentFixture<SiteRiskAssessmentListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteRiskAssessmentListingComponent]
    });
    fixture = TestBed.createComponent(SiteRiskAssessmentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
