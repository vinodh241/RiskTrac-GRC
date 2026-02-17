import { TestBed } from '@angular/core/testing';

import { OverAllInherentRiskRatingService } from './over-all-inherent-risk-rating.service';

describe('OverAllInherentRiskRatingService', () => {
  let service: OverAllInherentRiskRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverAllInherentRiskRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
