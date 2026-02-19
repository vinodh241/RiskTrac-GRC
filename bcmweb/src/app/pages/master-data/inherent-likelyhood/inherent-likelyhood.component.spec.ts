import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InherentLikelyhoodComponent } from './inherent-likelyhood.component';

describe('InherentLikelyhoodComponent', () => {
  let component: InherentLikelyhoodComponent;
  let fixture: ComponentFixture<InherentLikelyhoodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InherentLikelyhoodComponent]
    });
    fixture = TestBed.createComponent(InherentLikelyhoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
