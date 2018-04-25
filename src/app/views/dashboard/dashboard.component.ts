import { ProjectionService } from './../../providers/charts/projection.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {


  private proposalId = 177;
  private country = 'ISO2_GB';
  private trendType = 'BENCHMARK';

  projectionData: any[];



  constructor(private projectionService: ProjectionService) { }



  ngOnInit() {
    this.fetchProjection();
  }

  fetchProjection(): void {
    this.projectionService.getProjectionData(this.country, this.proposalId.toString(), this.trendType)
      .subscribe(
        data => { this.projectionData = data; }
      );
  }




}
