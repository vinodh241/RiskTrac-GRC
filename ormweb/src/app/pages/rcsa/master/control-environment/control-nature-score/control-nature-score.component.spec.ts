import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlNatureScoreComponent } from './control-nature-score.component';

describe('ControlNatureScoreComponent', () => {
  let component: ControlNatureScoreComponent;
  let fixture: ComponentFixture<ControlNatureScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlNatureScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlNatureScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
