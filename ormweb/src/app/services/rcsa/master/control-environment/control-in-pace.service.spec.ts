import { TestBed } from '@angular/core/testing';

import { ControlInPaceService } from './control-in-pace.service';

describe('ControlInPaceService', () => {
  let service: ControlInPaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlInPaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
