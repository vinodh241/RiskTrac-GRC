import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriUnitComponent } from './kri-unit.component';

describe('KriUnitComponent', () => {
  let component: KriUnitComponent;
  let fixture: ComponentFixture<KriUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
