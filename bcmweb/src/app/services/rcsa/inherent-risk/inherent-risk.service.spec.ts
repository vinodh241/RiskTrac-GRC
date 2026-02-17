import { TestBed } from '@angular/core/testing';

import { InherentRiskService } from './inherent-risk.service';

describe('InherentRiskService', () => {
  let service: InherentRiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InherentRiskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
