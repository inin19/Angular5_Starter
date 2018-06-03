import { ErrorHandler } from './../common/logging/error-handler';
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
export class ProjectionService extends ErrorHandler {

  // http://localhost:50003/calculate/ISO2_GB/177/BENCHMARK?25

  // private proposalId = 177;
  // private country = 'ISO2_GB';
  // private trendType = 'BENCHMARK';

  private projectionPlanUrlModified = 'http://localhost:50001/bmservices/calculate/';



  private projectionLocal = 'http://localhost:3000/projection';

  private projectionLocal2 = 'http://localhost:3000/projection3';


  private scatterplot = 'http://localhost:3000/scatterplot';

  private lossratio = 'http://localhost:3000/lossratio';
  private lossratioNew = 'http://localhost:3000/lossratioNew';

  constructor(private http: HttpClient, injector: Injector) {
    super(injector);
  }


  // getProjectionData(country: string, proposalId: string, trendType: string ): Observable<any> {
  //   const l: number = new Date().getMilliseconds();
  //   return this.http.get<any>(this.projectionPlanUrlModified + country + '/' + proposalId + '/' + trendType + '?' + l, httpOptions);
  // }


  // local

  // getProjectionData(country: string, proposalId: string, trendType: string): Observable<any> {
  //   const l: number = new Date().getMilliseconds();
  //   return this.http.get<any>(this.projectionLocal + '?' + l, httpOptions);
  // }


  getProjectionData(country: string, proposalId: string, trendType: string, source: boolean): Observable<any> {
    const l: number = new Date().getMilliseconds();
    if (source === true) {
      return this.http.get<any>(this.projectionLocal + '?' + l, httpOptions);
    } else {
      return this.http.get<any>(this.projectionLocal2 + '?' + l, httpOptions);

    }
  }

  // getScatterPlotData(): Observable<any> {
  //   const l: number = new Date().getMilliseconds();
  //   return this.http.get<any>(this.scatterplot + '?' + l, httpOptions);
  // }

  getLossRatio(): Observable<any> {
    const l: number = new Date().getMilliseconds();
    return this.http.get<any>(this.lossratio + '?' + l, httpOptions);
  }


  getLossRatioNew(): Observable<any> {
    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get<Array<any>>(this.lossratio + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.lossratioNew + '?' + l, httpOptions),
    );


  }




}
