import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CChatComponent } from './c-chat.component';

describe('CChatComponent', () => {
  let component: CChatComponent;
  let fixture: ComponentFixture<CChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
