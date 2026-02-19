import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceListingComponent } from './compliance-listing.component';

describe('ComplianceListingComponent', () => {
  let component: ComplianceListingComponent;
  let fixture: ComponentFixture<ComplianceListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplianceListingComponent]
    });
    fixture = TestBed.createComponent(ComplianceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
