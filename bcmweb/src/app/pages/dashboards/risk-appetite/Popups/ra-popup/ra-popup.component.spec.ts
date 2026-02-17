import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaPopupComponent } from './ra-popup.component';

describe('RaPopupComponent', () => {
  let component: RaPopupComponent;
  let fixture: ComponentFixture<RaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
