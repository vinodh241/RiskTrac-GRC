import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThreatComponent } from './add-threat.component';

describe('AddThreatComponent', () => {
  let component: AddThreatComponent;
  let fixture: ComponentFixture<AddThreatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddThreatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddThreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
