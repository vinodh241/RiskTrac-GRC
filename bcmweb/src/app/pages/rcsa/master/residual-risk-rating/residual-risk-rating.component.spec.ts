import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidualRiskRatingComponent } from './residual-risk-rating.component';

describe('ResidualRiskRatingComponent', () => {
  let component: ResidualRiskRatingComponent;
  let fixture: ComponentFixture<ResidualRiskRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidualRiskRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidualRiskRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
