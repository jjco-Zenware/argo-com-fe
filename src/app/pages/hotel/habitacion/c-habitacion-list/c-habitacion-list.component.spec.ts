import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CHabitacionListComponent } from './c-habitacion-list.component';

describe('CHabitacionListComponent', () => {
  let component: CHabitacionListComponent;
  let fixture: ComponentFixture<CHabitacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CHabitacionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CHabitacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
