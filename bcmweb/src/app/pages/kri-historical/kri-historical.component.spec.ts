import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriHistoricalComponent } from './kri-historical.component';

describe('KriHistoricalComponent', () => {
  let component: KriHistoricalComponent;
  let fixture: ComponentFixture<KriHistoricalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriHistoricalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
