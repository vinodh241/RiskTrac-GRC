import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailsMoreComponent } from './incident-details-more.component';

describe('IncidentDetailsMoreComponent', () => {
  let component: IncidentDetailsMoreComponent;
  let fixture: ComponentFixture<IncidentDetailsMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentDetailsMoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentDetailsMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
