import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateActionItemListComponent } from './update-action-item-list.component';

describe('UpdateActionItemListComponent', () => {
  let component: UpdateActionItemListComponent;
  let fixture: ComponentFixture<UpdateActionItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateActionItemListComponent]
    });
    fixture = TestBed.createComponent(UpdateActionItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
