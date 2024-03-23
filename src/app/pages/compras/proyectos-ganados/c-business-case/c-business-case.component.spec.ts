import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBusinessCaseComponent } from './c-business-case.component';

describe('CBusinessCaseComponent', () => {
  let component: CBusinessCaseComponent;
  let fixture: ComponentFixture<CBusinessCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CBusinessCaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CBusinessCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
