import { Component, OnInit, OnDestroy, OnChanges, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { WaterfallD3Chart } from './../../../model/D3chart/waterfall-d3-chart.model';
import { WaterfallChartConfig } from './../../../model/utils/chart-config';
import * as elementResizeDetectorMaker from 'element-resize-detector';
import { WaterfallData, WaterfallBar } from './../../../model/D3chartData/waterfall-data.model';
import { Selector } from './../../../model/utils/selector.model';

@Component({
  selector: 'app-claims-percapita',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './claims-percapita.component.html',
  styleUrls: ['./claims-percapita.component.scss']
})
export class ClaimsPerCapitaComponent implements OnInit, OnDestroy, OnChanges {

  // temp
  private static stackColor = {
    Base: '#FFFFFF',
    Fall: '#FFA500',
    Rise: '#0000FF'
  };

  @Input() private benchmarkClaimPerCapita: WaterfallData;
  @Input() private proposalClaimPerCapita: WaterfallData;
  @Input() private conditionGroupTranslation: any;
  @Input() private claimMargin: any;

  @Input() countryCode: string;
  @Input() private conditionGroups: string[];
  @Input() private claimSelectors: Selector[];


  // language
  private language: string;


  // for tooltip
  @ViewChild('claimsPerCapitaContainer') private claimsPerCapitaContainer: ElementRef;

  // for svg container
  @ViewChild('proposalClaimsPerCapita') private proposalClaimsPerCapita: ElementRef;
  @ViewChild('benchmarkClaimsPerCapita') private benchmarkClaimsPerCapita: ElementRef;


  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });


  private benchmarkConditionGroupData: WaterfallBar[];
  private benchmarkGraphData: any[];

  private proposalConditionGroupData: WaterfallBar[];
  private proposalGraphData: any[];

  private benchmarkD3Chart: WaterfallD3Chart;
  private proposalD3Chart: WaterfallD3Chart;


  zoom = false;

  private claimPerCapitaXDomain: string[];


  sorting = 'Default';

  // [claim, settled]
  amountType: string;



  // gridData
  waterfallGridData: WaterfallGridData[];
  waterfallGridDataTotal: WaterfallGridData;



  // D3 Grid
  // private perCapitaGrid: WaterfallD3Grid;

  private gridSorting = {
    conditionGroup: { default: true },
    prev: { asc: false, desc: false },
    curr: { asc: false, desc: false },
    benchmark: { asc: false, desc: false }
  };

  private currentGridSorting = { column: 'conditionGroup', order: 'default' };

  grid: false;

  gridDispaly = 'Grid';


  constructor() { }


  ngOnInit() {
    console.log('claim PerCapita init');
    this.claimPerCapitaXDomain = Object.keys(this.conditionGroupTranslation).map(key => this.conditionGroupTranslation[key]);
    this.amountType = 'claim';
    this.createGridGraphData();
    this.creatOrUpdateChart();
  }


  ngOnChanges() {
    console.log('claim Per Capita on changes');
  }

  ngOnDestroy() {
    console.log('claim PerCapita component destroy');
  }


  changeSorting() {
    console.log('changeSorting');

    if (this.proposalClaimPerCapita) {
      this.proposalClaimPerCapita.sortConditionGroupData(this.sorting, Object.keys(this.conditionGroupTranslation));
      this.proposalGraphData = this.proposalClaimPerCapita.getGraphData();
      this.updateChart_proposal();
    }

    this.benchmarkClaimPerCapita.sortConditionGroupData(this.sorting, Object.keys(this.conditionGroupTranslation));
    this.benchmarkGraphData = this.benchmarkClaimPerCapita.getGraphData();
    this.updateChart_benchmark();

  }


  listenToDivResize() {
    if (this.proposalClaimPerCapita) {
      this.resizeDetector.listenTo(this.proposalClaimsPerCapita.nativeElement, (elem: HTMLElement) => {
        this.updateChart_proposal();
      });
    }
    this.resizeDetector.listenTo(this.benchmarkClaimsPerCapita.nativeElement, (elem: HTMLElement) => {
      this.updateChart_benchmark();
    });
    console.log('listen to claims per capita divs');
  }


  creatOrUpdateChart() {
    this.createChart_benchmark();
    this.updateChart_benchmark();

    if (this.proposalClaimPerCapita) {
      this.createChart_proposal();
      this.updateChart_proposal();
    }
  }


  unListenToDivResize() {
    if (this.proposalClaimPerCapita) {
      this.resizeDetector.removeAllListeners(this.proposalClaimsPerCapita.nativeElement);
    }
    this.resizeDetector.removeAllListeners(this.benchmarkClaimsPerCapita.nativeElement);

    console.log('unlistenclaims per capita divs');
  }

  changeAmountType() {
    console.log('Amount Type : ', this.amountType);
    this.updateChartData(this.conditionGroups, this.claimSelectors);
    this.creatOrUpdateChart();
  }

  sortByHeader(column: string, order: string) {
    this.resetGridSorting();
    this.gridSorting[column][order] = true;

    this.currentGridSorting.column = column;
    this.currentGridSorting.order = order;

    if (column === 'conditionGroup') {
      this.waterfallGridData.sort((a, b) =>
        this.conditionGroups.indexOf(a.key) > this.conditionGroups.indexOf(b.key) ? 1 : -1);
    } else {
      this.waterfallGridData.sort((a, b) => order === 'asc' ? a[column] - b[column] : b[column] - a[column]);
    }

  }

  resetGridSorting() {
    this.gridSorting.conditionGroup.default = false;
    this.gridSorting.curr.asc = false;
    this.gridSorting.curr.desc = false;
    this.gridSorting.prev.asc = false;
    this.gridSorting.prev.desc = false;
    this.gridSorting.benchmark.asc = false;
    this.gridSorting.benchmark.desc = false;
  }

  toggleGridGraph() {
    console.log('toggle Grid Graph');
    if (this.gridDispaly === 'Grid') {
      this.gridDispaly = 'Graph';
    } else {
      this.gridDispaly = 'Grid';
    }

    // needed?
    setTimeout(() => {
      this.creatOrUpdateChart();
    });
  }

  updateGridGraphData(conditionGroup: string[], selectors: Selector[]) {
    this.updateChartData(conditionGroup, selectors);
    this.populateGridData(this.currentGridSorting.column, this.currentGridSorting.order);
  }



  private createChartData() {
    this.waterfallGridData = [];
    this.benchmarkConditionGroupData = this.benchmarkClaimPerCapita.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimPerCapita.getGraphData();

    if (this.proposalClaimPerCapita) {
      this.proposalConditionGroupData = this.proposalClaimPerCapita.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimPerCapita.getGraphData();
    }
  }

  private createGridGraphData() {
    this.createChartData();
    this.populateGridData(this.currentGridSorting.column, this.currentGridSorting.order);

  }


  private populateGridData(column: string, order: string) {
    this.waterfallGridData = [];

    if (this.proposalClaimPerCapita) {
      this.conditionGroups.forEach(element => {
        const proposal = this.proposalClaimPerCapita.getClaimsAggregateData().find(item => item.key === element);
        const benchmark = this.benchmarkClaimPerCapita.getClaimsAggregateData().find(item => item.key === element);

        let temp: WaterfallGridData = null;
        if (this.amountType === 'claim') {
          temp = {
            key: element,
            prev: (proposal) ? proposal.prevYearPerCapitalClaimCost : 0,
            curr: (proposal) ? proposal.currYearPerCapitalClaimCost : 0,
            benchmark: (benchmark) ? benchmark.currYearPerCapitalClaimCost : 0
          };
        } else {
          temp = {
            key: element,
            prev: (proposal) ? proposal.prevYearPerCapitalSettledAmount : 0,
            curr: (proposal) ? proposal.currYearPerCapitalSettledAmount : 0,
            benchmark: (benchmark) ? benchmark.currYearPerCapitalSettledAmount : 0
          };
        }
        this.waterfallGridData.push(temp);
      });

      // total
      if (this.amountType === 'claim') {
        this.waterfallGridDataTotal = {
          key: 'TOTAL',
          prev: this.proposalClaimPerCapita.getClaimsAggregateDataTotal().prevYearPerCapitalClaimCost,
          curr: this.proposalClaimPerCapita.getClaimsAggregateDataTotal().currYearPerCapitalClaimCost,
          benchmark: this.benchmarkClaimPerCapita.getClaimsAggregateDataTotal().currYearPerCapitalClaimCost
        };
      } else {
        this.waterfallGridDataTotal = {
          key: 'TOTAL',
          prev: this.proposalClaimPerCapita.getClaimsAggregateDataTotal().prevYearPerCapitalSettledAmount,
          curr: this.proposalClaimPerCapita.getClaimsAggregateDataTotal().currYearPerCapitalSettledAmount,
          benchmark: this.benchmarkClaimPerCapita.getClaimsAggregateDataTotal().currYearPerCapitalSettledAmount
        };
      }

    } else {
      this.conditionGroups.forEach(element => {
        const benchmark = this.benchmarkClaimPerCapita.getClaimsAggregateData().find(item => item.key === element);
        let temp: WaterfallGridData = null;

        if (this.amountType === 'claim') {
          temp = {
            key: element,
            prev: 0,
            curr: 0,
            benchmark: (benchmark) ? benchmark.currYearPerCapitalClaimCost : 0
          };
        } else {
          temp = {
            key: element,
            prev: 0,
            curr: 0,
            benchmark: (benchmark) ? benchmark.currYearPerCapitalSettledAmount : 0
          };
        }
        this.waterfallGridData.push(temp);
      });

      if (this.amountType === 'claim') {
        this.waterfallGridDataTotal = { key: 'TOTAL', prev: 0, curr: 0, benchmark: this.benchmarkClaimPerCapita.getClaimsAggregateDataTotal().currYearPerCapitalClaimCost };
      } else {
        this.waterfallGridDataTotal = { key: 'TOTAL', prev: 0, curr: 0, benchmark: this.benchmarkClaimPerCapita.getClaimsAggregateDataTotal().currYearPerCapitalSettledAmount };
      }
    }

    // sort
    this.sortByHeader(column, order);

  }


  //
  private updateChartData(conditionGroup: string[], selectors: Selector[]) {

    this.benchmarkClaimPerCapita.updateData(conditionGroup, selectors);
    this.benchmarkClaimPerCapita.createWaterfallData(this.sorting, WaterfallData.type.PERCAPITA, this.amountType);

    this.benchmarkConditionGroupData = this.benchmarkClaimPerCapita.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimPerCapita.getGraphData();

    if (this.proposalClaimPerCapita) {
      this.proposalClaimPerCapita.updateData(conditionGroup, selectors);
      this.proposalClaimPerCapita.createWaterfallData(this.sorting, WaterfallData.type.PERCAPITA, this.amountType);
      this.proposalConditionGroupData = this.proposalClaimPerCapita.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimPerCapita.getGraphData();
    }
  }




  private createChart_benchmark() {

    if (this.benchmarkClaimsPerCapita.nativeElement.offsetWidth === 0 && this.benchmarkClaimsPerCapita.nativeElement.offsetHeight === 0) {
      console.log('createChart_Benchmark: container size is zero, chart is not created');
    } else {
      if (!this.benchmarkD3Chart) {
        const config: WaterfallChartConfig = {
          title: 'benchmark Cost Per Capita',
          margin: this.claimMargin,
          chartContainer: this.benchmarkClaimsPerCapita,
          domID: '#' + this.benchmarkClaimsPerCapita.nativeElement.id,
          xScaleDomain: this.claimPerCapitaXDomain,
          yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaimPerCapita.getGraphMaxValue()] : [this.benchmarkClaimPerCapita.getWaterfallMinBaseValue(), this.benchmarkClaimPerCapita.getGraphMaxValue()],
          conditionGroupTranslation: this.conditionGroupTranslation,
          chartType: WaterfallD3Chart.chartType.PERCAPITA
        };
        this.benchmarkD3Chart = new WaterfallD3Chart(config);
      }
    }

  }


  private createChart_proposal() {
    if (this.proposalClaimsPerCapita.nativeElement.offsetWidth === 0 && this.proposalClaimsPerCapita.nativeElement.offsetHeight === 0) {
      console.log('create Chart Proposal: container size is zero, chart is not created');
    } else {
      if (!this.proposalD3Chart) {
        const config: WaterfallChartConfig = {
          title: 'proposal Cost Per Capita',
          margin: this.claimMargin,
          chartContainer: this.proposalClaimsPerCapita,
          domID: '#' + this.proposalClaimsPerCapita.nativeElement.id,
          xScaleDomain: this.claimPerCapitaXDomain,
          yScaleDomain: (this.zoom === false) ? [0, this.proposalClaimPerCapita.getGraphMaxValue()] : [this.proposalClaimPerCapita.getWaterfallMinBaseValue(), this.proposalClaimPerCapita.getGraphMaxValue()],
          conditionGroupTranslation: this.conditionGroupTranslation,
          chartType: WaterfallD3Chart.chartType.PERCAPITA
        };
        this.proposalD3Chart = new WaterfallD3Chart(config);
      }
    }
  }




  private updateChart_benchmark() {
    if (this.benchmarkD3Chart) {
      const config: WaterfallChartConfig = {
        chartContainer: this.benchmarkClaimsPerCapita,
        domID: '#' + this.benchmarkClaimsPerCapita.nativeElement.id,
        tooltipDomID: '#' + 'waterfallTooltip',
        xScaleDomain: this.benchmarkClaimPerCapita.getGraphData()[0].map(val => (val.data.key)).map(key => this.conditionGroupTranslation[key]),
        yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaimPerCapita.getGraphMaxValue()] : [this.benchmarkClaimPerCapita.getWaterfallMinBaseValue(), this.benchmarkClaimPerCapita.getGraphMaxValue()],
        zoom: this.zoom,
        barData: this.benchmarkGraphData,
        previousYearKey: this.conditionGroupTranslation.PREVYEAR,
        currentYearKey: this.conditionGroupTranslation.CURRYEAR,
        toolTipParent: this.claimsPerCapitaContainer,
        conditionGroupTranslation: this.conditionGroupTranslation,
        chartType: WaterfallD3Chart.chartType.PERCAPITA
      };

      this.benchmarkD3Chart.updateChart(config);
    }
  }

  private updateChart_proposal() {
    if (this.proposalD3Chart) {
      const config: WaterfallChartConfig = {
        chartContainer: this.proposalClaimsPerCapita,
        domID: '#' + this.proposalClaimsPerCapita.nativeElement.id,
        tooltipDomID: '#' + 'waterfallTooltip',
        xScaleDomain: this.proposalClaimPerCapita.getGraphData()[0].map(val => (val.data.key)).map(key => this.conditionGroupTranslation[key]),
        yScaleDomain: (this.zoom === false) ? [0, this.proposalClaimPerCapita.getGraphMaxValue()] : [this.proposalClaimPerCapita.getWaterfallMinBaseValue(), this.proposalClaimPerCapita.getGraphMaxValue()],
        zoom: this.zoom,
        barData: this.proposalGraphData,
        previousYearKey: this.conditionGroupTranslation.PREVYEAR,
        currentYearKey: this.conditionGroupTranslation.CURRYEAR,
        toolTipParent: this.claimsPerCapitaContainer,
        conditionGroupTranslation: this.conditionGroupTranslation,
        chartType: WaterfallD3Chart.chartType.PERCAPITA
      };
      this.proposalD3Chart.updateChart(config);
    }
  }




}

export interface WaterfallGridData {
  key: string;
  prev: number;
  curr: number;
  benchmark: number;
}
