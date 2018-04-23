import { Component, OnInit, ViewChild, Input, OnChanges, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { ProjectionData, ProjectionOutput } from '../../../model/D3chartData/projection-data.model';
import { ProjectionD3Chart } from '../../../model/D3chart/projection-d3-chart.model';
import { ProjectionChartConfig } from '../../../model/chart-config';
import * as elementResizeDetectorMaker from 'element-resize-detector';
import { Selector } from '../../../model/utils/selector.model';


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

  private categorySelector: Selector;
  private planSelector: Selector;
  private periodSelector: Selector;
  private projectionSelector: Selector;

  private margin: any = { top: 60, right: 20, bottom: 40, left: 40 };

  dropdownStatus = {
    planDropdown: false,
    periodDropdown: false,
    projectionDropdown: false,
    categoryDropdown: false
  };

  // Resize
  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });

  constructor() { }

  ngOnInit() {
    console.log('projection init');

    // listen to div resize event
    this.resizeDetector.listenTo(this.projectionChartContainer.nativeElement, (elem: HTMLElement) => {
      this.updateChart();
    });


    this.createChartData();
    this.createSelector();

    this.createChart();
    this.updateChart();
  }

  createSelector() {
    this.categorySelector = new Selector(ProjectionComponent.categories);
    this.planSelector = new Selector(this.projectionData.getAllPlan());
    this.periodSelector = new Selector(this.projectionData.getAllPeriod());
    this.projectionSelector = new Selector(this.projectionData.getAllProjection());
    // console.log(this.projectionSelector);
  }

  ngOnChanges() {
    console.log('projection on changes');
    if (this.projectionD3Chart) {
      console.log('ngchanges data updated');
      this.createChartData();
      this.createSelector();
      this.updateChart();
    }
  }

  ngOnDestroy() {
    this.resizeDetector.removeAllListeners(this.projectionChartContainer.nativeElement);
    console.log('projection ondestroy');
  }

  createChartData() {
    this.projectionData = new ProjectionData(this.projectionJSON, ProjectionComponent.categories);
    this.projectionGraphData = this.projectionData.getGraphData();
    // this.projectionData.updateGraphData([2], [0, 1, 2, 3, 4, 5], ProjectionComponent.categories, ['CURRENT', 'PROPOSED']);
  }

  updateChartData(plans: number[], periods: number[], categories: string[], currentProposed: string[]) {
    this.projectionData.updateGraphData(plans, periods, categories, currentProposed);
    this.projectionGraphData = this.projectionData.getGraphData();
    console.log(this.projectionGraphData);
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
      // xScaleDomain: this.projectionData.getAllPeriod(),
      xScaleDomain: this.periodSelector.getCurrentSelction(),
      x1ScaleDomain: this.projectionSelector.getCurrentSelction(),
      yScaleDomain: [0, this.projectionData.getMaxStackValue()],
      // periodGroup: this.projectionData.getAllPeriod(),
      barData: this.projectionGraphData,
      tooltipDomID: '#projectionToolip',
      toolTipParent: this.projectionChartContainer
    };

    console.log(this.projectionSelector.getCurrentSelction());

    this.projectionD3Chart.updateChart(chartConfig);
  }

  toggleDropdown(value: boolean, dropdownID: string) {
    this.dropdownStatus[dropdownID] = value;
  }

  onClickedOutside(e: Event, dropdownID: string) {
    this.dropdownStatus[dropdownID] = false;
  }

  toggleMultiSelectAll(dropdownID: string) {
    switch (dropdownID) {
      case 'categoryDropdown': {
        for (const item of this.categorySelector.selectionItems) {
          item.checked = this.categorySelector.all;
        }
        break;
      }
      case 'projectionDropdown': {
        for (const item of this.projectionSelector.selectionItems) {
          item.checked = this.projectionSelector.all;
        }
        break;
      }
      case 'periodDropdown': {
        for (const item of this.periodSelector.selectionItems) {
          item.checked = this.periodSelector.all;
        }
        break;
      }
      case 'planDropdown': {
        for (const item of this.planSelector.selectionItems) {
          item.checked = this.planSelector.all;
        }
        break;
      }
      default: {

        break;
      }
    }

    const plans: number[] = this.planSelector.getCurrentSelction().map(d => Number(d));
    const periods: number[] = this.periodSelector.getCurrentSelction().map(d => Number(d));


    this.updateChartData(plans, periods,
      this.categorySelector.getCurrentSelction(), this.projectionSelector.getCurrentSelction());

    this.updateChart();

  }

  checkIfAllElementSelected(dropdownID: string) {
    switch (dropdownID) {
      case 'categoryDropdown': {
        if (this.categorySelector.checkIfAllChecked()) {
          this.categorySelector.all = true;
        } else {
          this.categorySelector.all = false;
        }
        break;
      }
      case 'projectionDropdown': {
        if (this.projectionSelector.checkIfAllChecked()) {
          this.projectionSelector.all = true;
        } else {
          this.projectionSelector.all = false;
        }
        break;
      }
      case 'periodDropdown': {
        if (this.periodSelector.checkIfAllChecked()) {
          this.periodSelector.all = true;
        } else {
          this.periodSelector.all = false;
        }
        break;
      }
      case 'planDropdown': {
        if (this.planSelector.checkIfAllChecked()) {
          this.planSelector.all = true;
        } else {
          this.planSelector.all = false;
        }
        break;
      }
      default: {

        break;
      }
    }

    // plans: number[], periods: number[], categories: string[], currentProposed: string[]

    const plans: number[] = this.planSelector.getCurrentSelction().map(d => Number(d));
    const periods: number[] = this.periodSelector.getCurrentSelction().map(d => Number(d));


    this.updateChartData(plans, periods,
      this.categorySelector.getCurrentSelction(), this.projectionSelector.getCurrentSelction());

    this.updateChart();

  }




}
