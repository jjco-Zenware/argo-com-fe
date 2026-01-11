import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMovEntradaListadoComponent } from './c-mov-entrada-listado.component';

describe('CMovEntradaListadoComponent', () => {
  let component: CMovEntradaListadoComponent;
  let fixture: ComponentFixture<CMovEntradaListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CMovEntradaListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CMovEntradaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
