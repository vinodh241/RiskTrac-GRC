import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsaDashboardComponent } from './rcsa.component';

describe('RsaDashboardComponent', () => {
  let component: RsaDashboardComponent;
  let fixture: ComponentFixture<RsaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsaDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
