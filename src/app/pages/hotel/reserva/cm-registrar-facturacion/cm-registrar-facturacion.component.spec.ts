import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmRegistrarFacturacionComponent } from './cm-registrar-facturacion.component';

describe('CmRegistrarFacturacionComponent', () => {
  let component: CmRegistrarFacturacionComponent;
  let fixture: ComponentFixture<CmRegistrarFacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmRegistrarFacturacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmRegistrarFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
