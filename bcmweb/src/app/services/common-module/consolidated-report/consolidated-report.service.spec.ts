import { TestBed } from '@angular/core/testing';

import { ConsolidatedReportService } from './consolidated-report.service';

describe('ConsolidatedReportService', () => {
  let service: ConsolidatedReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsolidatedReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
