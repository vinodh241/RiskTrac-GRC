import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffContactDetailsComponent } from './staff-contact-details.component';

describe('StaffContactDetailsComponent', () => {
  let component: StaffContactDetailsComponent;
  let fixture: ComponentFixture<StaffContactDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffContactDetailsComponent]
    });
    fixture = TestBed.createComponent(StaffContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
