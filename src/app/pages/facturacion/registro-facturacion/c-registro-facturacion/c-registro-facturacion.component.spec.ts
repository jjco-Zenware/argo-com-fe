import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRegistroFacturacionComponent } from './c-registro-facturacion.component';

describe('CRegistroFacturacionComponent', () => {
  let component: CRegistroFacturacionComponent;
  let fixture: ComponentFixture<CRegistroFacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRegistroFacturacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRegistroFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
