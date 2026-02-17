import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriMigrationUnitComponent } from './kri-migration-unit.component';

describe('KriMigrationUnitComponent', () => {
  let component: KriMigrationUnitComponent;
  let fixture: ComponentFixture<KriMigrationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriMigrationUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriMigrationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
