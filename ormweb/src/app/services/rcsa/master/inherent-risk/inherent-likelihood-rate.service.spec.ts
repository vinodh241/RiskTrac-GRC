import { TestBed } from '@angular/core/testing';

import { InherentLikelihoodRankService } from './inherent-likelihood-rate.service';

describe('InherentLikelihoodRankService', () => {
  let service: InherentLikelihoodRankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InherentLikelihoodRankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
