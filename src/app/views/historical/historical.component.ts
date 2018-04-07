import { Component, OnInit, OnDestroy } from '@angular/core';
import { DemographicService } from '../../services/demographic.service';
import { ClaimDataService } from '../../services/claims.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { ViewChild } from '@angular/core';

import { TornadoChartComponent } from './tornado-chart/tornado-chart.component';
import { WaterfallChartComponent } from './waterfall-chart/waterfall-chart.component';




@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit, OnDestroy {

  // to-do get age Group for each country
  private UKAgeGroup = ['0-18', '19-25', '26-35', '36-45', '46-55', '56-60', '61-65', '66-70', '71-75', '76+'];


  @ViewChild('claims') private waterfall: WaterfallChartComponent;


  // demographic
  private benchmarkDemographicData: any[];
  private proposalDemographicData: any[];


  // claims
  private proposalClaimData: any[];
  private proposalMemberCount: any[];

  private benchmarkClaimData: any[];
  private benchmarkMemberCount: any[];

  constructor(private demographicService: DemographicService, private claimDataService: ClaimDataService) { }

  ngOnInit() {
    this.fetchBenchmarkProposalDemograpic();

    // this.fetchBenchmarkProposalClaimAndMemberCount();

    // this.fetchBenchmarkDemograpic();
  }

  ngOnDestroy() {
    console.log('Historical destroyed!');
  }


  // to-do get country code dynamically, or maybe get proposal id
  fetchBenchmarkProposalDemograpic(): void {
    this.demographicService.getBenchmarkProposalDemographicData('ISO2_GB')
      .subscribe(
        data => {
          this.benchmarkDemographicData = data[0];
          this.proposalDemographicData = data[1];
        }
      );
  }

  fetchBenchmarkDemograpic(): void {
    this.demographicService.getBenchmarkDemographicData('ISO2_GB')
      .subscribe(
        data => {
          this.benchmarkDemographicData = data;
        }
      )
  }

  fetchBenchmarkClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkClaimsDataTotalMemberCount()
      .subscribe(
        data => {
          this.benchmarkClaimData = data[0];
          this.benchmarkMemberCount = data[1];
        }
      );
  }


  fetchBenchmarkProposalClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkPropocalClaimsDataTotalMemberCount()
      .subscribe(
        data => {
          this.benchmarkClaimData = data[0];
          this.benchmarkMemberCount = data[1];
          this.proposalClaimData = data[2];
          this.proposalMemberCount = data[3];
        },
        err => console.error(err),
        () => {
          console.log('done loading data');
        }

      );
  }


  onSelect(data: TabDirective): void {
    // console.log(data.id);

    // console.log(this.claimsComponent.chart);

    if (data.id === 'historicalClaims') {

      this.benchmarkDemographicData = null;
      this.proposalDemographicData = null;

      if (this.benchmarkClaimData) {
        console.log('benchmarkClaim size: ', this.benchmarkClaimData.length);
      } else {

        this.fetchBenchmarkProposalClaimAndMemberCount();
        console.log('fectched data');

        // call waterfall component data

        // this.fetchBenchmarkClaimAndMemberCount();


      }
    } else {
      // this.waterfall.ngOnDestroy();
      this.proposalClaimData = null;
      this.benchmarkClaimData = null;
      this.proposalMemberCount = null;
      this.benchmarkMemberCount = null;

      this.fetchBenchmarkProposalDemograpic();
    }

  }

}
