import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPuntoVentaListadoComponent } from './c-punto-venta-listado.component';

describe('CPuntoVentaListadoComponent', () => {
  let component: CPuntoVentaListadoComponent;
  let fixture: ComponentFixture<CPuntoVentaListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPuntoVentaListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPuntoVentaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
