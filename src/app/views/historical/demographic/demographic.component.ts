import { TornadoD3Chart, ChartConfig, TornadoD3ChartNew } from './../../../model/D3chart/tornado-d3-chart.model';
import { Component, OnInit, OnDestroy, Input, Output, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { TornadoData } from './../../../model/D3chartData/tornado-data.model';
import { Selector } from './../../../model/utils/selector.model';

import * as d3 from 'd3';
import * as elementResizeDetectorMaker from 'element-resize-detector';

@Component({
  selector: 'app-demographic',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './demographic.component.html',
  styleUrls: ['./demographic.component.scss']
})


export class DemographicComponent implements OnInit, OnDestroy {


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





  private ageGroupReverse: string[];


  private proposalgraphData: any[];
  // private proposalD3Chart: TornadoD3Chart;

  private proposalD3Chart: TornadoD3ChartNew;

  private benchmarkgraphData: any[];
  // private benchmarkD3Chart: TornadoD3Chart;
  private benchmarkD3Chart: TornadoD3ChartNew;

  private combinedD3Chart: TornadoD3Chart;


  // for combined graph
  private graphDataCombined: any[];
  private maxPercentage: number;


  // grid
  proposalGridData: any[];
  benchmarkGridData: any[];


  zoom: boolean;
  disabled: boolean;

  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });

  grid: false;

  gridDispaly = 'Grid';

  benchmarkGridSummary: any;
  proposalGridSummary: any;

  hasClaim = false;

  constructor() { }

  getPercentageKey() {
    return DemographicComponent.percentage;
  }

  getAverageAgeKey() {
    return DemographicComponent.averageAge;
  }

  ngOnInit() {
    console.log('in demographic init');

    if (this.proposalDemographic) {
      this.hasClaim = true;
    }


    this.ageGroupReverse = this.ageGroup.slice().reverse();

    // console.log(this.ageGroupReverse);
    this.zoom = false;
    this.createChartData();
    this.creatOrUpdateChart();
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

      // this.resizeDetector.listenTo(this.combinedDemoChartContainer.nativeElement, (elem: HTMLElement) => {
      //   this.updateChart_combined();
      // });
    }
    this.resizeDetector.listenTo(this.benchmarkDemoChartContainer.nativeElement, (elem: HTMLElement) => {
      this.createUpdateChart_benchmark();
    });

    console.log('listen to demographic divs');
  }



  unListenToDivResize() {
    if (this.proposalDemographic) {
      // this.resizeDetector.removeAllListeners(this.combinedDemoChartContainer.nativeElement);
      this.resizeDetector.removeAllListeners(this.proposalDemoChartContainer.nativeElement);
    }
    this.resizeDetector.removeAllListeners(this.benchmarkDemoChartContainer.nativeElement);

    console.log('unlisten to demographic divs');
  }


  createChartData() {
    this.benchmarkgraphData = this.benchmarkDemographic.getGraphData();
    this.benchmarkgraphData.forEach(el => {
      el.source = 'Benchmark';
    });

    this.benchmarkGridData = this.benchmarkDemographic.getGridDetail(this.ageGroupReverse);
    this.benchmarkGridSummary = this.benchmarkDemographic.getGridSummary();

    // if proposal has demographic data
    if (this.proposalDemographic) {
      this.proposalgraphData = this.proposalDemographic.getGraphData();

      this.proposalGridSummary = this.proposalDemographic.getGridSummary();

      this.maxPercentage = this.proposalDemographic.getMaxPercentage() > this.benchmarkDemographic.getMaxPercentage() ? this.proposalDemographic.getMaxPercentage() : this.benchmarkDemographic.getMaxPercentage();

      this.proposalgraphData.forEach(el => {
        el.source = 'Client';
      });

      this.graphDataCombined = this.benchmarkgraphData.concat(this.proposalgraphData);

      // grid
      this.proposalGridData = this.proposalDemographic.getGridDetail(this.ageGroupReverse);




    } else {
      this.maxPercentage = this.benchmarkDemographic.getMaxPercentage();
    }
  }


  creatOrUpdateChart() {
    this.createUpdateChart_benchmark();

    if (this.proposalDemographic) {
      this.createUpdateChart_proposal();

      // create combined chart
      this.createChart_combined();
      this.updateChart_combined();
    }

  }





  updateChartData(selectors: Selector[]) {
    this.benchmarkDemographic.updateData(selectors);
    this.benchmarkgraphData = this.benchmarkDemographic.getGraphData();

    this.benchmarkGridData = this.benchmarkDemographic.getGridDetail(this.ageGroupReverse);

    this.benchmarkGridSummary = this.benchmarkDemographic.getGridSummary();

    if (this.proposalDemographic) {
      this.proposalDemographic.updateData(selectors);
      this.proposalgraphData = this.proposalDemographic.getGraphData();

      this.proposalGridSummary = this.proposalDemographic.getGridSummary();

      this.maxPercentage = this.proposalDemographic.getMaxPercentage() > this.benchmarkDemographic.getMaxPercentage() ? this.proposalDemographic.getMaxPercentage() : this.benchmarkDemographic.getMaxPercentage();

      // grid
      this.proposalGridData = this.proposalDemographic.getGridDetail(this.ageGroupReverse);
    } else {
      this.maxPercentage = this.benchmarkDemographic.getMaxPercentage();
    }
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
        '#demographicTooltip'
      );
    } else {
      this.proposalD3Chart = new TornadoD3ChartNew(
        this.demographicParent,
        this.proposalDemoChartContainer,
        this.demographicMargin,
        this.maxPercentage,
        this.ageGroup,
        this.proposalgraphData,
        '#demographicTooltip'
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
        '#demographicTooltip'
      );

    } else {
      this.benchmarkD3Chart = new TornadoD3ChartNew(
        this.demographicParent,
        this.benchmarkDemoChartContainer,
        this.demographicMargin,
        this.maxPercentage,
        this.ageGroup,
        this.benchmarkgraphData,
        '#demographicTooltip'
      );
    }
  }




  // to do?
  createChart_combined() {
    if (this.combinedDemoChartContainer.nativeElement.offsetWidth === 0 && this.combinedDemoChartContainer.nativeElement.offsetHeight === 0) {
      console.log('combined graph 0');
    } else {
      if (!this.combinedD3Chart) {
        const chartConfig = {
          title: 'client & benchmark',
          chartContainer: this.combinedDemoChartContainer,
          margin: this.demographicMargin,
          ageGroup: this.ageGroup,
          maxPercentage: this.maxPercentage,
          cluster: true,
          chartType: 3
        };
        this.combinedD3Chart = new TornadoD3Chart('#combinedDemographic', chartConfig);
      }
    }
  }




  updateChart_proposal() {
    // const chartConfig = {
    //   chartContainer: this.proposalDemoChartContainer,
    //   ageGroup: this.ageGroup,
    //   maxPercentage: this.maxPercentage,
    //   createGrid: true
    // };

    // this.proposalD3Chart.updateChart('#proposalDemographic', chartConfig, this.proposalgraphData, this.demographicParent, '#demographicTooltip');
  }


  updateChart_benchmark() {
    const chartConfig = {
      chartContainer: this.benchmarkDemoChartContainer,
      ageGroup: this.ageGroup,
      maxPercentage: this.maxPercentage,
      createGrid: true
    };
    // this.benchmarkD3Chart.updateChart('#benchmarkDemographic', chartConfig, this.benchmarkgraphData, this.demographicParent, '#demographicTooltip');
  }

  updateChart_combined() {
    const chartConfig = {
      chartContainer: this.combinedDemoChartContainer,
      ageGroup: this.ageGroup,
      maxPercentage: this.maxPercentage,
      cluster: true,
      createGrid: true
    };

    this.combinedD3Chart.updateChart('#combinedDemographic', chartConfig, this.graphDataCombined, this.demographicCombinedParent, '#demographicCombinedTooltip');

  }

  toggleMergeChart() {

    if (this.zoom === true) {
      setTimeout(() => {
        this.updateChart_combined();
      });
    } else {
      setTimeout(() => {
        this.updateChart_proposal();
        this.updateChart_benchmark();
      });
    }
  }


  toggleGridGraph() {
    console.log('toggle Grid Graph');
    if (this.gridDispaly === 'Grid') {
      this.gridDispaly = 'Graph';
    } else {
      this.gridDispaly = 'Grid';
    }


    setTimeout(() => {
      if (this.proposalDemographic) {
        this.updateChart_combined();
        this.updateChart_proposal();
      }
      this.updateChart_benchmark();
    });

  }


}
