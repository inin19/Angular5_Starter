import { TestBed, inject } from '@angular/core/testing';

import { DemographicService } from './demographic.service';

describe('DemographicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemographicService]
    });
  });

  it('should be created', inject([DemographicService], (service: DemographicService) => {
    expect(service).toBeTruthy();
  }));
});
