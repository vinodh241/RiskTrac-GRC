import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCwGraphComponent } from './incident-cw-graph.component';

describe('IncidentCwGraphComponent', () => {
  let component: IncidentCwGraphComponent;
  let fixture: ComponentFixture<IncidentCwGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCwGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentCwGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
