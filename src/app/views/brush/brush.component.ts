import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ProjectionService } from './../../providers/charts/projection.service';
import { Subscription } from 'rxjs/Subscription';
import { ProjectionTrendTypeService } from './../../providers/charts/projection-trend-type.service';


@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent implements OnInit, OnDestroy {

  private proposalId = 187;
  countryCode = 'ISO2_GB';
  trendType = 'BENCHMARK';

  projectionPlanData: any[];
  lossRatioData: any[];
  source = true;

  private trendTypeSubcription: Subscription;



  lossRatioRenewalRate: any[];


  constructor(private projectionService: ProjectionService, private projectionTrendTypeService: ProjectionTrendTypeService) { }

  ngOnInit() {
    this.fetchProjection();
    this.fetchLossRatioData();


    this.trendTypeSubcription = this.projectionTrendTypeService.trendType$.subscribe(
      (trendType) => {
        console.log('new trend: ', trendType);
        this.trendType = trendType;
        this.fetchProjection();
        this.fetchLossRatioData();

      }
    );
  }

  ngOnDestroy() {
    this.trendTypeSubcription.unsubscribe();
  }



  fetchLossRatioData(): void {
    this.projectionService.getLossRatioNew()
      .subscribe(
        data => {
          this.lossRatioData = data[0];
          this.lossRatioRenewalRate = data[1];
        }
      );
  }


  fetchProjection(): void {
    this.source = !this.source;

    this.projectionService.getProjectionData(this.countryCode, this.proposalId.toString(), this.trendType, this.source)
      .subscribe(
        data => { this.projectionPlanData = data; }
      );
  }



}
