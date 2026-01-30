import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmPuntoVentaComponent } from './cm-punto-venta.component';

describe('CmPuntoVentaComponent', () => {
  let component: CmPuntoVentaComponent;
  let fixture: ComponentFixture<CmPuntoVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmPuntoVentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmPuntoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
