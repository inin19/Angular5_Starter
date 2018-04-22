import { Component, OnInit, OnDestroy, Input, Output, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { TornadoD3Chart, ChartConfig } from '../../../model/d3chart/tornado-d3-chart.model';
import { TornadoData } from './../../../model/d3chartData/tornado-data.model';
import { Selector } from '../../../model/utils/selector.model';
import * as d3 from 'd3';
import * as elementResizeDetectorMaker from 'element-resize-detector';



@Component({
  selector: 'app-demographic',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './demographic.component.html',
  styleUrls: ['./demographic.component.scss']
})
export class DemographicComponent implements OnInit, OnDestroy {


  @Input() private proposalDemographic: TornadoData;
  @Input() private benchmarkDemographic: TornadoData;
  @Input() private ageGroup: string[];


  @Input() private demographicMargin: any;


  @ViewChild('proposalDemographic') private proposalDemoChartContainer: ElementRef;
  @ViewChild('benchmarkDemographic') private benchmarkDemoChartContainer: ElementRef;
  @ViewChild('combinedDemographic') private combinedDemoChartContainer: ElementRef;


  @ViewChild('demographicContainer') private demographicParent: ElementRef;
  @ViewChild('demographicCombinedContainer') private demographicCombinedParent: ElementRef;




  private proposalgraphData: any[];
  private proposalD3Chart: TornadoD3Chart;


  private benchmarkgraphData: any[];
  private benchmarkD3Chart: TornadoD3Chart;

  private combinedD3Chart: TornadoD3Chart;


  // for combined graph
  private graphDataCombined: any[];
  private maxPercentage: number;



  // chart element
  private margin: any = { top: 50, right: 20, bottom: 30, left: 50 };



  zoom: boolean;
  disabled: boolean;

  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });


  constructor() { }

  ngOnInit() {
    console.log('in demographic init');
    this.zoom = false;
    this.createChartData();
    this.createChart();
    this.listenToDivResize();
  }

  ngOnDestroy() {
    this.unListenToDivResize();
    console.log('demographic component destroyed');
  }


  listenToDivResize() {
    if (this.proposalDemographic) {
      this.resizeDetector.listenTo(this.proposalDemoChartContainer.nativeElement, (elem: HTMLElement) => {
        this.updateChart_proposal();
      });
      this.resizeDetector.listenTo(this.combinedDemoChartContainer.nativeElement, (elem: HTMLElement) => {
        this.updateChart_combined();
      });
    }
    this.resizeDetector.listenTo(this.benchmarkDemoChartContainer.nativeElement, (elem: HTMLElement) => {
      this.updateChart_benchmark();
    });

    console.log('listen to demographic divs');
  }



  unListenToDivResize() {
    if (this.proposalDemographic) {
      this.resizeDetector.removeAllListeners(this.combinedDemoChartContainer.nativeElement);
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

    // if proposal has demographic data
    if (this.proposalDemographic) {
      this.proposalgraphData = this.proposalDemographic.getGraphData();
      this.maxPercentage = this.proposalDemographic.getMaxPercentage() > this.benchmarkDemographic.getMaxPercentage() ? this.proposalDemographic.getMaxPercentage() : this.benchmarkDemographic.getMaxPercentage();

      this.proposalgraphData.forEach(el => {
        el.source = 'Client';
      });

      this.graphDataCombined = this.benchmarkgraphData.concat(this.proposalgraphData);
    } else {
      this.maxPercentage = this.benchmarkDemographic.getMaxPercentage();
    }


  }


  createChart() {
    if (this.proposalDemographic) {
      this.createChart_proposal();
      this.updateChart_proposal();
      // create combined chart
      this.createChart_combined();
      this.updateChart_combined();
    }
    this.createChart_benchmark();
    this.updateChart_benchmark();
  }


  updateChartData(selectors: Selector[]) {
    this.benchmarkDemographic.updateData(selectors);
    this.benchmarkgraphData = this.benchmarkDemographic.getGraphData();

    if (this.proposalDemographic) {
      this.proposalDemographic.updateData(selectors);
      this.proposalgraphData = this.proposalDemographic.getGraphData();
      this.maxPercentage = this.proposalDemographic.getMaxPercentage() > this.benchmarkDemographic.getMaxPercentage() ? this.proposalDemographic.getMaxPercentage() : this.benchmarkDemographic.getMaxPercentage();
    } else {
      this.maxPercentage = this.benchmarkDemographic.getMaxPercentage();
    }

  }


  updateChart() {
    this.updateChart_benchmark();
    if (this.proposalDemographic) {
      this.updateChart_proposal();
      this.updateChart_combined();
    }
  }

  createChart_proposal() {
    const chartConfig = {
      title: 'proposal',
      chartContainer: this.proposalDemoChartContainer,
      margin: this.margin,
      ageGroup: this.ageGroup,
      maxPercentage: this.maxPercentage,
      chartType: 1
    };
    this.proposalD3Chart = new TornadoD3Chart('#proposalDemographic', chartConfig);

  }

  createChart_benchmark() {
    const chartConfig = {
      title: 'benchmark',
      chartContainer: this.proposalDemoChartContainer,
      margin: this.margin,
      ageGroup: this.ageGroup,
      maxPercentage: this.maxPercentage,
      chartType: 2
    };

    this.benchmarkD3Chart = new TornadoD3Chart('#benchmarkDemographic', chartConfig);
  }


  createChart_combined() {
    const chartConfig = {
      title: 'client & benchmark',
      chartContainer: this.combinedDemoChartContainer,
      margin: this.margin,
      ageGroup: this.ageGroup,
      maxPercentage: this.maxPercentage,
      cluster: true,
      chartType: 3
    };
    this.combinedD3Chart = new TornadoD3Chart('#combinedDemographic', chartConfig);
  }


  updateChart_proposal() {
    const chartConfig = {
      chartContainer: this.proposalDemoChartContainer,
      ageGroup: this.ageGroup,
      maxPercentage: this.maxPercentage,
      createGrid: true
    };

    this.proposalD3Chart.updateChart('#proposalDemographic', chartConfig, this.proposalgraphData, this.demographicParent, '#demographicTooltip');
  }


  updateChart_benchmark() {
    const chartConfig = {
      chartContainer: this.benchmarkDemoChartContainer,
      ageGroup: this.ageGroup,
      maxPercentage: this.maxPercentage,
      createGrid: true
    };
    this.benchmarkD3Chart.updateChart('#benchmarkDemographic', chartConfig, this.benchmarkgraphData, this.demographicParent, '#demographicTooltip');
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

}
