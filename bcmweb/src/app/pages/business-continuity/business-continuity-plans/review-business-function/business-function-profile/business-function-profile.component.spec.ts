import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFunctionProfileComponent } from './business-function-profile.component';

describe('BusinessFunctionProfileComponent', () => {
  let component: BusinessFunctionProfileComponent;
  let fixture: ComponentFixture<BusinessFunctionProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessFunctionProfileComponent]
    });
    fixture = TestBed.createComponent(BusinessFunctionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
