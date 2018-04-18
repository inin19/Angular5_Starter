import { Component, OnInit, OnDestroy, OnChanges, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { WaterfallData, WaterfallBar, ChartUpdateParameters } from '../../../model/waterfallData';
import { WaterfallD3Chart } from '../../../model/waterfall-d3-chart.model';
// import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WaterfallChartConfig } from './../../../model/chart-config';
import * as elementResizeDetectorMaker from 'element-resize-detector';


@Component({
  selector: 'app-claims',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit, OnDestroy, OnChanges {

  // temp
  private static stackColor = {
    Base: '#FFFFFF',
    Fall: '#FFA500',
    Rise: '#0000FF'
  };


  private static conditionGroupTranslation = {
    'PREVYEAR': '2015',
    'CONDITION_GROUPING_CIRCULATORY': 'Circulatory',
    'CONDITION_GROUPING_DIGESTIVE': 'Digestive',
    'CONDITION_GROUPING_INJURY_&_ACCIDENT': 'Injury & Accident',
    'CONDITION_GROUPING_MENTAL_DISORDERS': 'Mental Disorders',
    'CONDITION_GROUPING_MUSCULOSKELETAL': 'Musculoskeletal',
    'CONDITION_GROUPING_NEOPLASMS': 'Neoplasms',
    'CONDITION_GROUPING_PREGNANCY': 'Pregnancy',
    'CONDITION_GROUPING_RESPIRATORY': 'Respiratory',
    'CONDITION_GROUPING_SS_&_IDC': 'SS & IDC',
    'CONDITION_GROUPING_OTHER': 'Other',
    'CURRYEAR': '2016'
  };

  static UKConditionGroupKeys = Object.keys(ClaimsComponent.conditionGroupTranslation).filter(d => ['CURRYEAR', 'PREVYEAR'].indexOf(d) === -1);


  @Input() private benchmarkClaim: WaterfallData;
  @Input() private proposalClaim: WaterfallData;
  @Input() private ageGroup: string;
  @Input() private hasClaimData: boolean;



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

  private margin: any = { top: 60, right: 20, bottom: 80, left: 50 };

  zoom = false;
  private xDomainDisplay = Object.keys(ClaimsComponent.conditionGroupTranslation).map(key => ClaimsComponent.conditionGroupTranslation[key]);

  // new form
  sorting: string;

  constructor() { }


  ngOnInit() {
    console.log('claim PerCapita init');

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


  updateChartData(params: ChartUpdateParameters) {
    this.benchmarkClaim.updateGraphData(params);
    this.benchmarkConditionGroupData = this.benchmarkClaim.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaim.getGraphData();

    if (this.proposalClaim) {
      this.proposalClaim.updateGraphData(params);
      this.proposalConditionGroupData = this.proposalClaim.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaim.getGraphData();
    }
  }


  createChart_benchmark() {
    const config: WaterfallChartConfig = {
      title: 'benchmark Cost Per Capita',
      margin: this.margin,
      chartContainer: this.benchmarkWaterfall,
      domID: '#' + this.benchmarkWaterfall.nativeElement.id,
      xScaleDomain: this.xDomainDisplay,
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaim.getGraphMaxValue()] : [this.benchmarkClaim.getWaterfallMinBaseValue(), this.benchmarkClaim.getGraphMaxValue()],
      conditionGroupTranslation: ClaimsComponent.conditionGroupTranslation
    };

    this.benchmarkD3Chart = new WaterfallD3Chart(config);
  }


  createChart_proposal() {
    const config: WaterfallChartConfig = {
      title: 'proposal Cost Per Capita',
      margin: this.margin,
      chartContainer: this.proposalWaterfall,
      domID: '#' + this.proposalWaterfall.nativeElement.id,
      xScaleDomain: this.xDomainDisplay,
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaim.getGraphMaxValue()] : [this.proposalClaim.getWaterfallMinBaseValue(), this.proposalClaim.getGraphMaxValue()],
      conditionGroupTranslation: ClaimsComponent.conditionGroupTranslation
    };
    this.proposalD3Chart = new WaterfallD3Chart(config);
  }

  updateChart_benchmark() {
    const config: WaterfallChartConfig = {
      chartContainer: this.benchmarkWaterfall,
      domID: '#' + this.benchmarkWaterfall.nativeElement.id,
      tooltipDomID: '#' + 'waterfallTooltip',
      xScaleDomain: this.benchmarkClaim.getGraphData()[0].map(val => (val.data.key)).map(key => ClaimsComponent.conditionGroupTranslation[key]),
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaim.getGraphMaxValue()] : [this.benchmarkClaim.getWaterfallMinBaseValue(), this.benchmarkClaim.getGraphMaxValue()],
      stackColor: ClaimsComponent.stackColor,
      zoom: this.zoom,
      barData: this.benchmarkGraphData,
      previousYearKey: '2015',
      currentYearKey: '2016',
      toolTipParent: this.waterfallContainer,
      conditionGroupTranslation: ClaimsComponent.conditionGroupTranslation
    };

    this.benchmarkD3Chart.updateChart(config);
  }

  updateChart_proposal() {
    const config: WaterfallChartConfig = {
      chartContainer: this.proposalWaterfall,
      domID: '#' + this.proposalWaterfall.nativeElement.id,
      tooltipDomID: '#' + 'waterfallTooltip',
      xScaleDomain: this.proposalClaim.getGraphData()[0].map(val => (val.data.key)).map(key => ClaimsComponent.conditionGroupTranslation[key]),
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaim.getGraphMaxValue()] : [this.proposalClaim.getWaterfallMinBaseValue(), this.proposalClaim.getGraphMaxValue()],
      stackColor: ClaimsComponent.stackColor,
      zoom: this.zoom,
      barData: this.proposalGraphData,
      previousYearKey: '2015',
      currentYearKey: '2016',
      toolTipParent: this.waterfallContainer,
      conditionGroupTranslation: ClaimsComponent.conditionGroupTranslation

    };

    // this.proposalClaim.getGraphData()[0].map(val => (val.data.key))

    this.proposalD3Chart.updateChart(config);

  }


  updateAllCharts() {
    this.updateChart_benchmark();
    if (this.proposalClaim) {
      this.updateChart_proposal();
    }
  }


  ngOnDestroy() {
    console.log('claim PerCapita component destroy');
  }


  toggleSwitch() {
    this.updateAllCharts();
    // if (this.proposalClaim) {
    //   this.updateChart_proposal();
    // }
    // this.updateChart_benchmark();
  }


  changeSorting() {
    console.log('changeSorting');

    if (this.proposalClaim) {
      this.proposalClaim.sortConditionGroupData(this.sorting, Object.keys(ClaimsComponent.conditionGroupTranslation));
      this.proposalGraphData = this.proposalClaim.getGraphData();
      this.updateChart_proposal();
    }

    this.benchmarkClaim.sortConditionGroupData(this.sorting, Object.keys(ClaimsComponent.conditionGroupTranslation));
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
