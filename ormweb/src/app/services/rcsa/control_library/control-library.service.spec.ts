import { TestBed } from '@angular/core/testing';

import { ControlLibraryService } from './control-library.service';

describe('ControlLibraryService', () => {
  let service: ControlLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
