import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmsTestListingComponent } from './bcms-test-listing.component';

describe('BcmsTestListingComponent', () => {
  let component: BcmsTestListingComponent;
  let fixture: ComponentFixture<BcmsTestListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BcmsTestListingComponent]
    });
    fixture = TestBed.createComponent(BcmsTestListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
