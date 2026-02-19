import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessContinuityListingComponent } from './business-continuity-listing.component';

describe('BusinessContinuityListingComponent', () => {
  let component: BusinessContinuityListingComponent;
  let fixture: ComponentFixture<BusinessContinuityListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessContinuityListingComponent]
    });
    fixture = TestBed.createComponent(BusinessContinuityListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
