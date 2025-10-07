import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCatalogoHabitacionDetalleComponent } from './c-catalogo-habitacion-detalle.component';

describe('CCatalogoHabitacionDetalleComponent', () => {
  let component: CCatalogoHabitacionDetalleComponent;
  let fixture: ComponentFixture<CCatalogoHabitacionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCatalogoHabitacionDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCatalogoHabitacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
