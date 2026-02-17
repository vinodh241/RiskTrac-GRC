import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEnvironmentComponent } from './control-environment.component';

describe('ControlEnvironmentComponent', () => {
  let component: ControlEnvironmentComponent;
  let fixture: ComponentFixture<ControlEnvironmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlEnvironmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
