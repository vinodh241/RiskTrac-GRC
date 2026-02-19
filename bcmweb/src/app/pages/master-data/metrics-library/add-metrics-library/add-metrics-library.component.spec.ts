import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetricsLibraryComponent } from './add-metrics-library.component';

describe('AddMetricsLibraryComponent', () => {
  let component: AddMetricsLibraryComponent;
  let fixture: ComponentFixture<AddMetricsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMetricsLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMetricsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
