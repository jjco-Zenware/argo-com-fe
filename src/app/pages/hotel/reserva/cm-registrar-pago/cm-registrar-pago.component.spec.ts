import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmRegistrarPagoComponent } from './cm-registrar-pago.component';

describe('CmRegistrarPagoComponent', () => {
  let component: CmRegistrarPagoComponent;
  let fixture: ComponentFixture<CmRegistrarPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmRegistrarPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmRegistrarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
