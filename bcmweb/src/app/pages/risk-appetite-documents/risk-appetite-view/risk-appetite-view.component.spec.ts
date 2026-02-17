import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAppetiteViewComponent } from './risk-appetite-view.component';

describe('RiskAppetiteViewComponent', () => {
  let component: RiskAppetiteViewComponent;
  let fixture: ComponentFixture<RiskAppetiteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAppetiteViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAppetiteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
