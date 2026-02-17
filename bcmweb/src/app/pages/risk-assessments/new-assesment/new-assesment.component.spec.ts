import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssesmentComponent } from './new-assesment.component';

describe('NewAssesmentComponent', () => {
  let component: NewAssesmentComponent;
  let fixture: ComponentFixture<NewAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAssesmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
