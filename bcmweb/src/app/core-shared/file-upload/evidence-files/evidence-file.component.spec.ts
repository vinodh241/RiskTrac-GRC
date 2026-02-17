import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceFileComponent } from './evidence-file.component';

describe('EvidenceFileComponent', () => {
  let component: EvidenceFileComponent;
  let fixture: ComponentFixture<EvidenceFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenceFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenceFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
