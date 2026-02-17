import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditRcsaControlComponent } from './addedit-rcsa-control.component';

describe('AddeditRcsaControlComponent', () => {
  let component: AddeditRcsaControlComponent;
  let fixture: ComponentFixture<AddeditRcsaControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddeditRcsaControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditRcsaControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
