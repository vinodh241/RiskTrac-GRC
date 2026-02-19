import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateBCPComponent } from './initiate-bcp.component';

describe('InitiateBCPComponent', () => {
  let component: InitiateBCPComponent;
  let fixture: ComponentFixture<InitiateBCPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitiateBCPComponent]
    });
    fixture = TestBed.createComponent(InitiateBCPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
