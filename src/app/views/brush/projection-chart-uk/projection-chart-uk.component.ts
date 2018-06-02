import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// model
import { Selector, SelectionItem } from './../../../model/utils/selector.model';
import { ProjectionData, ProjectionOutput, ProjectionGridData } from './../../../model/D3chartData/projection-data.model';
import { ProjectionD3Chart } from './../../../model/D3chart/projection-d3-chart.model';
import { ProjectionPieChart } from './../../../model/D3chart/projection-pie-chart.model';
import { Scatterplot } from './../../../model/D3chart/scatterplot.model';


// services
import { ProjectionPlanSelectionService } from './../../../services/projection-plan-selection.service';
import { ProjectionTrendTypeService } from './../../../providers/charts/projection-trend-type.service';
// 3rd party
import * as elementResizeDetectorMaker from 'element-resize-detector';


@Component({
  selector: 'app-projection-chart-uk',
  templateUrl: './projection-chart-uk.component.html',
  styleUrls: ['./projection-chart-uk.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ProjectionChartUkComponent implements OnInit, OnChanges, OnDestroy {

  // country specific
  static graphCategories = ['EMPLOYER_PREMIUM', 'FUNDING_GAP', 'MEMBER_PREMIUM', 'TAX', 'FEES'];
  static gridCategories = ['TOTAL_LIVES', 'TOTAL_COST', 'MEMBER_PREMIUM', 'EMPLOYER_PREMIUM', 'FUNDING_GAP', 'ESTIMATED_MEMBER_OOP_COST', 'TAX', 'FEES'];

  static colors = {
    EMPLOYER_PREMIUM: '#5cbae6',
    FUNDING_GAP: '#fac364',
    MEMBER_PREMIUM: '#b6d957',
    TAX: '#d998cb',
    FEES: '#93b9c6'
  };
  countryCode = 'ISO2_GB';
  // country specific


  @Input() private projectionJSON: any[];
  @Input() private lossRatioData: any[];

  @ViewChild('projectionChartContainer') private projectionChartContainer: ElementRef;
  @ViewChild('projectionChart') private projectionChart: ElementRef;



  @ViewChild('projectionPie') private projectionPieChartDiv: ElementRef;
  @ViewChild('projectionPieChartContainer') private projectionPieChartContainer: ElementRef;
  @ViewChild('lossRatioChart') private lossRatioChart: ElementRef;

  private projectionData: ProjectionData;
  private projectionGraphData: ProjectionOutput[];
  private projectionD3Chart: ProjectionD3Chart;
  private projectionPieChart: ProjectionPieChart;
  private planSubscription: Subscription;

  private lossRatioD3Chart: Scatterplot;

  projectionGridData: ProjectionGridData[];
  pieData: any[];

  categorySelector: Selector;
  planSelector: Selector;
  periodSelector: Selector;
  projectionSelector: Selector;

  periodSelectorPie: Selector;
  projectionSelectorPie: Selector;


  // todo
  private margin: any = { top: 40, right: 50, bottom: 40, left: 50 };
  private lossRatioMargin: any = { top: 20, right: 50, bottom: 30, left: 50 };

  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });


  trendType = 'BENCHMARK';
  trendTypeIndicator = true;
  filterPanelHidden = false;
  grid = false;
  currentProjection = true;
  lossRatio = true;


  // country specific
  getGraphCategories(): string[] {
    return ProjectionChartUkComponent.graphCategories;
  }
  getGraphCategoriesReverse(): string[] {
    const tmp = ProjectionChartUkComponent.graphCategories.slice().reverse();
    return tmp;
  }
  getGraphCategoriesColor(category: string): any {
    return ProjectionChartUkComponent.colors[category];
  }
  getGraphColors() {
    return ProjectionChartUkComponent.colors;
  }
  private getGridCategories(): string[] {
    return ProjectionChartUkComponent.gridCategories;
  }
  // country specific



  constructor(private planSelectorService: ProjectionPlanSelectionService, private projectionTrendTypeService: ProjectionTrendTypeService) { }

  ngOnInit() {
    console.log('projection init, trend tpe : ', this.trendType);
    this.planSubscription = this.planSelectorService.plans$.subscribe(
      (plans) => {
        (plans.length === 0) ? this.planSelector.resetSelector() : this.planSelector.setSelectionNEW(plans);
        this.updateProjectionDataGraph();
      }
    );

    this.resizeDetector.listenTo(this.projectionChartContainer.nativeElement, (elem: HTMLElement) => {
      this.updateAllChart();
    });

    this.createProjectionChartData();
    this.createSelector();
    this.createProjectionChart();
    this.createLossRatioChart();
  }


  ngOnDestroy() {
    this.resizeDetector.removeAllListeners(this.projectionChartContainer.nativeElement);
    this.planSubscription.unsubscribe();
    console.log('projection uk ondestroy');
  }

  ngOnChanges() {

  }


  createLossRatioChart() {
    this.lossRatioD3Chart = new Scatterplot(
      this.projectionChartContainer,
      this.lossRatioChart,
      this.lossRatioMargin,
      this.lossRatioData,
      this.lossRatio
    );
  }

  updateLossRatioChart() {
    this.lossRatioD3Chart.updateChart(
      this.projectionChartContainer,
      this.lossRatioChart,
      this.lossRatioMargin,
      this.lossRatioData,
      this.lossRatio
    );
  }


  createProjectionChartData() {
    this.projectionData = new ProjectionData(this.projectionJSON, this.getGraphCategories(), this.getGridCategories());
    this.projectionGraphData = this.projectionData.getGraphData();
    this.projectionGridData = this.projectionData.getFinalGrid();
    this.pieData = this.projectionData.getPieData();
  }


  updateChartData(plans: number[], periods: number[], categories: string[], projection: string[]) {
    this.projectionData.updateProjectionData(plans, periods, categories, projection);
    this.projectionGraphData = this.projectionData.getGraphData();
    this.projectionGridData = this.projectionData.getFinalGrid(projection);
    this.pieData = this.projectionData.getPieData();
  }



  updateAllChart() {
    this.updateProjectionChart();
    this.updatePieChart();
    this.updateLossRatioChart();
  }

  private updateProjectionChart() {
    this.projectionD3Chart.updateChart(
      this.projectionChartContainer,
      this.projectionChart,
      this.margin,
      this.projectionData.getAllPeriod(),
      ['CURRENT', 'PROPOSED'],
      [0, this.projectionData.getMaxStackValue()],
      this.projectionGraphData,
      Translations.categoryTranslate,
      '#projectionToolip',
      this.getGraphColors()
    );
  }

  private updatePieChart() {
    this.projectionPieChart.updateChart(
      this.projectionPieChartContainer,
      this.projectionPieChartDiv,
      this.pieData,
      '#fundingGapPieToolip',
      this.planSelectorService
    );
  }

  toggleGridGraph() {
    this.grid = !this.grid;
    setTimeout(() => {
      this.updateAllChart();
    });
  }

  resetCategory() {
    this.categorySelector.resetSelector();
    this.updateProjectionDataGraph();
  }

  resetPeriod() {
    this.periodSelectorPie.resetSelector();
    this.updatePieGridGraph();
  }


  private updateProjectionDataGraph() {
    this.updateChartData(
      this.planSelector.getCurrentSelction(),
      this.periodSelector.getCurrentSelction(),
      this.categorySelector.getCurrentSelction(),
      this.projectionSelector.getCurrentSelction()
    );
    this.updateProjectionChart();
  }

  toggleCategory(categoryItem: SelectionItem) {
    this.categorySelector.toggleSelectionItem(categoryItem);
    this.updateProjectionDataGraph();
  }

  togglePeriod(periodItem: SelectionItem) {
    this.periodSelectorPie.toggleSelectionItem(periodItem);
    this.updatePieGridGraph();
  }

  toggleProjection() {
    this.currentProjection = !this.currentProjection;
    this.projectionSelectorPie.selectionItems.forEach(element => {
      element.checked = !element.checked;
    });
    this.updatePieGridGraph();
  }

  private updatePieGridGraph() {
    this.projectionData.createOrUpdatePieData(this.periodSelectorPie.getCurrentSelction(), this.projectionSelectorPie.getCurrentSelction());
    this.pieData = this.projectionData.getPieData();
    this.projectionPieChart.updateChart(
      this.projectionPieChartContainer,
      this.projectionPieChartDiv,
      this.pieData,
      '#fundingGapPieToolip',
      this.planSelectorService
    );
  }

  toggleLossRatioRenewalRate() {
    this.lossRatio = !this.lossRatio;
    this.updateLossRatioChart();
  }



  createSelector() {
    this.categorySelector = new Selector(this.getGraphCategories(), 'category');
    this.planSelector = new Selector(this.projectionData.getAllPlan(), 'plan');
    this.periodSelector = new Selector(this.projectionData.getAllPeriod(), 'period');
    this.projectionSelector = new Selector(this.projectionData.getAllProjection(), 'projection');

    // new for pie chart
    this.periodSelectorPie = new Selector([1, 2, 3, 4, 5], 'periodForPie');
    this.projectionSelectorPie = new Selector(this.projectionData.getAllProjection(), 'projectionForPie');


    this.projectionSelectorPie.toggleElementStatus('PROPOSED');
  }



  createProjectionChart() {
    this.projectionD3Chart = new ProjectionD3Chart(
      this.projectionChartContainer,
      this.projectionChart,
      this.margin,
      this.projectionData.getAllPeriod(),
      ['CURRENT', 'PROPOSED'],
      [0, this.projectionData.getMaxStackValue()],
      this.projectionGraphData,
      Translations.categoryTranslate,
      '#projectionToolip',
      this.getGraphColors()
    );

    // #NEW
    this.projectionPieChart = new ProjectionPieChart(
      this.projectionPieChartContainer,
      this.projectionPieChartDiv,
      this.pieData,
      '#fundingGapPieToolip',
      this.planSelectorService
    );
  }

  toggleFilterPanel() {
    console.log('toggle!');
    this.filterPanelHidden = !this.filterPanelHidden;
  }


  changeTrendType(type: boolean) {
    this.trendType = type ? 'BENCHMARK' : 'PROPOSAL';
    this.projectionTrendTypeService.sendPlanType(type ? 'BENCHMARK' : 'PROPOSAL');
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
