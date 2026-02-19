import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBusinessPopupComponent } from './new-business-popup.component';

describe('NewBusinessPopupComponent', () => {
  let component: NewBusinessPopupComponent;
  let fixture: ComponentFixture<NewBusinessPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBusinessPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBusinessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
