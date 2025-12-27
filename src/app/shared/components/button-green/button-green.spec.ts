import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGreen } from './button-green';

describe('ButtonGreen', () => {
  let component: ButtonGreen;
  let fixture: ComponentFixture<ButtonGreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonGreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
