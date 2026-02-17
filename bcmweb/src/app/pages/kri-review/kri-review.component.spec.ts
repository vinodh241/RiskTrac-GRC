import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriReviewComponent } from './kri-review.component';

describe('KriReviewComponent', () => {
  let component: KriReviewComponent;
  let fixture: ComponentFixture<KriReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
