import { TestBed } from '@angular/core/testing';

import { MasterSiteService } from './master-site.service';

describe('MasterSiteService', () => {
  let service: MasterSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterSiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
