import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CwPopupComponent } from './cw-popup.component';

describe('CwPopupComponent', () => {
  let component: CwPopupComponent;
  let fixture: ComponentFixture<CwPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CwPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CwPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
