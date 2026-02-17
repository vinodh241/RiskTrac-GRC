import { TestBed } from '@angular/core/testing';

import { RiskMetricLevelsService } from './risk-metric-levels.service';

describe('RiskMetricLevelsService', () => {
  let service: RiskMetricLevelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskMetricLevelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
