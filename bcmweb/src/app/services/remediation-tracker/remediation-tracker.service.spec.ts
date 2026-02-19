import { TestBed } from '@angular/core/testing';

import { RemediationTrackerService } from './remediation-tracker.service';

describe('RemediationTrackerService', () => {
  let service: RemediationTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemediationTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
