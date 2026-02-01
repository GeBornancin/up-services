import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceModal } from './create-service-modal';

describe('CreateServiceModal', () => {
  let component: CreateServiceModal;
  let fixture: ComponentFixture<CreateServiceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateServiceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateServiceModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
