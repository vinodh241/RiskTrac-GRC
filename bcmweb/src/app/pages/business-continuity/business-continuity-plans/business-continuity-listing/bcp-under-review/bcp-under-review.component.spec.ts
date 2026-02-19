import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpUnderReviewComponent } from './bcp-under-review.component';

describe('BcpUnderReviewComponent', () => {
  let component: BcpUnderReviewComponent;
  let fixture: ComponentFixture<BcpUnderReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BcpUnderReviewComponent]
    });
    fixture = TestBed.createComponent(BcpUnderReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
