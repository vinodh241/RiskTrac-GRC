import { TestBed } from '@angular/core/testing';

import { InherentImpactRateService } from './inherent-impact-rate.service';

describe('InherentImpactRateService', () => {
  let service: InherentImpactRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InherentImpactRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
