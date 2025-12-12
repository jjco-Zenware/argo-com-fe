import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRptHabitacionComponent } from './c-rpt-habitacion.component';

describe('CRptHabitacionComponent', () => {
  let component: CRptHabitacionComponent;
  let fixture: ComponentFixture<CRptHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRptHabitacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRptHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
