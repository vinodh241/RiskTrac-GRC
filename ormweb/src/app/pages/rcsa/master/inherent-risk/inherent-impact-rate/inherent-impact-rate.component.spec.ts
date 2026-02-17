import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InherentImpactRateComponent } from './inherent-impact-rate.component';

describe('InherentImpactRateComponent', () => {
  let component: InherentImpactRateComponent;
  let fixture: ComponentFixture<InherentImpactRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InherentImpactRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InherentImpactRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
