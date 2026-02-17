import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInherentRiskComponent } from './new-inherent-risk.component';

describe('NewInherentRiskComponent', () => {
  let component: NewInherentRiskComponent;
  let fixture: ComponentFixture<NewInherentRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewInherentRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewInherentRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
