import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskCategoryMastersComponent } from './risk-category.component';

describe('MastersComponent', () => {
  let component: RiskCategoryMastersComponent;
  let fixture: ComponentFixture<RiskCategoryMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskCategoryMastersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskCategoryMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
