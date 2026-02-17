import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriDashboardComponent } from './kri.component';

describe('KriDashboardComponent', () => {
  let component: KriDashboardComponent;
  let fixture: ComponentFixture<KriDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
