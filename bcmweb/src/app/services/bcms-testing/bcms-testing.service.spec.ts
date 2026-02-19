import { TestBed } from '@angular/core/testing';

import { BcmsTestingService } from './bcms-testing.service';

describe('BcmsTestingService', () => {
  let service: BcmsTestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcmsTestingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
