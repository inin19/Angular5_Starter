import { ActivatedRoute } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }).append(
    'Cache-control',
    'no-cache'
  )
};



@Injectable()
export class ClaimDataService {


  private benchmarkClaimDataUrl = 'http://localhost:3000/benchmarkClaims';  // URL to web api
  private benchmarkTotalMemberDataUrl = 'http://localhost:3000/benchmarkMemberCount';

  private proposalClaimDataUrl = 'http://localhost:3000/benchmarkClaims';  // URL to web api
  private proposalTotalMemberDataUrl = 'http://localhost:3000/benchmarkMemberCount';



  constructor(private http: HttpClient, injector: Injector) { }



  /** GET claims from the server */
  getBenchmarkClaimsData1(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.benchmarkClaimDataUrl);
  }


  /** GET claims from the server */
  getBenchmarkMemberCount1(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl);
  }



  // if proposal has no claim data
  getBenchmarkClaimsDataTotalMemberCount() {
    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get<Array<any>>(this.benchmarkClaimDataUrl + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl + '?' + l, httpOptions)
    );
  }

  // if proposal has claim data
  getBenchmarkPropocalClaimsDataTotalMemberCount() {
    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get<Array<any>>(this.benchmarkClaimDataUrl + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.proposalClaimDataUrl + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.proposalTotalMemberDataUrl + '?' + l, httpOptions)
    );
  }

}
