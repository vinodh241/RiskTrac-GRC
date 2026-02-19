import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisisCommunicationListingComponent } from './crisis-communication-listing.component';

describe('CrisisCommunicationListingComponent', () => {
  let component: CrisisCommunicationListingComponent;
  let fixture: ComponentFixture<CrisisCommunicationListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrisisCommunicationListingComponent]
    });
    fixture = TestBed.createComponent(CrisisCommunicationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
