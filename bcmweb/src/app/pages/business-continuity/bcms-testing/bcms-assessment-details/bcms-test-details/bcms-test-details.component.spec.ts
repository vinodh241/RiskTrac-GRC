import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmsTestDetailsComponent } from './bcms-test-details.component';

describe('BcmsTestDetailsComponent', () => {
  let component: BcmsTestDetailsComponent;
  let fixture: ComponentFixture<BcmsTestDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BcmsTestDetailsComponent]
    });
    fixture = TestBed.createComponent(BcmsTestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
