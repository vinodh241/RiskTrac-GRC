import { TestBed } from '@angular/core/testing';

import { MasterMetricLibraryService } from './master-metric-library.service';

describe('MasterMetricLibraryService', () => {
  let service: MasterMetricLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterMetricLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
