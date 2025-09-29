import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CIngresoOcProyectoComponent } from './c-ingreso-oc-proyecto.component';

describe('CIngresoOcProyectoComponent', () => {
  let component: CIngresoOcProyectoComponent;
  let fixture: ComponentFixture<CIngresoOcProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CIngresoOcProyectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CIngresoOcProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
