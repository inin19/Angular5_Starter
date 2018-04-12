import { TestBed, inject } from '@angular/core/testing';

import { MinimizeService } from './minimize.service';

describe('MinimizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MinimizeService]
    });
  });

  it('should be created', inject([MinimizeService], (service: MinimizeService) => {
    expect(service).toBeTruthy();
  }));
});
