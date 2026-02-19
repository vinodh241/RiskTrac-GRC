import { TestBed } from '@angular/core/testing';

import { LoadjsService } from './loadjs.service';

describe('LoadjsService', () => {
  let service: LoadjsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadjsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
