import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFunctionPopupComponent } from './business-function-popup.component';

describe('BusinessFunctionPopupComponent', () => {
  let component: BusinessFunctionPopupComponent;
  let fixture: ComponentFixture<BusinessFunctionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessFunctionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessFunctionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
