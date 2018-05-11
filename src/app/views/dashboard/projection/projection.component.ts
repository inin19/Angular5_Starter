import { Component, OnInit, ViewChild, Input, OnChanges, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { ProjectionData, ProjectionOutput } from '../../../model/D3chartData/projection-data.model';
import { ProjectionD3Chart } from '../../../model/D3chart/projection-d3-chart.model';
import { ProjectionChartConfig } from '../../../model/utils/chart-config';
import * as elementResizeDetectorMaker from 'element-resize-detector';
import { Selector } from '../../../model/utils/selector.model';
import { ProjectionGridData } from './../../../model/D3chartData/projection-data.model';
import { ProjectionGrid } from './../../../model/D3grid/projection-grid.model';


@Component({
  selector: 'app-projection',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.scss']
})
export class ProjectionComponent implements OnInit, OnChanges, OnDestroy {

  static graphCategories = ['EMPLOYER_PREMIUM', 'FUNDING_GAP', 'MEMBER_PREMIUM', 'TAX', 'FEES'];
  static gridCategories = ['TOTAL_LIVES', 'TOTAL_COST', 'MEMBER_PREMIUM', 'EMPLOYER_PREMIUM', 'FUNDING_GAP', 'ESTIMATED_MEMBER_OOP_COST', 'TAX', 'FEES'];



  @Input() private projectionJSON: any[];

  @ViewChild('projectionChartContainer') private projectionChartContainer: ElementRef;
  @ViewChild('projectionChart') private projectionChart: ElementRef;



  private projectionData: ProjectionData;
  private projectionGraphData: ProjectionOutput[];
  private projectionD3Chart: ProjectionD3Chart;


  projectionGridData: ProjectionGridData[];


  // private projectionD3Grid: ProjectionGrid;

  categorySelector: Selector;
  planSelector: Selector;
  periodSelector: Selector;
  projectionSelector: Selector;

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

  private getGraphCategories(): string[] {
    return ProjectionComponent.graphCategories;
  }

  private getGridCategories(): string[] {
    return ProjectionComponent.gridCategories;
  }

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
    this.categorySelector = new Selector(this.getGraphCategories());
    this.planSelector = new Selector(this.projectionData.getAllPlan());
    this.periodSelector = new Selector(this.projectionData.getAllPeriod());
    this.projectionSelector = new Selector(this.projectionData.getAllProjection());
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


  // createGrid() {
  //   this.projectionD3Grid = new ProjectionGrid(this.projectionGridData, '#projectionGrid', Translations.categoryTranslate);
  // }

  // updateGrid(periods: number[]) {
  //   this.projectionD3Grid.updateGrid(this.projectionGridData, periods);
  // }

  createChartData() {
    this.projectionData = new ProjectionData(this.projectionJSON, this.getGraphCategories(), this.getGridCategories());
    this.projectionGraphData = this.projectionData.getGraphData();
    this.projectionGridData = this.projectionData.getFinalGrid();
  }

  updateChartData(plans: number[], periods: number[], categories: string[], currentProposed: string[]) {
    this.projectionData.updateGraphData(plans, periods, categories, currentProposed);
    this.projectionGraphData = this.projectionData.getGraphData();
    this.projectionGridData = this.projectionData.getFinalGrid(currentProposed);
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
      categories: this.getGraphCategories(),
      translation: Translations.categoryTranslate
    };
    this.projectionD3Chart = new ProjectionD3Chart(chartConfig);

    // this.createGrid();
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
      toolTipParent: this.projectionChartContainer,
      translation: Translations.categoryTranslate
    };


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
    // this.updateGrid(periods);
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
    // this.updateGrid(periods);

  }





}


class Translations {
  public static categoryTranslate = {
    TOTAL_LIVES: 'Enrollment',
    TOTAL_COST: 'Total Cost',
    MEMBER_PREMIUM: 'Member Premium Co-Share',
    EMPLOYER_PREMIUM: 'Employer Premium',
    FUNDING_GAP: 'Funding Gap',
    ESTIMATED_MEMBER_OOP_COST: 'Estimated Member Out-of-pocket Cost %',
    TAX: 'Tax',
    FEES: 'Fees'
  };
}
