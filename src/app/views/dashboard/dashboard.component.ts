import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectionService } from '../../services/projection.service';
// import { DemographicService } from '../../services/demographic.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  projectionData: any[];



  constructor(private projectionService: ProjectionService) { }



  ngOnInit() {
    this.fetchProjection();
  }

  fetchProjection(): void {
    this.projectionService.getProjectionData()
      .subscribe(
        data => { this.projectionData = data; }
      );
  }




}
