import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUnitComponent } from './group-unit.component';

describe('GroupUnitComponent', () => {
  let component: GroupUnitComponent;
  let fixture: ComponentFixture<GroupUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
