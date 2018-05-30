import { ProjectionService } from './../../providers/charts/projection.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectionTrendTypeService } from './../../providers/charts/projection-trend-type.service';
import { Subscription } from 'rxjs/Subscription';



@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {


  private proposalId = 187;
  private countryCode = 'ISO2_GB';
  trendType = 'BENCHMARK';

  projectionData: any[];
  lossRatioData: any[];

  source = true;

  private trendTypeSubcription: Subscription;


  constructor(private projectionService: ProjectionService, private projectionTrendTypeService: ProjectionTrendTypeService) { }



  ngOnInit() {
    this.fetchProjection();
    this.fetchLossRatioData();


    this.trendTypeSubcription = this.projectionTrendTypeService.trendType$.subscribe(
      (trendType) => {
        console.log('new trend: ', trendType);
        this.trendType = trendType;
        this.fetchProjection();
        // this.fetchLossRatioData();

      }
    );

  }

  ngOnDestroy() {
    this.trendTypeSubcription.unsubscribe();
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
