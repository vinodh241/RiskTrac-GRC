import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInputMasterComponent } from './add-input-master.component';

describe('AddInputMasterComponent', () => {
  let component: AddInputMasterComponent;
  let fixture: ComponentFixture<AddInputMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInputMasterComponent]
    });
    fixture = TestBed.createComponent(AddInputMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
