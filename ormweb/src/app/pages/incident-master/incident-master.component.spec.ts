import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentMasterComponent } from './incident-master.component';

describe('IncidentMasterComponent', () => {
  let component: IncidentMasterComponent;
  let fixture: ComponentFixture<IncidentMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
