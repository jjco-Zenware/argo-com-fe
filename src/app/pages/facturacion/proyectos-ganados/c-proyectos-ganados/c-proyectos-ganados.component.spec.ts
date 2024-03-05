import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CProyectosGanadosComponent } from './c-proyectos-ganados.component';

describe('CProyectosGanadosComponent', () => {
  let component: CProyectosGanadosComponent;
  let fixture: ComponentFixture<CProyectosGanadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CProyectosGanadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CProyectosGanadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
