import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriPopupComponent } from './kri-popup.component';

describe('KriPopupComponent', () => {
  let component: KriPopupComponent;
  let fixture: ComponentFixture<KriPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
