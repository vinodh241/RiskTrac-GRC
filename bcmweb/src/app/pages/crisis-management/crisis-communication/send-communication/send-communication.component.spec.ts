import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCommunicationComponent } from './send-communication.component';

describe('SendCommunicationComponent', () => {
  let component: SendCommunicationComponent;
  let fixture: ComponentFixture<SendCommunicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendCommunicationComponent]
    });
    fixture = TestBed.createComponent(SendCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
