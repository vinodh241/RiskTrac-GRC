import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentOverallComponent } from './incident-overall.component';

describe('IncidentOverallComponent', () => {
  let component: IncidentOverallComponent;
  let fixture: ComponentFixture<IncidentOverallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentOverallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
