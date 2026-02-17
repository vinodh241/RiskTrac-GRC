import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCwComponent } from './incident-cw.component';

describe('IncidentCwComponent', () => {
  let component: IncidentCwComponent;
  let fixture: ComponentFixture<IncidentCwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentCwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
