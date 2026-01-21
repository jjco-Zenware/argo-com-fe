import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRoomingListResumenComponent } from './c-rooming-list-resumen.component';

describe('CRoomingListResumenComponent', () => {
  let component: CRoomingListResumenComponent;
  let fixture: ComponentFixture<CRoomingListResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRoomingListResumenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRoomingListResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
