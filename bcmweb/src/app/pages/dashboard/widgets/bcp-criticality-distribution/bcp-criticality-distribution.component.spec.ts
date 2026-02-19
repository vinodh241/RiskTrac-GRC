import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpCriticalityDistributionComponent } from './bcp-criticality-distribution.component';

describe('BcpCriticalityDistributionComponent', () => {
  let component: BcpCriticalityDistributionComponent;
  let fixture: ComponentFixture<BcpCriticalityDistributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BcpCriticalityDistributionComponent]
    });
    fixture = TestBed.createComponent(BcpCriticalityDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
