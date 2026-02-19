import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSiteRiskComponent } from './add-edit-site-risk.component';

describe('AddEditSiteRiskComponent', () => {
  let component: AddEditSiteRiskComponent;
  let fixture: ComponentFixture<AddEditSiteRiskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditSiteRiskComponent]
    });
    fixture = TestBed.createComponent(AddEditSiteRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
