import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessImpactListingComponent } from './business-impact-listing.component';

describe('BusinessImpactListingComponent', () => {
  let component: BusinessImpactListingComponent;
  let fixture: ComponentFixture<BusinessImpactListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessImpactListingComponent]
    });
    fixture = TestBed.createComponent(BusinessImpactListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
