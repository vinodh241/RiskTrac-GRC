import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRiskComponent } from './update-risk.component';

describe('UpdateRiskComponent', () => {
  let component: UpdateRiskComponent;
  let fixture: ComponentFixture<UpdateRiskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateRiskComponent]
    });
    fixture = TestBed.createComponent(UpdateRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
