import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTotalScoreComponent } from './control-total-score.component';

describe('ControlTotalScoreComponent', () => {
  let component: ControlTotalScoreComponent;
  let fixture: ComponentFixture<ControlTotalScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlTotalScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlTotalScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
