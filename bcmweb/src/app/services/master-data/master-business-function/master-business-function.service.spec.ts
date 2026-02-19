import { TestBed } from '@angular/core/testing';

import { MasterBusinessFunctionService } from './master-business-function.service';

describe('MasterBusinessFunctionService', () => {
  let service: MasterBusinessFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterBusinessFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
