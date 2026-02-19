import { TestBed } from '@angular/core/testing';

import { BusinessContinuityPlansService } from './business-continuity-plans.service';

describe('BusinessContinuityPlansService', () => {
  let service: BusinessContinuityPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessContinuityPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
