import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPuntoVentaDatoComponent } from './c-punto-venta-dato.component';

describe('CPuntoVentaDatoComponent', () => {
  let component: CPuntoVentaDatoComponent;
  let fixture: ComponentFixture<CPuntoVentaDatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPuntoVentaDatoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPuntoVentaDatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
