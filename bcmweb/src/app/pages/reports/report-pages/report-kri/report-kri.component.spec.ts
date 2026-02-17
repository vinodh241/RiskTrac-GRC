import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportKriComponent } from './report-kri.component';

describe('ReportKriComponent', () => {
  let component: ReportKriComponent;
  let fixture: ComponentFixture<ReportKriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportKriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportKriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
