import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAutomationScoreComponent } from './control-automation-score.component';

describe('ControlAutomationScoreComponent', () => {
  let component: ControlAutomationScoreComponent;
  let fixture: ComponentFixture<ControlAutomationScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAutomationScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlAutomationScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
