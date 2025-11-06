import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCatalogoHabitacionComponent } from './c-catalogo-habitacion.component';

describe('CCatalogoHabitacionComponent', () => {
  let component: CCatalogoHabitacionComponent;
  let fixture: ComponentFixture<CCatalogoHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCatalogoHabitacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCatalogoHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
