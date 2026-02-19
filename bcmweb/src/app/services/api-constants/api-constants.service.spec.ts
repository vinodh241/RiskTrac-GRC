import { TestBed } from '@angular/core/testing';

import { ApiConstantsService } from './api-constants.service';

describe('ApiConstantsService', () => {
  let service: ApiConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiConstantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
