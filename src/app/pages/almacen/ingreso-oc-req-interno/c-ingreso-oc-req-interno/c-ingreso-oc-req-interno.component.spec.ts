import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CIngresoOcReqInternoComponent } from './c-ingreso-oc-req-interno.component';

describe('CIngresoOcReqInternoComponent', () => {
  let component: CIngresoOcReqInternoComponent;
  let fixture: ComponentFixture<CIngresoOcReqInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CIngresoOcReqInternoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CIngresoOcReqInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
