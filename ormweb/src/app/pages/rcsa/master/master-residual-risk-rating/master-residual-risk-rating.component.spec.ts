import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterResidualRiskRatingComponent } from './master-residual-risk-rating.component';

describe('MasterResidualRiskRatingComponent', () => {
  let component: MasterResidualRiskRatingComponent;
  let fixture: ComponentFixture<MasterResidualRiskRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterResidualRiskRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterResidualRiskRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
