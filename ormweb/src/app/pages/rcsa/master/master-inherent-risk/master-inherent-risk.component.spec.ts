import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterInherentRiskComponent } from './master-inherent-risk.component';

describe('MasterInherentRiskComponent', () => {
  let component: MasterInherentRiskComponent;
  let fixture: ComponentFixture<MasterInherentRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterInherentRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterInherentRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
