import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReviewCommentsComponent } from './submit-review-comments.component';

describe('SubmitReviewCommentsComponent', () => {
  let component: SubmitReviewCommentsComponent;
  let fixture: ComponentFixture<SubmitReviewCommentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitReviewCommentsComponent]
    });
    fixture = TestBed.createComponent(SubmitReviewCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
