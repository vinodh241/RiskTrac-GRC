import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditServiceproviderComponent } from './add-edit-serviceprovider.component';

describe('AddEditServiceproviderComponent', () => {
  let component: AddEditServiceproviderComponent;
  let fixture: ComponentFixture<AddEditServiceproviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditServiceproviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditServiceproviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
