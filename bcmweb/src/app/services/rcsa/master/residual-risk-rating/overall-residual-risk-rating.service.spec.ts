import { TestBed } from '@angular/core/testing';

import { OverallResidualRiskRatingService } from './overall-residual-risk-rating.service';

describe('OverallResidualRiskRatingService', () => {
  let service: OverallResidualRiskRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverallResidualRiskRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
