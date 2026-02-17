import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriDefinitionComponent } from './kri-definition.component';

describe('KriDefinitionComponent', () => {
  let component: KriDefinitionComponent;
  let fixture: ComponentFixture<KriDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
