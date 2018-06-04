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
export class ClaimsService {




  private benchmarkClaimsUrl = 'http://localhost:50001/bmservices/claimsData/getBenchmarkClaimsData/';
  private proposalClaimUrl = 'http://localhost:50001/bmservices/claimsData/getProposalClaimsData/';


  // getDemographicalBenchmarkMemberCountByYear  [/demographicData/getDemographicalBenchmarkMemberCountByYear/{countryCd}/{proposalId}]
  // getDemographicalProposalMemberCountByYear  [/demographicData/getDemographicalProposalMemberCountByYear/{proposalId}]
  private benchmarkTotalMemberDataUrl = 'http://localhost:50001/bmservices/demographicData/getDemographicalBenchmarkMemberCountByYear/';
  private proposalTotalMemberDataUrl = 'http://localhost:50001/bmservices/demographicData/getDemographicalProposalMemberCountByYear/';


  // private benchmarkClaimsUrl = 'http://localhost:3000/benchmarkClaims'; // URL to web api

  constructor(private http: HttpClient, injector: Injector) { }



  // if proposal has no claim data
  // getBenchmarkClaimsDataTotalMemberCount(countryCode: string, proposalId: string, ageGroup: string[]) {
  //   const l: number = new Date().getMilliseconds();
  //   return Observable.forkJoin(
  //     this.http.get<Array<any>>(this.benchmarkClaimsUrl + countryCode + '/' + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions),
  //     this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl + countryCode + '/' + proposalId + '?' + l, httpOptions)
  //   );
  // }

  getBenchmarkClaimsDataTotalMemberCount(countryCode: string, proposalId: string, ageGroup: string[]) {
    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get<Array<any>>('http://localhost:3000/benchmarkClaims' + '?' + l, httpOptions),
      this.http.get<Array<any>>('http://localhost:3000/benchmarkMemberCount' + '?' + l, httpOptions)
    );
  }




  // if proposal has claim data
  // getBenchmarkPropocalClaimsDataTotalMemberCount(countryCode: string, proposalId: string, ageGroup: string[]) {
  //   const l: number = new Date().getMilliseconds();
  //   return Observable.forkJoin(
  //     this.http.get<Array<any>>(this.benchmarkClaimsUrl + countryCode + '/' + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions),
  //     this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl + countryCode + '/' + proposalId + '?' + l, httpOptions),
  //     this.http.get<Array<any>>(this.proposalClaimUrl + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions),
  //     this.http.get<Array<any>>(this.proposalTotalMemberDataUrl + + proposalId + '?' + l, httpOptions)
  //   );
  // }





  // local if MongoDb is down
  getBenchmarkPropocalClaimsDataTotalMemberCount(countryCode: string, proposalId: string, ageGroup: string[]) {
    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get<Array<any>>('http://localhost:3000/benchmarkClaims' + '?' + l, httpOptions),
      this.http.get<Array<any>>('http://localhost:3000/benchmarkMemberCount' + '?' + l, httpOptions),
      this.http.get<Array<any>>('http://localhost:3000/benchmarkClaims' + '?' + l, httpOptions),
      this.http.get<Array<any>>('http://localhost:3000/proposalMemberCount' + '?' + l, httpOptions),
      this.http.get<Array<any>>('http://localhost:3000/getLatestBenchmarkClaimsYears' + '?' + l, httpOptions)

    );
  }

// proposalMemberCount

}
