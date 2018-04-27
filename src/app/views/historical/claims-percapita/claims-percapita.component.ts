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

  @Input() private countryCode: string;


  @Input() private conditionGroups: string[];
  @Input() private claimSelectors: Selector[];

  // HistoricalUkComponent.conditionGroups

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


  private zoom: boolean;

  private claimPerCapitaXDomain: string[];


  // new form
  sorting: string;

  // [claim, settled]
  amountType: string;


  constructor() { }


  ngOnInit() {
    console.log('claim PerCapita init');

    console.log('conutry code in percapita: ', this.countryCode);

    this.claimPerCapitaXDomain = Object.keys(this.conditionGroupTranslation).map(key => this.conditionGroupTranslation[key]);


    // settled
    // this.amountType = 'settled';
    this.amountType = 'claim';


    // console.log(this.claimMargin);

    this.sorting = 'Default';
    this.zoom = false;

    this.createChartData();
    this.createChart_benchmark();
    this.updateChart_benchmark();

    if (this.proposalClaimPerCapita) {
      this.createChart_proposal();
      this.updateChart_proposal();
    }
  }


  ngOnChanges() {
    console.log('claim Per Capita on changes');
  }


  createChartData() {

    this.benchmarkConditionGroupData = this.benchmarkClaimPerCapita.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimPerCapita.getGraphData();

    if (this.proposalClaimPerCapita) {
      this.proposalConditionGroupData = this.proposalClaimPerCapita.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimPerCapita.getGraphData();
    }
  }


  // ???
  updateChartData(conditionGroup: string[], selectors: Selector[]) {
    // this.benchmarkClaim.updateGraphData(params);
    this.benchmarkClaimPerCapita.updateData(conditionGroup, selectors);


    // console.log(this.benchmarkClaimPerCapita.getClaimsAggregateDataTotal());

    // this.benchmarkClaimPerCapita.getClaimsAggregateData().forEach(element => {
    //   console.log(element);
    // });

    this.benchmarkClaimPerCapita.createWaterfallData(this.sorting, WaterfallData.type.PERCAPITA, this.amountType);

    this.benchmarkConditionGroupData = this.benchmarkClaimPerCapita.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimPerCapita.getGraphData();


    this.benchmarkConditionGroupData.forEach(element => {
      console.log(element);
    });


    if (this.proposalClaimPerCapita) {
      // this.proposalClaim.updateGraphData(params);
      this.proposalClaimPerCapita.updateData(conditionGroup, selectors);
      this.proposalClaimPerCapita.createWaterfallData(this.sorting, WaterfallData.type.PERCAPITA, this.amountType);

      this.proposalConditionGroupData = this.proposalClaimPerCapita.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimPerCapita.getGraphData();
    }
  }


  createChart_benchmark() {
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


  createChart_proposal() {
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


  updateChart() {
    this.updateChart_benchmark();
    if (this.proposalClaimPerCapita) {
      this.updateChart_proposal();
    }
  }

  updateChart_benchmark() {
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

  updateChart_proposal() {
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


  ngOnDestroy() {
    console.log('claim PerCapita component destroy');
  }


  // toggleSwitch() {
  //   this.updateChart();
  // }


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
    this.updateChart();
  }


}
