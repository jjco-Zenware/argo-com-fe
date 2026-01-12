import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmAgregarHabitacionComponent } from './cm-agregar-habitacion.component';

describe('CmAgregarHabitacionComponent', () => {
  let component: CmAgregarHabitacionComponent;
  let fixture: ComponentFixture<CmAgregarHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmAgregarHabitacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmAgregarHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
