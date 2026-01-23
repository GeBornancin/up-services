import { TestBed } from '@angular/core/testing';

import { Nurse } from './nurse';

describe('Nurse', () => {
  let service: Nurse;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nurse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
