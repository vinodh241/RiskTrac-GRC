import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMitigationComponent } from './risk-mitigation.component';

describe('RiskMitigationComponent', () => {
  let component: RiskMitigationComponent;
  let fixture: ComponentFixture<RiskMitigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskMitigationComponent]
    });
    fixture = TestBed.createComponent(RiskMitigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
