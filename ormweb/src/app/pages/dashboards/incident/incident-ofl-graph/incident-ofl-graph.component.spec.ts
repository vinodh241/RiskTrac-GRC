import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentOflGraphComponent } from './incident-ofl-graph.component';

describe('IncidentOflGraphComponent', () => {
  let component: IncidentOflGraphComponent;
  let fixture: ComponentFixture<IncidentOflGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentOflGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentOflGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
