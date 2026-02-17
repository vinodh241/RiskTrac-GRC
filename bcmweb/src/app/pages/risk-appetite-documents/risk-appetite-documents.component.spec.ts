import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAppetiteDocumentsComponent } from './risk-appetite-documents.component';

describe('RiskAppetiteDocumentsComponent', () => {
  let component: RiskAppetiteDocumentsComponent;
  let fixture: ComponentFixture<RiskAppetiteDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAppetiteDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAppetiteDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
