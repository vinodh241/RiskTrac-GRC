import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriMeasurementMykriComponent } from './kri-measurement-mykri.component';

describe('KriMeasurementMykriComponent', () => {
  let component: KriMeasurementMykriComponent;
  let fixture: ComponentFixture<KriMeasurementMykriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriMeasurementMykriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriMeasurementMykriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
