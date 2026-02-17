import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAppetiteGraphComponent } from './risk-appetite-graph.component';

describe('RiskAppetiteGraphComponent', () => {
  let component: RiskAppetiteGraphComponent;
  let fixture: ComponentFixture<RiskAppetiteGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAppetiteGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAppetiteGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
