import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCierreListadoComponent } from './c-cierre-listado.component';

describe('CCierreListadoComponent', () => {
  let component: CCierreListadoComponent;
  let fixture: ComponentFixture<CCierreListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCierreListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCierreListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
