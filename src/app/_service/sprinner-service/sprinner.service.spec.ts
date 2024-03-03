/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SprinnerService } from './sprinner.service';

describe('Service: Sprinner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SprinnerService]
    });
  });

  it('should ...', inject([SprinnerService], (service: SprinnerService) => {
    expect(service).toBeTruthy();
  }));
});
