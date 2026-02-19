import { TestBed } from '@angular/core/testing';

import { MasterBusinessServiceService } from './master-business-service.service';

describe('MasterBusinessServiceService', () => {
  let service: MasterBusinessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterBusinessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
