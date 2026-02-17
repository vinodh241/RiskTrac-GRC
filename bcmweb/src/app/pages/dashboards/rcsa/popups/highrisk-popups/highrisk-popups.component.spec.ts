import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighRiskPopupComponent } from './highrisk-popups.component';

describe('HighRiskPopupComponent', () => {
  let component: HighRiskPopupComponent;
  let fixture: ComponentFixture<HighRiskPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighRiskPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighRiskPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
