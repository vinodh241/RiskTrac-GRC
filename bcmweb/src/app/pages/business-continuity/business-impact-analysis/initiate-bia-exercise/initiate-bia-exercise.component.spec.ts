import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateBiaExerciseComponent } from './initiate-bia-exercise.component';

describe('InitiateBiaExerciseComponent', () => {
  let component: InitiateBiaExerciseComponent;
  let fixture: ComponentFixture<InitiateBiaExerciseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitiateBiaExerciseComponent]
    });
    fixture = TestBed.createComponent(InitiateBiaExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
