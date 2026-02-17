import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcsaOverallComponent } from './rcsa-overall.component';

describe('RcsaOverallComponent', () => {
  let component: RcsaOverallComponent;
  let fixture: ComponentFixture<RcsaOverallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcsaOverallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RcsaOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
