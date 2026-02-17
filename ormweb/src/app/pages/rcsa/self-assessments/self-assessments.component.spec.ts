import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfAssessmentsComponent } from './self-assessments.component';

describe('SelfAssessmentsComponent', () => {
  let component: SelfAssessmentsComponent;
  let fixture: ComponentFixture<SelfAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
