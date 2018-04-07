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

  // temp
  static UKAgeGroup = ['0-18', '19-25', '26-35', '36-45', '46-55', '56-60', '61-65', '66-70', '71-75', '76+'];

  private proposalId: string;

  // private benchmarkDemographicUrl = 'http://localhost:50001/bmservices/historicalData/getHistoricalBenchmarkData/ISO2_GB/' + DemographicService.UKAgeGroup.join(',');
  // private proposalDemographicUrl = 'http://localhost:50001/bmservices/historicalData/getHistoricalProposalData/1/' + DemographicService.UKAgeGroup.join(',');


  private benchmarkDemographicUrl = 'http://localhost:50001/bmservices/historicalData/getHistoricalBenchmarkData/';
  private proposalDemographicUrl = 'http://localhost:50001/bmservices/historicalData/getHistoricalProposalData/';




  constructor(private http: HttpClient, injector: Injector, private activatedRoute: ActivatedRoute) {
  }


  getBenchmarkDemographicData(countryCode: string): Observable<any> {
    const l: number = new Date().getMilliseconds();
    return this.http.get(this.benchmarkDemographicUrl + countryCode + '/' + DemographicService.UKAgeGroup.join(',') + '?' + l, httpOptions);
  }


  // getProposalkDemographicData(): Observable<any> {
  //   const l: number = new Date().getMilliseconds();
  //   return this.http.get(this.proposalDemographicUrl + '?' + l, httpOptions);
  // }


  getBenchmarkProposalDemographicData(countryCode: string): Observable<Array<any>> {

    this.proposalId = this.activatedRoute.snapshot.queryParamMap.get('proposalId');

    // console.log('proposal: ', this.proposalId);

    const l: number = new Date().getMilliseconds();
    return Observable.forkJoin(
      this.http.get(this.benchmarkDemographicUrl + countryCode + '/' + DemographicService.UKAgeGroup.join(',') + '?' + l, httpOptions),
      this.http.get(this.proposalDemographicUrl + '1' + '/' + DemographicService.UKAgeGroup.join(',') + '?' + l, httpOptions)


      // this.http.get(this.proposalDemographicUrl + this.proposalId + '/' + DemographicService.UKAgeGroup.join(',') + '?' + l, httpOptions)
    );
  }

}
