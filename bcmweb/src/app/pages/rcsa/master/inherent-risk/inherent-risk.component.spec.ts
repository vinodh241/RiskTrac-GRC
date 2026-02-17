import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InherentRiskComponent } from './inherent-risk.component';

describe('RcsaMastersComponent', () => {
  let component: InherentRiskComponent;
  let fixture: ComponentFixture<InherentRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InherentRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InherentRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
