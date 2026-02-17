import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RscaViewAllComponent } from './risk-viewall.component';

describe('RscaViewAllComponent', () => {
  let component: RscaViewAllComponent;
  let fixture: ComponentFixture<RscaViewAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RscaViewAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RscaViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
