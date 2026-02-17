import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAppetiteComponent } from './risk-appetite.component';

describe('RiskAppetiteComponent', () => {
  let component: RiskAppetiteComponent;
  let fixture: ComponentFixture<RiskAppetiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAppetiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAppetiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
