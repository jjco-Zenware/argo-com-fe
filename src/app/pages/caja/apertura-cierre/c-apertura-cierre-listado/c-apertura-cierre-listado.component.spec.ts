import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAperturaCierreListadoComponent } from './c-apertura-cierre-listado.component';

describe('CAperturaCierreListadoComponent', () => {
  let component: CAperturaCierreListadoComponent;
  let fixture: ComponentFixture<CAperturaCierreListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CAperturaCierreListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAperturaCierreListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
