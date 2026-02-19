import { TestBed } from '@angular/core/testing';

import { SteeringCommitteeService } from './steering-committee.service';

describe('SteeringCommitteeService', () => {
  let service: SteeringCommitteeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteeringCommitteeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
