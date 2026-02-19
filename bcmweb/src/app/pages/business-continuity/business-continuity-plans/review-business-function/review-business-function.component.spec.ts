import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewBusinessFunctionComponent } from './review-business-function.component';

describe('ReviewBusinessFunctionComponent', () => {
  let component: ReviewBusinessFunctionComponent;
  let fixture: ComponentFixture<ReviewBusinessFunctionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewBusinessFunctionComponent]
    });
    fixture = TestBed.createComponent(ReviewBusinessFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
