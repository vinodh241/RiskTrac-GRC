import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RscaOverallPopupComponent } from './rsca-overall-popups.component';

describe('RscaOverallPopupComponent', () => {
  let component: RscaOverallPopupComponent;
  let fixture: ComponentFixture<RscaOverallPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RscaOverallPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RscaOverallPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
