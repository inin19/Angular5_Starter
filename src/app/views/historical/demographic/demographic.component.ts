import { TornadoD3Chart, TornadoD3CharCombined } from './../../../model/D3chart/tornado-d3-chart.model';
import { Component, OnInit, OnDestroy, Input, Output, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TornadoData } from './../../../model/D3chartData/tornado-data.model';
import { Selector } from './../../../model/utils/selector.model';

import { showHideTrigger } from './../../../model/animations/animations';

import * as d3 from 'd3';
import * as elementResizeDetectorMaker from 'element-resize-detector';



@Component({
  selector: 'app-demographic',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './demographic.component.html',
  styleUrls: ['./demographic.component.scss'],
  animations: [
    showHideTrigger
  ]
})


export class DemographicComponent implements OnInit, OnDestroy, AfterViewInit {


  static gridDetailColumnHeader = ['AGE_GROUP', 'FEMALE', 'MALE'];
  static gridCombinedColumnHeader = ['', 'CLIENT', 'BENCHMARK', 'CLIENT', 'BENCHMARK'];
  static gridSummaryColumnHeader = ['', 'FEMALE', 'MALE'];
  static percentage = 'PERCENTAGE';
  static averageAge = 'AVERAGE_AGE';

  @Input() proposalDemographic: TornadoData;
  @Input() benchmarkDemographic: TornadoData;
  @Input() private ageGroup: string[];
  @Input() private demographicMargin: any;


  @ViewChild('proposalDemographic') private proposalDemoChartContainer: ElementRef;
  @ViewChild('benchmarkDemographic') private benchmarkDemoChartContainer: ElementRef;
  @ViewChild('combinedDemographic') private combinedDemoChartContainer: ElementRef;


  @ViewChild('demographicContainer') private demographicParent: ElementRef;
  @ViewChild('demographicCombinedContainer') private demographicCombinedParent: ElementRef;


  private proposalgraphData: any[];
  private benchmarkgraphData: any[];

  private proposalD3Chart: TornadoD3Chart;
  private benchmarkD3Chart: TornadoD3Chart;
  private combinedD3Chart: TornadoD3CharCombined;

  private maxPercentage: number;
  private ageGroupReverse: string[];


  // grid
  proposalGridData: any[];
  proposalGridSummary: any;

  benchmarkGridData: any[];
  benchmarkGridSummary: any;



  width: number;
  height: number;



  // UI specific
  zoom = false;
  grid = false;
  gridDispaly = 'Grid';
  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });


  constructor() { }

  getPercentageKey() {
    return DemographicComponent.percentage;
  }

  getAverageAgeKey() {
    return DemographicComponent.averageAge;
  }

  ngOnInit() {
    console.log('in demographic init');
    this.ageGroupReverse = this.ageGroup.slice().reverse();
    this.createOrUpdateData();
  }


  ngAfterViewInit() {
    this.createOrUpdateChart();
    this.listenToDivResize();
  }

  ngOnDestroy() {
    this.unListenToDivResize();
    console.log('demographic component destroyed');
  }

  getGridDetailColumnHeader(): string[] {
    return DemographicComponent.gridDetailColumnHeader;
  }

  getGridCombinedColumnHeader(): string[] {
    return DemographicComponent.gridCombinedColumnHeader;
  }

  getGridSummaryColumnHeader(): string[] {
    return DemographicComponent.gridSummaryColumnHeader;
  }


  listenToDivResize() {
    if (this.proposalDemographic) {
      this.resizeDetector.listenTo(this.proposalDemoChartContainer.nativeElement, (elem: HTMLElement) => {
        this.createUpdateChart_proposal();
      });
      this.resizeDetector.listenTo(this.combinedDemoChartContainer.nativeElement, (elem: HTMLElement) => {
        this.createUpdateChart_combined();
      });
    }
    this.resizeDetector.listenTo(this.benchmarkDemoChartContainer.nativeElement, (elem: HTMLElement) => {
      this.createUpdateChart_benchmark();
    });

    console.log('listen to demographic divs');
  }



  unListenToDivResize() {
    this.resizeDetector.removeAllListeners(this.benchmarkDemoChartContainer.nativeElement);
    if (this.proposalDemographic) {
      this.resizeDetector.removeAllListeners(this.combinedDemoChartContainer.nativeElement);
      this.resizeDetector.removeAllListeners(this.proposalDemoChartContainer.nativeElement);
    }
    console.log('unlisten to demographic divs');
  }


  createOrUpdateData(selectors?: Selector[]) {


    if (selectors) {
      this.benchmarkDemographic.updateData(selectors);
      if (this.proposalDemographic) {
        this.proposalDemographic.updateData(selectors);
      }
    }

    // graph
    this.benchmarkgraphData = this.benchmarkDemographic.getGraphData();
    this.benchmarkgraphData.forEach(el => el.source = 'BENCHMARK');

    // grid
    this.benchmarkGridData = this.benchmarkDemographic.getGridDetail(this.ageGroupReverse);
    this.benchmarkGridSummary = this.benchmarkDemographic.getGridSummary();

    this.maxPercentage = Math.max((this.proposalDemographic) ? this.proposalDemographic.getMaxPercentage() : 0, this.benchmarkDemographic.getMaxPercentage());

    // if proposal has demographic data
    if (this.proposalDemographic) {
      this.proposalgraphData = this.proposalDemographic.getGraphData();
      this.proposalgraphData.forEach(el => el.source = 'PROPOSAL');

      this.proposalGridData = this.proposalDemographic.getGridDetail(this.ageGroupReverse);
      this.proposalGridSummary = this.proposalDemographic.getGridSummary();
    }
  }

  createOrUpdateChart() {
    this.createUpdateChart_benchmark();
    if (this.proposalDemographic) {
      this.createUpdateChart_proposal();
      this.createUpdateChart_combined();
    }
  }


  toggleMergeChart() {
    if (this.zoom === true) {
      setTimeout(() => {
        this.createUpdateChart_combined();
      });
    } else {
      setTimeout(() => {
        this.createUpdateChart_benchmark();
        this.createUpdateChart_proposal();
      });
    }
  }


  toggleGridGraph() {
    if (this.gridDispaly === 'Grid') {
      this.gridDispaly = 'Graph';
    } else {
      this.gridDispaly = 'Grid';
    }

    this.grid = !this.grid;

    setTimeout(() => {
      if (this.proposalDemographic) {
        this.createUpdateChart_combined();
        this.createUpdateChart_proposal();
      }
      this.createUpdateChart_benchmark();
    });

  }


  private createUpdateChart_proposal() {
    if (this.proposalD3Chart) {
      this.proposalD3Chart.updateChart(
        this.demographicParent,
        this.proposalDemoChartContainer,
        this.demographicMargin,
        this.maxPercentage,
        this.ageGroup,
        this.proposalgraphData,
        '#demographicTooltip',
        'PROPOSAL'
      );
    } else {
      this.proposalD3Chart = new TornadoD3Chart(
        this.demographicParent,
        this.proposalDemoChartContainer,
        this.demographicMargin,
        this.maxPercentage,
        this.ageGroup,
        this.proposalgraphData,
        '#demographicTooltip',
        'PROPOSAL'
      );
    }
  }


  private createUpdateChart_benchmark() {
    if (this.benchmarkD3Chart) {
      this.benchmarkD3Chart.updateChart(
        this.demographicParent,
        this.benchmarkDemoChartContainer,
        this.demographicMargin,
        this.maxPercentage,
        this.ageGroup,
        this.benchmarkgraphData,
        '#demographicTooltip',
        'BENCHMARK'
      );

    } else {
      this.benchmarkD3Chart = new TornadoD3Chart(
        this.demographicParent,
        this.benchmarkDemoChartContainer,
        this.demographicMargin,
        this.maxPercentage,
        this.ageGroup,
        this.benchmarkgraphData,
        '#demographicTooltip',
        'BENCHMARK'
      );
    }
  }


  private createUpdateChart_combined() {
    if (this.combinedD3Chart) {
      this.combinedD3Chart.updateChart(
        this.demographicCombinedParent,
        this.combinedDemoChartContainer,
        this.demographicMargin,
        this.maxPercentage,
        this.ageGroup,
        this.benchmarkgraphData.concat(this.proposalgraphData),
        '#demographicCombinedTooltip',
      );
    } else {
      this.combinedD3Chart = new TornadoD3CharCombined(
        this.demographicCombinedParent,
        this.combinedDemoChartContainer,
        this.demographicMargin,
        this.maxPercentage,
        this.ageGroup,
        this.benchmarkgraphData.concat(this.proposalgraphData),
        '#demographicCombinedTooltip',
      );
    }
  }

  // NEW onResize
  // private onResized(event: ResizedEvent, element: string): void {
  //   switch (element) {
  //     case 'benchmark': {
  //       this.createUpdateChart_benchmark();
  //       break;
  //     }
  //     case 'proposal': {
  //       this.createUpdateChart_proposal();
  //       break;
  //     }
  //     case 'combined': {
  //       this.createUpdateChart_combined();
  //       break;
  //     }
  //   }
  // }

}
