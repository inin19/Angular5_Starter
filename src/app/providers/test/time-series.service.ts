import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }).append(
    'Cache-control',
    'no-cache'
  )
};

@Injectable()
export class TimeSeriesService {

  private timeSeries = 'http://localhost:3000/timeseries';
  constructor(private http: HttpClient) { }


  getTimeSeriesData(): Observable<any> {
    const l: number = new Date().getMilliseconds();
    return this.http.get<any>(this.timeSeries + '?' + l, httpOptions);
  }

}


