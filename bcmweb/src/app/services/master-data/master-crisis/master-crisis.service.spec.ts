import { TestBed } from '@angular/core/testing';

import { MasterCrisisService } from './master-crisis.service';

describe('MasterCrisisService', () => {
  let service: MasterCrisisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterCrisisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
