import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Selector } from '../model/utils/selector.model';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SelectorService {

  private regionSelectorSubject = new Subject<string[]>();
  private relationSelectorSubject = new Subject<string[]>();

  // region
  getRegionElement(): Observable<string[]> {
    return this.regionSelectorSubject.asObservable();
  }

  sendRegionElement(regionElement: string[]) {
    this.regionSelectorSubject.next(regionElement);
  }


  // relation
  getRelationElement(): Observable<string[]> {
    return this.relationSelectorSubject.asObservable();
  }
  sendRelationElement(relationElement: string[]) {
    this.relationSelectorSubject.next(relationElement);
  }


  constructor() { }

}
