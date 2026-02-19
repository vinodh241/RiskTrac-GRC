import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessActivitiesDetailsComponent } from './process-activities-details.component';

describe('ProcessActivitiesDetailsComponent', () => {
  let component: ProcessActivitiesDetailsComponent;
  let fixture: ComponentFixture<ProcessActivitiesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessActivitiesDetailsComponent]
    });
    fixture = TestBed.createComponent(ProcessActivitiesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
