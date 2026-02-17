import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlInPaceComponent } from './control-in-pace.component';

describe('ControlInPaceComponent', () => {
  let component: ControlInPaceComponent;
  let fixture: ComponentFixture<ControlInPaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlInPaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlInPaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
