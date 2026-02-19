import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCommentsHistoryComponent } from './review-comments-history.component';

describe('ReviewCommentsHistoryComponent', () => {
  let component: ReviewCommentsHistoryComponent;
  let fixture: ComponentFixture<ReviewCommentsHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewCommentsHistoryComponent]
    });
    fixture = TestBed.createComponent(ReviewCommentsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
