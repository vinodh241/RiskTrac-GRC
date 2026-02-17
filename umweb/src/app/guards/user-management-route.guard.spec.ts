import { TestBed } from '@angular/core/testing';

import { UserManagementRouteGuard } from './user-management-route.guard';

describe('UserManagementRouteGuard', () => {
  let guard: UserManagementRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserManagementRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
