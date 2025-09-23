import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CIngresoPorTrasladoComponent } from './c-ingreso-por-traslado.component';

describe('CIngresoPorTrasladoComponent', () => {
  let component: CIngresoPorTrasladoComponent;
  let fixture: ComponentFixture<CIngresoPorTrasladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CIngresoPorTrasladoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CIngresoPorTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
