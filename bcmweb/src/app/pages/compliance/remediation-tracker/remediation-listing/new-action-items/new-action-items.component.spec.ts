import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActionItemsComponent } from './new-action-items.component';

describe('NewActionItemsComponent', () => {
  let component: NewActionItemsComponent;
  let fixture: ComponentFixture<NewActionItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewActionItemsComponent]
    });
    fixture = TestBed.createComponent(NewActionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
