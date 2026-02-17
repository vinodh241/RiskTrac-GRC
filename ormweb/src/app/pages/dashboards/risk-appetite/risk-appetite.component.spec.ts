import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskApptiteDashboardComponent } from './risk-appetite.component';

describe('RiskApptiteDashboardComponent', () => {
  let component: RiskApptiteDashboardComponent;
  let fixture: ComponentFixture<RiskApptiteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskApptiteDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskApptiteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
