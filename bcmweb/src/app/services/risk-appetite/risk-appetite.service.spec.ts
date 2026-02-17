import { TestBed } from '@angular/core/testing';

import { RiskAppetiteService } from './risk-appetite.service';

describe('RiskAppetiteService', () => {
  let service: RiskAppetiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskAppetiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
