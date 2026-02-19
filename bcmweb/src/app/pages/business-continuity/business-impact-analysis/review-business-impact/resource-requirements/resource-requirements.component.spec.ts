import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceRequirementsComponent } from './resource-requirements.component';

describe('ResourceRequirementsComponent', () => {
  let component: ResourceRequirementsComponent;
  let fixture: ComponentFixture<ResourceRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceRequirementsComponent]
    });
    fixture = TestBed.createComponent(ResourceRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
