import { TestBed, inject } from '@angular/core/testing';

import { ProjectionTrendTypeService } from './projection-trend-type.service';

describe('ProjectionTrendTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectionTrendTypeService]
    });
  });

  it('should be created', inject([ProjectionTrendTypeService], (service: ProjectionTrendTypeService) => {
    expect(service).toBeTruthy();
  }));
});
