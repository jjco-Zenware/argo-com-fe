import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COrdenCompraServicioComponent } from './c-orden-compra-servicio.component';

describe('COrdenCompraServicioComponent', () => {
  let component: COrdenCompraServicioComponent;
  let fixture: ComponentFixture<COrdenCompraServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ COrdenCompraServicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COrdenCompraServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
