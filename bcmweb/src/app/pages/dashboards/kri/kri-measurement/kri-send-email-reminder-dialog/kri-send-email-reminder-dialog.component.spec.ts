import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriSendEmailReminderDialogComponent } from './kri-send-email-reminder-dialog.component';

describe('KriSendEmailReminderDialogComponent', () => {
  let component: KriSendEmailReminderDialogComponent;
  let fixture: ComponentFixture<KriSendEmailReminderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriSendEmailReminderDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriSendEmailReminderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
