import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserpasswordComponent } from './change-userpassword.component';

describe('ChangeUserpasswordComponent', () => {
  let component: ChangeUserpasswordComponent;
  let fixture: ComponentFixture<ChangeUserpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUserpasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeUserpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
