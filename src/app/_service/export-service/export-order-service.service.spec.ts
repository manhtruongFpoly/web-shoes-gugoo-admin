/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExportOrderServiceService } from './export-order-service.service';

describe('Service: ExportOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportOrderServiceService]
    });
  });

  it('should ...', inject([ExportOrderServiceService], (service: ExportOrderServiceService) => {
    expect(service).toBeTruthy();
  }));
});
