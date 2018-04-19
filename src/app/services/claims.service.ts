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




  private benchmarkClaimsUrl = 'http://localhost:50001/bmservices/claimsData/getBenchmarkClaimsData/';
  private proposalClaimUrl = 'http://localhost:50001/bmservices/claimsData/getProposalClaimsData/';


  private benchmarkTotalMemberDataUrl = 'http://localhost:3000/benchmarkMemberCount';
  private proposalTotalMemberDataUrl = 'http://localhost:3000/benchmarkMemberCount';


  // private benchmarkClaimsUrl = 'http://localhost:3000/benchmarkClaims'; // URL to web api

  constructor(private http: HttpClient, injector: Injector) { }



  // if proposal has no claim data
  getBenchmarkClaimsDataTotalMemberCount(countryCode: string, proposalId: string, ageGroup: string[]) {
    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get<Array<any>>(this.benchmarkClaimsUrl + countryCode + '/' + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl + '?' + l, httpOptions)
    );
  }



  // if proposal has claim data
  // getBenchmarkPropocalClaimsDataTotalMemberCount(countryCode: string, proposalId: string, ageGroup: string[]) {
  //   const l: number = new Date().getMilliseconds();
  //   return Observable.forkJoin(
  //     this.http.get<Array<any>>(this.benchmarkClaimsUrl + '?' + l, httpOptions),
  //     this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl + '?' + l, httpOptions),
  //     this.http.get<Array<any>>(this.benchmarkClaimsUrl + '?' + l, httpOptions),
  //     this.http.get<Array<any>>(this.proposalTotalMemberDataUrl + '?' + l, httpOptions)
  //   );
  // }




  // if proposal has claim data
  getBenchmarkPropocalClaimsDataTotalMemberCount(countryCode: string, proposalId: string, ageGroup: string[]) {
    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get<Array<any>>(this.benchmarkClaimsUrl + countryCode + '/' + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.proposalClaimUrl + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions),
      this.http.get<Array<any>>(this.proposalTotalMemberDataUrl + '?' + l, httpOptions)
    );
  }

}
