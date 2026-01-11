import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMantenimientoListadoComponent } from './c-mantenimiento-listado.component';

describe('CMantenimientoListadoComponent', () => {
  let component: CMantenimientoListadoComponent;
  let fixture: ComponentFixture<CMantenimientoListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CMantenimientoListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CMantenimientoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
