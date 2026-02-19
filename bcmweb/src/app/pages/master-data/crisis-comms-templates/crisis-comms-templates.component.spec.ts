import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisisCommsTemplatesComponent } from './crisis-comms-templates.component';

describe('CrisisCommsTemplatesComponent', () => {
  let component: CrisisCommsTemplatesComponent;
  let fixture: ComponentFixture<CrisisCommsTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisisCommsTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrisisCommsTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
