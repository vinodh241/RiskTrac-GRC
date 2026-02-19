import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpCoverageWidgetComponent } from './bcp-coverage-widget.component';

describe('BcpCoverageWidgetComponent', () => {
  let component: BcpCoverageWidgetComponent;
  let fixture: ComponentFixture<BcpCoverageWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BcpCoverageWidgetComponent]
    });
    fixture = TestBed.createComponent(BcpCoverageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
