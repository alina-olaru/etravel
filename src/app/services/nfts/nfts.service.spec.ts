/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NftsService } from './nfts.service';

describe('Service: Nfts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NftsService]
    });
  });

  it('should ...', inject([NftsService], (service: NftsService) => {
    expect(service).toBeTruthy();
  }));
});
