import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmReservaHabitacionComponent } from './cm-reserva-habitacion.component';

describe('CmReservaHabitacionComponent', () => {
  let component: CmReservaHabitacionComponent;
  let fixture: ComponentFixture<CmReservaHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmReservaHabitacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmReservaHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
