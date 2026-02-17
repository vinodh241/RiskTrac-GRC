import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterControlEnvironmentComponent } from './master-control-environment.component';

describe('MasterControlEnvironmentComponent', () => {
  let component: MasterControlEnvironmentComponent;
  let fixture: ComponentFixture<MasterControlEnvironmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterControlEnvironmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterControlEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
