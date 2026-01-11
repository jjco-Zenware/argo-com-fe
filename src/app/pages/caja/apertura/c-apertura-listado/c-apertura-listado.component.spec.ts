import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAperturaListadoComponent } from './c-apertura-listado.component';

describe('CAperturaListadoComponent', () => {
  let component: CAperturaListadoComponent;
  let fixture: ComponentFixture<CAperturaListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CAperturaListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAperturaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
