import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSteeringCommitteeComponent } from './add-steering-committee.component';

describe('AddSteeringCommitteeComponent', () => {
  let component: AddSteeringCommitteeComponent;
  let fixture: ComponentFixture<AddSteeringCommitteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSteeringCommitteeComponent]
    });
    fixture = TestBed.createComponent(AddSteeringCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
