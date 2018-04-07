import { Component, OnInit, Input, OnChanges, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { ProjectionData } from '../../../model/d3chartData/projection-data.model';

@Component({
  selector: 'app-projection',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.scss']
})
export class ProjectionComponent implements OnInit, OnChanges, OnDestroy {

  static categories = ['EMPLOYER_PREMIUM', 'FUNDING_GAP', 'MEMBER_PREMIUM', 'TAX', 'FEES'];


  @Input() private projectionJSON: any[];

  private projectionData: ProjectionData;

  constructor() { }

  ngOnInit() {
    console.log('projection init');

    this.createChartData();

  }

  ngOnChanges() {
    console.log('projection on changes');
  }

  ngOnDestroy() {
    console.log('projection ondestroy');
  }

  createChartData() {
    this.projectionData = new ProjectionData(this.projectionJSON, ProjectionComponent.categories);
  }

}
