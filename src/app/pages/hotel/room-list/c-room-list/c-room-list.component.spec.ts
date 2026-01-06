import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRoomListComponent } from './c-room-list.component';

describe('CRoomListComponent', () => {
  let component: CRoomListComponent;
  let fixture: ComponentFixture<CRoomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRoomListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
