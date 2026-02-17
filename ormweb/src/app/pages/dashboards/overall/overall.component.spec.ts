import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverAllDashboardComponent } from './overall.component';

describe('OverAllDashboardComponent', () => {
  let component: OverAllDashboardComponent;
  let fixture: ComponentFixture<OverAllDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverAllDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverAllDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
