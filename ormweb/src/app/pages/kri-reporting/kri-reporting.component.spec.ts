import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriReportingComponent } from './kri-reporting.component';

describe('KriReportingComponent', () => {
  let component: KriReportingComponent;
  let fixture: ComponentFixture<KriReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriReportingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
