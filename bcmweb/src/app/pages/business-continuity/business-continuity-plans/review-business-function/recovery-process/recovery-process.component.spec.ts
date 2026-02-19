import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryProcessComponent } from './recovery-process.component';

describe('RecoveryProcessComponent', () => {
  let component: RecoveryProcessComponent;
  let fixture: ComponentFixture<RecoveryProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecoveryProcessComponent]
    });
    fixture = TestBed.createComponent(RecoveryProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
