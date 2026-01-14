import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmMantenimientoCajaComponent } from './cm-mantenimiento-caja.component';

describe('CmMantenimientoCajaComponent', () => {
  let component: CmMantenimientoCajaComponent;
  let fixture: ComponentFixture<CmMantenimientoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmMantenimientoCajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmMantenimientoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
