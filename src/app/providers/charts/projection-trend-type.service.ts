import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ProjectionTrendTypeService {

  private trendType = new Subject<string>();

  constructor() { }

  sendPlanType(trendType: string) {
    this.trendType.next(trendType);
  }

  get trendType$() {
    return this.trendType.asObservable();
  }
}
