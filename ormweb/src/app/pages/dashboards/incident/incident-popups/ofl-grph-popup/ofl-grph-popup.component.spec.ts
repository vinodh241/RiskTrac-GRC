import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OflGrphPopupComponent } from './ofl-grph-popup.component';

describe('OflGrphPopupComponent', () => {
  let component: OflGrphPopupComponent;
  let fixture: ComponentFixture<OflGrphPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OflGrphPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OflGrphPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
