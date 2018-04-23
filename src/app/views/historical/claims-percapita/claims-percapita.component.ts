import { Component, OnInit, OnDestroy, OnChanges, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { WaterfallD3Chart } from '../../../model/d3chart/waterfall-d3-chart.model';
import { WaterfallChartConfig } from './../../../model/chart-config';
import * as elementResizeDetectorMaker from 'element-resize-detector';
import { WaterfallData, WaterfallBar } from './../../../model/d3chartData/waterfall-data.model';
import { Selector } from '../../../model/utils/selector.model';


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

  @Input() private benchmarkClaim: WaterfallData;
  @Input() private proposalClaim: WaterfallData;
  @Input() private conditionGroupTranslation: any;
  @Input() private claimMargin: any;



  // for tooltip
  @ViewChild('waterfallContainer') private waterfallContainer: ElementRef;

  // for svg container
  @ViewChild('proposalWaterfall') private proposalWaterfall: ElementRef;
  @ViewChild('benchmarkWaterfall') private benchmarkWaterfall: ElementRef;


  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });


  private benchmarkConditionGroupData: WaterfallBar[];
  private benchmarkGraphData: any[];

  private proposalConditionGroupData: WaterfallBar[];
  private proposalGraphData: any[];

  private benchmarkD3Chart: WaterfallD3Chart;
  private proposalD3Chart: WaterfallD3Chart;


  private zoom: boolean;

  private claimPerCapitaXDomain: string[];


  // new form
  sorting: string;

  constructor() { }


  ngOnInit() {
    console.log('claim PerCapita init');

    this.claimPerCapitaXDomain = Object.keys(this.conditionGroupTranslation).map(key => this.conditionGroupTranslation[key]);

    // console.log(this.claimMargin);

    this.sorting = 'Default';
    this.zoom = false;

    this.createChartData();
    this.createChart_benchmark();
    this.updateChart_benchmark();

    if (this.proposalClaim) {
      this.createChart_proposal();
      this.updateChart_proposal();
    }
  }


  ngOnChanges() {
    console.log('claim Per Capita on changes');
  }


  createChartData() {
    this.benchmarkConditionGroupData = this.benchmarkClaim.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaim.getGraphData();

    if (this.proposalClaim) {
      this.proposalConditionGroupData = this.proposalClaim.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaim.getGraphData();
    }
  }


  updateChartData(conditionGroup: string[], selectors: Selector[]) {
    // this.benchmarkClaim.updateGraphData(params);
    this.benchmarkClaim.updateData(conditionGroup, selectors);
    this.benchmarkClaim.createWaterfallData(this.sorting, 'percapita');

    this.benchmarkConditionGroupData = this.benchmarkClaim.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaim.getGraphData();

    if (this.proposalClaim) {
      // this.proposalClaim.updateGraphData(params);
      this.proposalClaim.updateData(conditionGroup, selectors);
      this.proposalClaim.createWaterfallData(this.sorting, 'percapita');

      this.proposalConditionGroupData = this.proposalClaim.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaim.getGraphData();
    }
  }


  createChart_benchmark() {
    const config: WaterfallChartConfig = {
      title: 'benchmark Cost Per Capita',
      margin: this.claimMargin,
      chartContainer: this.benchmarkWaterfall,
      domID: '#' + this.benchmarkWaterfall.nativeElement.id,
      xScaleDomain: this.claimPerCapitaXDomain,
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaim.getGraphMaxValue()] : [this.benchmarkClaim.getWaterfallMinBaseValue(), this.benchmarkClaim.getGraphMaxValue()],
      conditionGroupTranslation: this.conditionGroupTranslation
    };

    this.benchmarkD3Chart = new WaterfallD3Chart(config);
  }


  createChart_proposal() {
    const config: WaterfallChartConfig = {
      title: 'proposal Cost Per Capita',
      margin: this.claimMargin,
      chartContainer: this.proposalWaterfall,
      domID: '#' + this.proposalWaterfall.nativeElement.id,
      xScaleDomain: this.claimPerCapitaXDomain,
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaim.getGraphMaxValue()] : [this.proposalClaim.getWaterfallMinBaseValue(), this.proposalClaim.getGraphMaxValue()],
      conditionGroupTranslation: this.conditionGroupTranslation
    };
    this.proposalD3Chart = new WaterfallD3Chart(config);
  }


  updateChart() {
    this.updateChart_benchmark();
    if (this.proposalClaim) {
      this.updateChart_proposal();
    }
  }

  updateChart_benchmark() {
    const config: WaterfallChartConfig = {
      chartContainer: this.benchmarkWaterfall,
      domID: '#' + this.benchmarkWaterfall.nativeElement.id,
      tooltipDomID: '#' + 'waterfallTooltip',
      xScaleDomain: this.benchmarkClaim.getGraphData()[0].map(val => (val.data.key)).map(key => this.conditionGroupTranslation[key]),
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaim.getGraphMaxValue()] : [this.benchmarkClaim.getWaterfallMinBaseValue(), this.benchmarkClaim.getGraphMaxValue()],
      zoom: this.zoom,
      barData: this.benchmarkGraphData,
      previousYearKey: this.conditionGroupTranslation.PREVYEAR,
      currentYearKey: this.conditionGroupTranslation.CURRYEAR,
      toolTipParent: this.waterfallContainer,
      conditionGroupTranslation: this.conditionGroupTranslation
    };

    this.benchmarkD3Chart.updateChart(config);
  }

  updateChart_proposal() {
    const config: WaterfallChartConfig = {
      chartContainer: this.proposalWaterfall,
      domID: '#' + this.proposalWaterfall.nativeElement.id,
      tooltipDomID: '#' + 'waterfallTooltip',
      xScaleDomain: this.proposalClaim.getGraphData()[0].map(val => (val.data.key)).map(key => this.conditionGroupTranslation[key]),
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaim.getGraphMaxValue()] : [this.proposalClaim.getWaterfallMinBaseValue(), this.proposalClaim.getGraphMaxValue()],
      zoom: this.zoom,
      barData: this.proposalGraphData,
      previousYearKey: this.conditionGroupTranslation.PREVYEAR,
      currentYearKey: this.conditionGroupTranslation.CURRYEAR,
      toolTipParent: this.waterfallContainer,
      conditionGroupTranslation: this.conditionGroupTranslation

    };

    this.proposalD3Chart.updateChart(config);

  }


  ngOnDestroy() {
    console.log('claim PerCapita component destroy');
  }


  // toggleSwitch() {
  //   this.updateChart();
  // }


  changeSorting() {
    console.log('changeSorting');

    if (this.proposalClaim) {
      this.proposalClaim.sortConditionGroupData(this.sorting, Object.keys(this.conditionGroupTranslation));
      this.proposalGraphData = this.proposalClaim.getGraphData();
      this.updateChart_proposal();
    }

    this.benchmarkClaim.sortConditionGroupData(this.sorting, Object.keys(this.conditionGroupTranslation));
    this.benchmarkGraphData = this.benchmarkClaim.getGraphData();
    this.updateChart_benchmark();

  }


  listenToDivResize() {
    if (this.proposalClaim) {
      this.resizeDetector.listenTo(this.proposalWaterfall.nativeElement, (elem: HTMLElement) => {
        this.updateChart_proposal();
      });

    }
    this.resizeDetector.listenTo(this.benchmarkWaterfall.nativeElement, (elem: HTMLElement) => {
      this.updateChart_benchmark();
    });

    console.log('listen to claims per capita divs');
  }


  unListenToDivResize() {
    if (this.proposalClaim) {
      this.resizeDetector.removeAllListeners(this.proposalWaterfall.nativeElement);
    }
    this.resizeDetector.removeAllListeners(this.benchmarkWaterfall.nativeElement);

    console.log('unlistenclaims per capita divs');
  }


}
