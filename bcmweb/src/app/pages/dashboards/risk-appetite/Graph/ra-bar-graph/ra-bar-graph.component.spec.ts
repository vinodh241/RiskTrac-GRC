import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaBarGraphComponent } from './ra-bar-graph.component';

describe('RaBarGraphComponent', () => {
  let component: RaBarGraphComponent;
  let fixture: ComponentFixture<RaBarGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaBarGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
