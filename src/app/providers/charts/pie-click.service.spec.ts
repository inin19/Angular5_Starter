import { TestBed, inject } from '@angular/core/testing';

import { PieClickService } from './pie-click.service';

describe('PieClickService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PieClickService]
    });
  });

  it('should be created', inject([PieClickService], (service: PieClickService) => {
    expect(service).toBeTruthy();
  }));
});
