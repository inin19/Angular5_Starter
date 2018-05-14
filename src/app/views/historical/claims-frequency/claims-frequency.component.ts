import { Component, OnInit, OnDestroy, OnChanges, ViewEncapsulation, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as elementResizeDetectorMaker from 'element-resize-detector';
import { WaterfallData, WaterfallBar } from './../../../model/D3chartData/waterfall-data.model';
import { Selector } from './../../../model/utils/selector.model';
import { WaterfallD3Chart } from './../../../model/D3chart/waterfall-d3-chart.model';


@Component({
  selector: 'app-claims-frequency',
  templateUrl: './claims-frequency.component.html',
  styleUrls: ['./claims-frequency.component.scss']
})
export class ClaimsFrequencyComponent implements OnInit, OnDestroy, AfterViewInit {

  // temp
  private static stackColor = {
    Base: '#FFFFFF',
    Fall: '#FFA500',
    Rise: '#0000FF'
  };

  @Input() private benchmarkClaimFrequency: WaterfallData;
  @Input() private proposalClaimFrequency: WaterfallData;
  @Input() private conditionGroupTranslation: any;
  @Input() private claimMargin: any;
  @Input() private conditionGroups: string[];

  @Input() countryCode: string;




  // for tooltip
  @ViewChild('claimsFrequencyContainer') private claimsFrequencyContainer: ElementRef;

  // for svg container
  @ViewChild('proposalClaimsFrequency') private proposalClaimsFrequency: ElementRef;
  @ViewChild('benchmarkClaimsFrequency') private benchmarkClaimsFrequency: ElementRef;


  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });


  private benchmarkConditionGroupData: WaterfallBar[];
  private benchmarkGraphData: any[];

  private proposalConditionGroupData: WaterfallBar[];
  private proposalGraphData: any[];

  private benchmarkD3Chart: WaterfallD3Chart;
  private proposalD3Chart: WaterfallD3Chart;

  private claimPerCapitaXDomain: string[];

  // gridData
  waterfallGridData: WaterfallGridData[];
  waterfallGridDataTotal: WaterfallGridData;



  private gridSorting = {
    conditionGroup: { default: true },
    prev: { asc: false, desc: false },
    curr: { asc: false, desc: false },
    benchmark: { asc: false, desc: false }
  };

  private currentGridSorting = { column: 'conditionGroup', order: 'default' };

  grid: false;
  gridDispaly = 'Grid';
  sorting = 'Default';
  zoom = false;

  constructor() { }

  ngOnInit() {
    console.log('claim frequency init');
    this.claimPerCapitaXDomain = Object.keys(this.conditionGroupTranslation).map(key => this.conditionGroupTranslation[key]);
    this.createOrUpdateGridGraphData();
  }


  updateGridGraphData(conditionGroup: string[], selectors: Selector[]) {
    this.createOrUpdateData(conditionGroup, selectors);
    this.populateGridData(this.currentGridSorting.column, this.currentGridSorting.order);
  }


  creatOrUpdateChart() {
    this.createUpdateChart_benchmark();
    if (this.proposalClaimFrequency) {
      this.createUpdateChart_proposal();
    }
  }

  ngAfterViewInit() {
    this.creatOrUpdateChart();
  }

  ngOnDestroy() {
    console.log('claim PerCapita component destroy');
  }

  changeSorting() {
    console.log('changeSorting');
    if (this.proposalClaimFrequency) {
      this.proposalClaimFrequency.sortConditionGroupData(this.sorting, Object.keys(this.conditionGroupTranslation));
      this.proposalGraphData = this.proposalClaimFrequency.getGraphData();
      this.createUpdateChart_proposal();
    }

    this.benchmarkClaimFrequency.sortConditionGroupData(this.sorting, Object.keys(this.conditionGroupTranslation));
    this.benchmarkGraphData = this.benchmarkClaimFrequency.getGraphData();
    this.createUpdateChart_benchmark();

  }

  listenToDivResize() {
    if (this.proposalClaimFrequency) {
      this.resizeDetector.listenTo(this.proposalClaimsFrequency.nativeElement, (elem: HTMLElement) => {
        this.createUpdateChart_proposal();
      });

    }
    this.resizeDetector.listenTo(this.benchmarkClaimsFrequency.nativeElement, (elem: HTMLElement) => {
      this.createUpdateChart_benchmark();
    });

    console.log('listen to claims frequency divs');
  }


  unListenToDivResize() {
    if (this.proposalClaimFrequency) {
      this.resizeDetector.removeAllListeners(this.proposalClaimsFrequency.nativeElement);
    }
    this.resizeDetector.removeAllListeners(this.benchmarkClaimsFrequency.nativeElement);

    console.log('unlistenclaims frequency divs');
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


  private resetGridSorting() {
    this.gridSorting.conditionGroup.default = false;
    this.gridSorting.curr.asc = false;
    this.gridSorting.curr.desc = false;
    this.gridSorting.prev.asc = false;
    this.gridSorting.prev.desc = false;
    this.gridSorting.benchmark.asc = false;
    this.gridSorting.benchmark.desc = false;
  }

  private createUpdateChart_benchmark() {

    if (this.benchmarkD3Chart) {
      this.benchmarkD3Chart.updateChart(
        this.claimsFrequencyContainer,
        this.benchmarkClaimsFrequency,
        this.claimMargin,
        'FREQUENCY',
        this.benchmarkClaimFrequency.getGraphData()[0].map(val => (val.data.key)).map(key => this.conditionGroupTranslation[key]),
        (this.zoom === false) ? [0, this.benchmarkClaimFrequency.getGraphMaxValue()] : [this.benchmarkClaimFrequency.getWaterfallMinBaseValue(), this.benchmarkClaimFrequency.getGraphMaxValue()],
        this.benchmarkGraphData,
        this.conditionGroupTranslation,
        this.zoom,
        '#claimsFrequencyTooltip'
      );
    } else {

      if (this.benchmarkClaimsFrequency.nativeElement.offsetWidth === 0 && this.benchmarkClaimsFrequency.nativeElement.offsetHeight === 0) {
        console.log('createChart_Benchmark: container size is zero, chart is not created');
        return;
      }

      this.benchmarkD3Chart = new WaterfallD3Chart(
        this.claimsFrequencyContainer,
        this.benchmarkClaimsFrequency,
        this.claimMargin,
        'FREQUENCY',
        this.claimPerCapitaXDomain,
        (this.zoom === false) ? [0, this.benchmarkClaimFrequency.getGraphMaxValue()] : [this.benchmarkClaimFrequency.getWaterfallMinBaseValue(), this.benchmarkClaimFrequency.getGraphMaxValue()],
        this.benchmarkGraphData,
        this.conditionGroupTranslation,
        this.zoom,
        '#claimsFrequencyTooltip'
      );

    }




  }


  private createUpdateChart_proposal() {


    if (this.proposalD3Chart) {
      this.proposalD3Chart.updateChart(
        this.claimsFrequencyContainer,
        this.proposalClaimsFrequency,
        this.claimMargin,
        'FREQUENCY',
        this.proposalClaimFrequency.getGraphData()[0].map(val => (val.data.key)).map(key => this.conditionGroupTranslation[key]),
        (this.zoom === false) ? [0, this.proposalClaimFrequency.getGraphMaxValue()] : [this.proposalClaimFrequency.getWaterfallMinBaseValue(), this.proposalClaimFrequency.getGraphMaxValue()],
        this.proposalGraphData,
        this.conditionGroupTranslation,
        this.zoom,
        '#claimsFrequencyTooltip'
      );

    } else {

      if (this.proposalClaimsFrequency.nativeElement.offsetWidth === 0 && this.proposalClaimsFrequency.nativeElement.offsetHeight === 0) {
        console.log('createChart_proposal: container size is zero, chart is not created');
        return;
      }

      this.proposalD3Chart = new WaterfallD3Chart(
        this.claimsFrequencyContainer,
        this.proposalClaimsFrequency,
        this.claimMargin,
        'FREQUENCY',
        this.claimPerCapitaXDomain,
        (this.zoom === false) ? [0, this.proposalClaimFrequency.getGraphMaxValue()] : [this.proposalClaimFrequency.getWaterfallMinBaseValue(), this.proposalClaimFrequency.getGraphMaxValue()],
        this.proposalGraphData,
        this.conditionGroupTranslation,
        this.zoom,
        '#claimsFrequencyTooltip'
      );
    }



  }


  private createOrUpdateData(conditionGroup?: string[], selectors?: Selector[]) {

    if (conditionGroup && selectors) {
      this.benchmarkClaimFrequency.updateData(conditionGroup, selectors);
      this.benchmarkClaimFrequency.createWaterfallData(this.sorting, 'frequency');

      if (this.proposalClaimFrequency) {
        this.proposalClaimFrequency.updateData(conditionGroup, selectors);
        this.proposalClaimFrequency.createWaterfallData(this.sorting, 'frequency');
      }
    }

    this.benchmarkConditionGroupData = this.benchmarkClaimFrequency.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimFrequency.getGraphData();

    if (this.proposalClaimFrequency) {
      this.proposalConditionGroupData = this.proposalClaimFrequency.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimFrequency.getGraphData();
    }
  }


  private populateGridData(column: string, order: string) {

    this.waterfallGridData = [];

    // populate
    if (this.proposalClaimFrequency) {
      this.conditionGroups.forEach(element => {
        const proposal = this.proposalClaimFrequency.getClaimsAggregateData().find(item => item.key === element);
        const benchmark = this.benchmarkClaimFrequency.getClaimsAggregateData().find(item => item.key === element);

        const temp: WaterfallGridData = {
          key: element,
          prev: (proposal) ? proposal.prevYearClaimFrequency : 0,
          curr: (proposal) ? proposal.currYearClaimFrequency : 0,
          benchmark: (benchmark) ? benchmark.currYearClaimFrequency : 0
        };
        this.waterfallGridData.push(temp);
      });

      // total
      this.waterfallGridDataTotal = {
        key: 'TOTAL',
        prev: this.proposalClaimFrequency.getClaimsAggregateDataTotal().prevYearClaimFrequency,
        curr: this.proposalClaimFrequency.getClaimsAggregateDataTotal().currYearClaimFrequency,
        benchmark: this.benchmarkClaimFrequency.getClaimsAggregateDataTotal().currYearClaimFrequency
      };
    } else {

      this.conditionGroups.forEach(element => {
        const benchmark = this.benchmarkClaimFrequency.getClaimsAggregateData().find(item => item.key === element);
        const temp: WaterfallGridData = { key: element, prev: 0, curr: 0, benchmark: (benchmark) ? benchmark.currYearClaimFrequency : 0 };
        this.waterfallGridData.push(temp);
      });

      this.waterfallGridDataTotal = {
        key: 'TOTAL',
        prev: 0,
        curr: 0,
        benchmark: this.benchmarkClaimFrequency.getClaimsAggregateDataTotal().currYearClaimFrequency
      };
    }

    // sort
    this.sortByHeader(column, order);

  }


  private createOrUpdateGridGraphData() {
    this.createOrUpdateData();
    this.populateGridData(this.currentGridSorting.column, this.currentGridSorting.order);
  }

}


export interface WaterfallGridData {
  key: string;
  prev: number;
  curr: number;
  benchmark: number;
}
