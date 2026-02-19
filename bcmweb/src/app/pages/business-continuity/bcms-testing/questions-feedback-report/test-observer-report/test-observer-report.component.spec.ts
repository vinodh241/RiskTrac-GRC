import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestObserverReportComponent } from './test-observer-report.component';

describe('TestObserverReportComponent', () => {
  let component: TestObserverReportComponent;
  let fixture: ComponentFixture<TestObserverReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestObserverReportComponent]
    });
    fixture = TestBed.createComponent(TestObserverReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
