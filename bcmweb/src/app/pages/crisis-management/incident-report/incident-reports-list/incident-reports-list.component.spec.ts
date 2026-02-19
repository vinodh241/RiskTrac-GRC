import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentReportsListComponent } from './incident-reports-list.component';

describe('IncidentReportsListComponent', () => {
  let component: IncidentReportsListComponent;
  let fixture: ComponentFixture<IncidentReportsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncidentReportsListComponent]
    });
    fixture = TestBed.createComponent(IncidentReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
