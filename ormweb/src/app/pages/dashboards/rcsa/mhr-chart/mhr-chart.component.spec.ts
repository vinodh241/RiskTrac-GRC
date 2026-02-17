import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MhrDashboardComponent } from './mhr-chart.component';

describe('MhrDashboardComponent', () => {
  let component: MhrDashboardComponent;
  let fixture: ComponentFixture<MhrDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MhrDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MhrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
