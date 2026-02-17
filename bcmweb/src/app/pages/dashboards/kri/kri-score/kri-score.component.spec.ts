import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriScoreComponent } from './kri-score.component';

describe('KriScoreComponent', () => {
  let component: KriScoreComponent;
  let fixture: ComponentFixture<KriScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
