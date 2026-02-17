import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmViewallComponent } from './cm-viewall.component';

describe('CmViewallComponent', () => {
  let component: CmViewallComponent;
  let fixture: ComponentFixture<CmViewallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmViewallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmViewallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
