import { TestBed } from '@angular/core/testing';

import { CrisisCommunicationService } from './crisis-communication.service';

describe('CrisisCommunicationService', () => {
  let service: CrisisCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrisisCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
