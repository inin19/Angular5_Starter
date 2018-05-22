import { ProjectionService } from './../../providers/charts/projection.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  private proposalId = 187;
  private countryCode = 'ISO2_GB';
  private trendType = 'BENCHMARK';

  projectionData: any[];
  lossRatioData: any[];

  source = true;

  constructor(private projectionService: ProjectionService) { }



  ngOnInit() {
    this.fetchProjection();
    this.fetchLossRatioData();
  }

  fetchProjection(): void {
    this.source = !this.source;

    this.projectionService.getProjectionData(this.countryCode, this.proposalId.toString(), this.trendType, this.source)
      .subscribe(
        data => { this.projectionData = data; }
      );
  }


  fetchLossRatioData(): void {

    this.projectionService.getLossRatio()
      .subscribe(
        data => { this.lossRatioData = data; }
      );
  }






}
