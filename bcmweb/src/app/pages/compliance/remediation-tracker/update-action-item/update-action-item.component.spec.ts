import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateActionItemComponent } from './update-action-item.component';

describe('UpdateActionItemComponent', () => {
  let component: UpdateActionItemComponent;
  let fixture: ComponentFixture<UpdateActionItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateActionItemComponent]
    });
    fixture = TestBed.createComponent(UpdateActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
