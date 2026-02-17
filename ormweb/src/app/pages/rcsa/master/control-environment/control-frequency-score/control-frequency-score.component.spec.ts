import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFrequencyScoreComponent } from './control-frequency-score.component';

describe('ControlFrequencyScoreComponent', () => {
  let component: ControlFrequencyScoreComponent;
  let fixture: ComponentFixture<ControlFrequencyScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlFrequencyScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlFrequencyScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
