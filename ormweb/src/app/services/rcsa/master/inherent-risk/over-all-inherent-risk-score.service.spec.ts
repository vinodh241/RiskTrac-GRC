import { TestBed } from '@angular/core/testing';

import { OverAllInherentRiskScoreService } from './over-all-inherent-risk-score.service';

describe('OverAllInherentRiskScoreService', () => {
  let service: OverAllInherentRiskScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverAllInherentRiskScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
