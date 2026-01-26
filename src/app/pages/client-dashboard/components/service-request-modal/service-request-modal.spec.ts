import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestModal } from './service-request-modal';

describe('ServiceRequestModal', () => {
  let component: ServiceRequestModal;
  let fixture: ComponentFixture<ServiceRequestModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
