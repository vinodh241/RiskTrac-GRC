import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestParticipantReportComponent } from './test-participant-report.component';

describe('TestParticipantReportComponent', () => {
  let component: TestParticipantReportComponent;
  let fixture: ComponentFixture<TestParticipantReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestParticipantReportComponent]
    });
    fixture = TestBed.createComponent(TestParticipantReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
