import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrisisCommsTemplateComponent } from './add-crisis-comms-template.component';

describe('AddCrisisCommsTemplateComponent', () => {
  let component: AddCrisisCommsTemplateComponent;
  let fixture: ComponentFixture<AddCrisisCommsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCrisisCommsTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCrisisCommsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
