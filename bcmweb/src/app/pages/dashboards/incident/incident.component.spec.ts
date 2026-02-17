import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDashboardComponent } from './incident.component';

describe('IncidentDashboardComponent', () => {
  let component: IncidentDashboardComponent;
  let fixture: ComponentFixture<IncidentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
