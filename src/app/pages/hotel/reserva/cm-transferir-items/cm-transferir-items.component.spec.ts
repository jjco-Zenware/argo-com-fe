import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmTransferirItemsComponent } from './cm-transferir-items.component';

describe('CmTransferirItemsComponent', () => {
  let component: CmTransferirItemsComponent;
  let fixture: ComponentFixture<CmTransferirItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmTransferirItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmTransferirItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
