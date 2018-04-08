import { Component, OnInit, ViewChild, Input, OnChanges, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { ProjectionData, ProjectionOutput } from '../../../model/d3chartData/projection-data.model';
import { ProjectionD3Chart } from '../../../model/d3chart/projection-d3-chart.model';
import { ProjectionChartConfig } from '../../../model/chart-config';

@Component({
  selector: 'app-projection',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.scss']
})
export class ProjectionComponent implements OnInit, OnChanges, OnDestroy {

  static categories = ['EMPLOYER_PREMIUM', 'FUNDING_GAP', 'MEMBER_PREMIUM', 'TAX', 'FEES'];


  @Input() private projectionJSON: any[];

  @ViewChild('projectionChartContainer') private projectionChartContainer: ElementRef;
  @ViewChild('projectionChart') private projectionChart: ElementRef;

  private projectionData: ProjectionData;
  private projectionGraphData: ProjectionOutput[];
  private projectionD3Chart: ProjectionD3Chart;

  private margin: any = { top: 60, right: 20, bottom: 40, left: 40 };


  constructor() { }

  ngOnInit() {
    console.log('projection init');
    this.createChartData();
    this.createChart();
    this.updateChart();
  }

  ngOnChanges() {
    console.log('projection on changes');
  }

  ngOnDestroy() {
    console.log('projection ondestroy');
  }

  createChartData() {
    this.projectionData = new ProjectionData(this.projectionJSON, ProjectionComponent.categories);
    this.projectionGraphData = this.projectionData.getGraphData();
    // this.projectionData.updateGraphData([2], [0, 1, 2, 3, 4, 5], ProjectionComponent.categories, ['CURRENT', 'PROPOSED']);
  }

  createChart() {
    const chartConfig: ProjectionChartConfig = {
      title: '5 Year Projection',
      chartContainer: this.projectionChart,
      margin: this.margin,
      domID: '#' + this.projectionChart.nativeElement.id,
      xScaleDomain: this.projectionData.getAllPeriod(),
      yScaleDomain: [0, this.projectionData.getMaxStackValue()],
      x1ScaleDomain: ['CURRENT', 'PROPOSED'],
      categories: ProjectionComponent.categories
    };
    this.projectionD3Chart = new ProjectionD3Chart(chartConfig);
  }


  updateChart() {
    const chartConfig: ProjectionChartConfig = {
      title: '5 Year Projection',
      chartContainer: this.projectionChart,
      margin: this.margin,
      domID: '#' + this.projectionChart.nativeElement.id,
      xScaleDomain: this.projectionData.getAllPeriod(),
      yScaleDomain: [0, this.projectionData.getMaxStackValue()],
      x1ScaleDomain: ['CURRENT', 'PROPOSED'],
      // periodGroup: this.projectionData.getAllPeriod(),
      barData: this.projectionGraphData,
      tooltipDomID: '#projectionToolip',
      toolTipParent: this.projectionChartContainer
    };

    this.projectionD3Chart.updateChart(chartConfig);
  }

}
