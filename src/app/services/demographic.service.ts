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


  // private benchmarkDemographicUrl = 'http://localhost:50001/bmservices/historicalData/getHistoricalBenchmarkData/ISO2_GB/' + DemographicService.UKAgeGroup.join(',');
  // private proposalDemographicUrl = 'http://localhost:50001/bmservices/historicalData/getHistoricalProposalData/1/' + DemographicService.UKAgeGroup.join(',');


  private benchmarkDemographicUrl = 'http://localhost:50001/bmservices/historicalData/getHistoricalBenchmarkData/';
  private proposalDemographicUrl = 'http://localhost:50001/bmservices/historicalData/getHistoricalProposalData/';




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

}
