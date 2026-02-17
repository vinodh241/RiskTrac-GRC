import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriDefinitionsComponent } from './kri-definitions.component';

describe('KriDefinitionsComponent', () => {
  let component: KriDefinitionsComponent;
  let fixture: ComponentFixture<KriDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriDefinitionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
