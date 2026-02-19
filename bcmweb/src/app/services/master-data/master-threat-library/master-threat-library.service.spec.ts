import { TestBed } from '@angular/core/testing';

import { MasterThreatLibraryService } from './master-threat-library.service';

describe('MasterThreatLibraryService', () => {
  let service: MasterThreatLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterThreatLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
