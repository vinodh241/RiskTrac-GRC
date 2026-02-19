import { TestBed } from '@angular/core/testing';

import { MasterInherentLikelyhoodService } from './master-inherent-likelyhood.service';

describe('MasterInherentLikelyhoodService', () => {
  let service: MasterInherentLikelyhoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterInherentLikelyhoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
