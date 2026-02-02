import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonRed } from './button-red';

describe('ButtonRed', () => {
  let component: ButtonRed;
  let fixture: ComponentFixture<ButtonRed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonRed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonRed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
