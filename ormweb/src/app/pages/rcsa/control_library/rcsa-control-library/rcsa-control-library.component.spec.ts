import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcsaControlLibraryComponent } from './rcsa-control-library.component';

describe('RcsaControlLibraryComponent', () => {
  let component: RcsaControlLibraryComponent;
  let fixture: ComponentFixture<RcsaControlLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcsaControlLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RcsaControlLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
