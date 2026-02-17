import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskappetiteOverallComponent } from './riskappetite-overall.component';

describe('RiskappetiteOverallComponent', () => {
  let component: RiskappetiteOverallComponent;
  let fixture: ComponentFixture<RiskappetiteOverallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskappetiteOverallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskappetiteOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
