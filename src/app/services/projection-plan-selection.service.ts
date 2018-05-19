import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectionPlanSelectionService {

  private planSubject = new Subject<number[]>();


  constructor() { }


  sendPlans(plans: number[]) {
    this.planSubject.next(plans);
  }


  get plans$() {
    return this.planSubject.asObservable();
  }

}
