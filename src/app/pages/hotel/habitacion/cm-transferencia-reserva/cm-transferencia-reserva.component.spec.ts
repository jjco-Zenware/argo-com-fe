import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmTransferenciaReservaComponent } from './cm-transferencia-reserva.component';

describe('CmTransferenciaReservaComponent', () => {
  let component: CmTransferenciaReservaComponent;
  let fixture: ComponentFixture<CmTransferenciaReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmTransferenciaReservaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmTransferenciaReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
