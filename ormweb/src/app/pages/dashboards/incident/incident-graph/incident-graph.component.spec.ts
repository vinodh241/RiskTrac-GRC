import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentGraphComponent } from './incident-graph.component';

describe('IncidentGraphComponent', () => {
  let component: IncidentGraphComponent;
  let fixture: ComponentFixture<IncidentGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
