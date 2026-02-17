import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriOverallComponent } from './kri-overall.component';

describe('KriOverallComponent', () => {
  let component: KriOverallComponent;
  let fixture: ComponentFixture<KriOverallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriOverallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
