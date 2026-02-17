import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmPopupComponent } from './cm-popup.component';

describe('CmPopupComponent', () => {
  let component: CmPopupComponent;
  let fixture: ComponentFixture<CmPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
