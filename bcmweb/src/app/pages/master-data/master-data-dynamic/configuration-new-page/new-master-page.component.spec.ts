import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMasterPageComponent } from './new-master-page.component';

describe('NewMasterPageComponent', () => {
  let component: NewMasterPageComponent;
  let fixture: ComponentFixture<NewMasterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMasterPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
