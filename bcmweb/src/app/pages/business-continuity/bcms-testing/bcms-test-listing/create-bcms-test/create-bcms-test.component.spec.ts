import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBcmsTestComponent } from './create-bcms-test.component';

describe('CreateBcmsTestComponent', () => {
  let component: CreateBcmsTestComponent;
  let fixture: ComponentFixture<CreateBcmsTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBcmsTestComponent]
    });
    fixture = TestBed.createComponent(CreateBcmsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
