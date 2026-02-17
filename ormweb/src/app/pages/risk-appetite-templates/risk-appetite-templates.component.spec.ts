import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAppetiteTemplatesComponent } from './risk-appetite-templates.component';

describe('RiskAppetiteTemplatesComponent', () => {
  let component: RiskAppetiteTemplatesComponent;
  let fixture: ComponentFixture<RiskAppetiteTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAppetiteTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAppetiteTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
