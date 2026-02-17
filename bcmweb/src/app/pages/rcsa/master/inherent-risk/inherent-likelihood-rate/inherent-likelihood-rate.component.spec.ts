import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InherentLikelihoodRateComponent } from './inherent-likelihood-rate.component';

describe('InherentLikelihoodRateComponent', () => {
  let component: InherentLikelihoodRateComponent;
  let fixture: ComponentFixture<InherentLikelihoodRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InherentLikelihoodRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InherentLikelihoodRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
