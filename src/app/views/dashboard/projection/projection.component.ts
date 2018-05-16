import { Component, OnInit, ViewChild, Input, OnChanges, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { ProjectionData, ProjectionOutput } from '../../../model/D3chartData/projection-data.model';
import { ProjectionD3Chart } from './../../../model/D3chart/projection-d3-chart.model';
import { ProjectionPieChart } from './../../../model/D3chart/projection-pie-chart.model';

import { Selector } from '../../../model/utils/selector.model';
import { ProjectionGridData } from './../../../model/D3chartData/projection-data.model';
import * as elementResizeDetectorMaker from 'element-resize-detector';


@Component({
  selector: 'app-projection',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.scss']
})
export class ProjectionComponent implements OnInit, OnChanges, OnDestroy {

  // UK
  static graphCategories = ['EMPLOYER_PREMIUM', 'FUNDING_GAP', 'MEMBER_PREMIUM', 'TAX', 'FEES'];
  static gridCategories = ['TOTAL_LIVES', 'TOTAL_COST', 'MEMBER_PREMIUM', 'EMPLOYER_PREMIUM', 'FUNDING_GAP', 'ESTIMATED_MEMBER_OOP_COST', 'TAX', 'FEES'];



  @Input() private projectionJSON: any[];
  @ViewChild('projectionChartContainer') private projectionChartContainer: ElementRef;
  @ViewChild('projectionChart') private projectionChart: ElementRef;
  @ViewChild('projectionPie') private projectionPieChartDiv: ElementRef;

  countryCode = 'ISO2_GB';

  // without Finding Gap
  graphCategoriesStatus = {
    EMPLOYER_PREMIUM: true,
    MEMBER_PREMIUM: true,
    TAX: true,
    FEES: true
  };

  private projectionData: ProjectionData;
  private projectionGraphData: ProjectionOutput[];
  private projectionD3Chart: ProjectionD3Chart;
  private projectionPieChart: ProjectionPieChart;

  projectionGridData: ProjectionGridData[];


  pieData: any[];

  categorySelector: Selector;
  planSelector: Selector;
  periodSelector: Selector;
  projectionSelector: Selector;

  grid = false;

  private margin: any = { top: 20, right: 20, bottom: 40, left: 40 };

  private pieChartMargin: any = { top: 5, right: 5, bottom: 5, left: 5 };

  dropdownStatus = {
    planDropdown: false,
    periodDropdown: false,
    projectionDropdown: false,
    categoryDropdown: false
  };

  // Resize
  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });

  constructor() { }

  getGraphCategories(): string[] {
    return ProjectionComponent.graphCategories;
  }

  private getGridCategories(): string[] {
    return ProjectionComponent.gridCategories;
  }

  ngOnInit() {
    console.log('projection init');
    this.resizeDetector.listenTo(this.projectionChartContainer.nativeElement, (elem: HTMLElement) => {
      this.updateChart();
    });
    this.createChartData();
    this.createSelector();
    this.createChart();

    console.log(this.pieData);

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
      this.createChart();
    }
  }

  ngOnDestroy() {
    this.resizeDetector.removeAllListeners(this.projectionChartContainer.nativeElement);
    console.log('projection ondestroy');
  }




  createChartData() {
    this.projectionData = new ProjectionData(this.projectionJSON, this.getGraphCategories(), this.getGridCategories());
    this.projectionGraphData = this.projectionData.getGraphData();
    this.projectionGridData = this.projectionData.getFinalGrid();
    this.pieData = this.projectionData.getFundingGapByPlan();
  }

  updateChartData(plans: number[], periods: number[], categories: string[], currentProposed: string[]) {
    this.projectionData.updateGraphData(plans, periods, categories, currentProposed);
    this.projectionGraphData = this.projectionData.getGraphData();
    this.projectionGridData = this.projectionData.getFinalGrid(currentProposed);
    this.pieData = this.projectionData.getFundingGapByPlan();
  }


  createChart() {
    this.projectionD3Chart = new ProjectionD3Chart(
      this.projectionChartContainer,
      this.projectionChart,
      this.margin,
      this.projectionData.getAllPeriod(),
      ['CURRENT', 'PROPOSED'],
      [0, this.projectionData.getMaxStackValue()],
      this.projectionGraphData,
      Translations.categoryTranslate,
      '#projectionToolip'
    );

    // #NEW

    this.projectionPieChart = new ProjectionPieChart(
      this.projectionPieChartDiv,
      this.pieChartMargin,
      this.pieData
    );


  }

  updateChart() {

    this.projectionD3Chart.updateChart(
      this.projectionChartContainer,
      this.projectionChart,
      this.margin,
      this.projectionData.getAllPeriod(),
      ['CURRENT', 'PROPOSED'],
      [0, this.projectionData.getMaxStackValue()],
      this.projectionGraphData,
      Translations.categoryTranslate,
      '#projectionToolip'
    );
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

    const plans: number[] = this.planSelector.getCurrentSelction().map(d => Number(d));
    const periods: number[] = this.periodSelector.getCurrentSelction().map(d => Number(d));


    this.updateChartData(plans, periods,
      this.categorySelector.getCurrentSelction(), this.projectionSelector.getCurrentSelction());

    this.updateChart();

  }


  toggleCategory(input: string) {
    this.graphCategoriesStatus[input] = !this.graphCategoriesStatus[input];
    this.categorySelector.toggleElementStatus(input);
  }

  resetCategory() {
    this.categorySelector.resetSelector();
  }


  toggleGridGraph() {
    this.grid = !this.grid;
    setTimeout(() => {
      this.updateChart();
    });
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
