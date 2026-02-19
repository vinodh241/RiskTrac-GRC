import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionItemProgressComponent } from './action-item-progress.component';

describe('ActionItemProgressComponent', () => {
  let component: ActionItemProgressComponent;
  let fixture: ComponentFixture<ActionItemProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionItemProgressComponent]
    });
    fixture = TestBed.createComponent(ActionItemProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
