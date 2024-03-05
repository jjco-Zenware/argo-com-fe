import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COrdenDespachoComponent } from './c-orden-despacho.component';

describe('COrdenDespachoComponent', () => {
  let component: COrdenDespachoComponent;
  let fixture: ComponentFixture<COrdenDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ COrdenDespachoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COrdenDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
