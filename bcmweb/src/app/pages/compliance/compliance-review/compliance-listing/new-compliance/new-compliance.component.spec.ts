import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComplianceComponent } from './new-compliance.component';

describe('NewComplianceComponent', () => {
  let component: NewComplianceComponent;
  let fixture: ComponentFixture<NewComplianceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewComplianceComponent]
    });
    fixture = TestBed.createComponent(NewComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
