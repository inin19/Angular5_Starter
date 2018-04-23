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
export class DemographicService {





  // http://localhost:50001/bmservices/demographicData/getDemographicalBenchmarkData/ISO2_GB/129/0-18,19-25,26-35,36-45,46-55,56-60,61-65,66-70,71-75,76+?740

  // http://localhost:50001/bmservices/demographicData/getDemographicalProposalData/129/0-18,19-25,26-35,36-45,46-55,56-60,61-65,66-70,71-75,76+?676

  private benchmarkDemographicUrl = 'http://localhost:50001/bmservices/demographicData/getDemographicalBenchmarkData/';
  private proposalDemographicUrl = 'http://localhost:50001/bmservices/demographicData/getDemographicalProposalData/';




  constructor(private http: HttpClient, injector: Injector) {
  }


  getBenchmarkDemographicData(countryCode: string, proposalId: string, ageGroup: string[]): Observable<any> {
    const l: number = new Date().getMilliseconds();
    return this.http.get(this.benchmarkDemographicUrl + countryCode + '/' + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions);
  }



  getBenchmarkProposalDemographicData(countryCode: string, proposalId: string, ageGroup: string[]): Observable<Array<any>> {

    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get(this.benchmarkDemographicUrl + countryCode + '/' + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions),
      this.http.get(this.proposalDemographicUrl + proposalId + '/' + ageGroup.join(',') + '?' + l, httpOptions)
    );
  }



  // localdata
  // getBenchmarkProposalDemographicData(countryCode: string, proposalId: string, ageGroup: string[]): Observable<Array<any>> {

  //   const l: number = new Date().getMilliseconds();
  //   return Observable.forkJoin(
  //     this.http.get('http://localhost:3000/demographic' + '?' + l, httpOptions),
  //     this.http.get('http://localhost:3000/demographic' + '?' + l, httpOptions)
  //   );
  // }

}
