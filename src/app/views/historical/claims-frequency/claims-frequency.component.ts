import { Component, OnInit, OnDestroy, OnChanges, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { WaterfallChartConfig } from './../../../model/utils/chart-config';
import * as elementResizeDetectorMaker from 'element-resize-detector';
import { WaterfallData, WaterfallBar } from './../../../model/D3chartData/waterfall-data.model';
import { Selector } from './../../../model/utils/selector.model';
import { WaterfallD3Chart } from './../../../model/D3chart/waterfall-d3-chart.model';


@Component({
  selector: 'app-claims-frequency',
  templateUrl: './claims-frequency.component.html',
  styleUrls: ['./claims-frequency.component.scss']
})
export class ClaimsFrequencyComponent implements OnInit, OnChanges, OnDestroy {

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


  private zoom: boolean;

  private claimPerCapitaXDomain: string[];


  // new form
  sorting: string;



  constructor() { }



  ngOnInit() {
    console.log('claim frequency init');

    this.claimPerCapitaXDomain = Object.keys(this.conditionGroupTranslation).map(key => this.conditionGroupTranslation[key]);

    // console.log(this.claimMargin);

    this.sorting = 'Default';
    this.zoom = false;

    this.createChartData();
    this.createChart_benchmark();
    this.updateChart_benchmark();

    if (this.proposalClaimFrequency) {
      this.createChart_proposal();
      this.updateChart_proposal();
    }
  }


  ngOnChanges() {
    console.log('claim frequncey on changes');
  }



  createChartData() {
    this.benchmarkConditionGroupData = this.benchmarkClaimFrequency.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimFrequency.getGraphData();

    if (this.proposalClaimFrequency) {
      this.proposalConditionGroupData = this.proposalClaimFrequency.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimFrequency.getGraphData();
    }
  }


  updateChartData(conditionGroup: string[], selectors: Selector[]) {
    // this.benchmarkClaim.updateGraphData(params);
    this.benchmarkClaimFrequency.updateData(conditionGroup, selectors);
    this.benchmarkClaimFrequency.createWaterfallData(this.sorting, 'frequency');

    this.benchmarkConditionGroupData = this.benchmarkClaimFrequency.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimFrequency.getGraphData();

    if (this.proposalClaimFrequency) {
      // this.proposalClaim.updateGraphData(params);
      this.proposalClaimFrequency.updateData(conditionGroup, selectors);
      this.proposalClaimFrequency.createWaterfallData(this.sorting, 'frequency');

      this.proposalConditionGroupData = this.proposalClaimFrequency.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimFrequency.getGraphData();
    }
  }


  createChart_benchmark() {
    const config: WaterfallChartConfig = {
      title: 'benchmark claims frequency',
      margin: this.claimMargin,
      chartContainer: this.benchmarkClaimsFrequency,
      domID: '#' + this.benchmarkClaimsFrequency.nativeElement.id,
      xScaleDomain: this.claimPerCapitaXDomain,
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaimFrequency.getGraphMaxValue()] : [this.benchmarkClaimFrequency.getWaterfallMinBaseValue(), this.benchmarkClaimFrequency.getGraphMaxValue()],
      conditionGroupTranslation: this.conditionGroupTranslation,
      chartType: WaterfallD3Chart.chartType.FREQUENCY

    };

    this.benchmarkD3Chart = new WaterfallD3Chart(config);
  }


  createChart_proposal() {
    const config: WaterfallChartConfig = {
      title: 'proposal claims frequency',
      margin: this.claimMargin,
      chartContainer: this.proposalClaimsFrequency,
      domID: '#' + this.proposalClaimsFrequency.nativeElement.id,
      xScaleDomain: this.claimPerCapitaXDomain,
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaimFrequency.getGraphMaxValue()] : [this.proposalClaimFrequency.getWaterfallMinBaseValue(), this.proposalClaimFrequency.getGraphMaxValue()],
      conditionGroupTranslation: this.conditionGroupTranslation,
      chartType: WaterfallD3Chart.chartType.FREQUENCY
    };
    this.proposalD3Chart = new WaterfallD3Chart(config);
  }


  updateChart() {
    this.updateChart_benchmark();
    if (this.proposalClaimFrequency) {
      this.updateChart_proposal();
    }
  }

  updateChart_benchmark() {
    const config: WaterfallChartConfig = {
      chartContainer: this.benchmarkClaimsFrequency,
      domID: '#' + this.benchmarkClaimsFrequency.nativeElement.id,
      tooltipDomID: '#' + 'claimsFrequencyTooltip',
      xScaleDomain: this.benchmarkClaimFrequency.getGraphData()[0].map(val => (val.data.key)).map(key => this.conditionGroupTranslation[key]),
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaimFrequency.getGraphMaxValue()] : [this.benchmarkClaimFrequency.getWaterfallMinBaseValue(), this.benchmarkClaimFrequency.getGraphMaxValue()],
      zoom: this.zoom,
      barData: this.benchmarkGraphData,
      previousYearKey: this.conditionGroupTranslation.PREVYEAR,
      currentYearKey: this.conditionGroupTranslation.CURRYEAR,
      toolTipParent: this.claimsFrequencyContainer,
      conditionGroupTranslation: this.conditionGroupTranslation,
      chartType: WaterfallD3Chart.chartType.FREQUENCY
    };

    this.benchmarkD3Chart.updateChart(config);
  }

  updateChart_proposal() {
    const config: WaterfallChartConfig = {
      chartContainer: this.proposalClaimsFrequency,
      domID: '#' + this.proposalClaimsFrequency.nativeElement.id,
      tooltipDomID: '#' + 'claimsFrequencyTooltip',
      xScaleDomain: this.proposalClaimFrequency.getGraphData()[0].map(val => (val.data.key)).map(key => this.conditionGroupTranslation[key]),
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaimFrequency.getGraphMaxValue()] : [this.proposalClaimFrequency.getWaterfallMinBaseValue(), this.proposalClaimFrequency.getGraphMaxValue()],
      zoom: this.zoom,
      barData: this.proposalGraphData,
      previousYearKey: this.conditionGroupTranslation.PREVYEAR,
      currentYearKey: this.conditionGroupTranslation.CURRYEAR,
      toolTipParent: this.claimsFrequencyContainer,
      conditionGroupTranslation: this.conditionGroupTranslation,
      chartType: WaterfallD3Chart.chartType.FREQUENCY
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

    if (this.proposalClaimFrequency) {
      this.proposalClaimFrequency.sortConditionGroupData(this.sorting, Object.keys(this.conditionGroupTranslation));
      this.proposalGraphData = this.proposalClaimFrequency.getGraphData();
      this.updateChart_proposal();
    }

    this.benchmarkClaimFrequency.sortConditionGroupData(this.sorting, Object.keys(this.conditionGroupTranslation));
    this.benchmarkGraphData = this.benchmarkClaimFrequency.getGraphData();
    this.updateChart_benchmark();

  }




  listenToDivResize() {
    if (this.proposalClaimFrequency) {
      this.resizeDetector.listenTo(this.proposalClaimsFrequency.nativeElement, (elem: HTMLElement) => {
        this.updateChart_proposal();
      });

    }
    this.resizeDetector.listenTo(this.benchmarkClaimsFrequency.nativeElement, (elem: HTMLElement) => {
      this.updateChart_benchmark();
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


}
