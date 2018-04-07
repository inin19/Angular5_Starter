import { TestBed, inject } from '@angular/core/testing';

import { ProjectionService } from './projection.service';

describe('ProjectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectionService]
    });
  });

  it('should be created', inject([ProjectionService], (service: ProjectionService) => {
    expect(service).toBeTruthy();
  }));
});
