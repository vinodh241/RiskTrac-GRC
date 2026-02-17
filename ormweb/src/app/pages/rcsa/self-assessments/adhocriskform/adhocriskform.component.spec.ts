import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocriskformComponent } from './adhocriskform.component';

describe('AdhocriskformComponent', () => {
  let component: AdhocriskformComponent;
  let fixture: ComponentFixture<AdhocriskformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdhocriskformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdhocriskformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
