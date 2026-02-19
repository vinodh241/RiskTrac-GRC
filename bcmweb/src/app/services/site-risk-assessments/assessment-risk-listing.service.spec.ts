import { TestBed } from '@angular/core/testing';

import { AssessmentRiskListing } from './assessment-risk-listing.service';

describe('AssessmentRiskListing', () => {
  let service: AssessmentRiskListing;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentRiskListing);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
