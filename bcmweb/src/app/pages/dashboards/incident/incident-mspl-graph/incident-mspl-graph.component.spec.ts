import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentMsplGraphComponent } from './incident-mspl-graph.component';

describe('IncidentMsplGraphComponent', () => {
  let component: IncidentMsplGraphComponent;
  let fixture: ComponentFixture<IncidentMsplGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentMsplGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentMsplGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
