import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RscaPopupComponent } from './rsca-popups.component';

describe('RscaPopupComponent', () => {
  let component: RscaPopupComponent;
  let fixture: ComponentFixture<RscaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RscaPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RscaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
