import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediationListingComponent } from './remediation-listing.component';

describe('RemediationListingComponent', () => {
  let component: RemediationListingComponent;
  let fixture: ComponentFixture<RemediationListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemediationListingComponent]
    });
    fixture = TestBed.createComponent(RemediationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
