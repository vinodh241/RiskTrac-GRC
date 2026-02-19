import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionItemDetailsComponent } from './action-item-details.component';

describe('ActionItemDetailsComponent', () => {
  let component: ActionItemDetailsComponent;
  let fixture: ComponentFixture<ActionItemDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionItemDetailsComponent]
    });
    fixture = TestBed.createComponent(ActionItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
