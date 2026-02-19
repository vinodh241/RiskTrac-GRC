import { TestBed } from '@angular/core/testing';

import { MasterVendorsService } from './master-vendors.service';

describe('MasterVendorsService', () => {
  let service: MasterVendorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterVendorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
