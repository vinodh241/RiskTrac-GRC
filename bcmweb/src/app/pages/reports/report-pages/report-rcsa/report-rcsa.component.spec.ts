import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRcsaComponent } from './report-rcsa.component';

describe('ReportRcsaComponent', () => {
  let component: ReportRcsaComponent;
  let fixture: ComponentFixture<ReportRcsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRcsaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportRcsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
