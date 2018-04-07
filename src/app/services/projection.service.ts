import { ActivatedRoute } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/forkJoin';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }).append(
    'Cache-control',
    'no-cache'
  )
};

@Injectable()
export class ProjectionService {

  private proposalId: string;

  private projectionUrl = 'http://localhost:3000/projection';




  constructor(private http: HttpClient, injector: Injector, private activatedRoute: ActivatedRoute) {
  }


  getProjectionData(): Observable<any> {
    const l: number = new Date().getMilliseconds();
    return this.http.get(this.projectionUrl + '?' + l, httpOptions);
  }

}
