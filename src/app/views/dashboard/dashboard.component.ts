import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { DemographicService } from '../../services/demographic.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  private benchmarkDemographicData: any[];
  private proposalDemographicData: any[];


  // constructor(private demographicService: DemographicService) { }

  constructor() { }


  ngOnInit() {
    // this.fetchBenchmarkProposalDemograpic();
  }


  // fetchBenchmarkProposalDemograpic(): void {
  //   this.demographicService.getBenchmarkProposalDemographicData()
  //     .subscribe(
  //       data => {
  //         this.benchmarkDemographicData = data[0];
  //         this.proposalDemographicData = data[1];
  //       }
  //     );
  // }


}
