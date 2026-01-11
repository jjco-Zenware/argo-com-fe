import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMovSalidaListadoComponent } from './c-mov-salida-listado.component';

describe('CMovSalidaListadoComponent', () => {
  let component: CMovSalidaListadoComponent;
  let fixture: ComponentFixture<CMovSalidaListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CMovSalidaListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CMovSalidaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
