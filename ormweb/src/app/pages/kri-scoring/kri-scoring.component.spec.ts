import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriScoringComponent } from './kri-scoring.component';

describe('KriScoringComponent', () => {
  let component: KriScoringComponent;
  let fixture: ComponentFixture<KriScoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriScoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
