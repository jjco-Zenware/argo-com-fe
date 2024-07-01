import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExcTransacComponent } from './modal-exc-transac.component';

describe('ModalExcTransacComponent', () => {
  let component: ModalExcTransacComponent;
  let fixture: ComponentFixture<ModalExcTransacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExcTransacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalExcTransacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
