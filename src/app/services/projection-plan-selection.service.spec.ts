import { TestBed, inject } from '@angular/core/testing';

import { ProjectionPlanSelectionService } from './projection-plan-selection.service';

describe('ProjectionPlanSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectionPlanSelectionService]
    });
  });

  it('should be created', inject([ProjectionPlanSelectionService], (service: ProjectionPlanSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
