import { TestBed } from '@angular/core/testing';

import { RiskReportsService } from './risk-reports.service';

describe('RiskReportsService', () => {
  let service: RiskReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
