import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidFileDetailsComponent } from './invalid-file-details.component';

describe('InvalidFileDetailsComponent', () => {
  let component: InvalidFileDetailsComponent;
  let fixture: ComponentFixture<InvalidFileDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvalidFileDetailsComponent]
    });
    fixture = TestBed.createComponent(InvalidFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
