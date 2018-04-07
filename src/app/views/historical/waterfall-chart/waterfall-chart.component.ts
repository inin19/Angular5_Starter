import { WaterfallChartConfig } from './../../../model/chart-config';
import { WaterfallD3Chart } from './../../../model/waterfall-d3-chart.model';
import { Component, Input, ViewChild, ViewEncapsulation, ElementRef, HostListener, OnInit, OnDestroy, OnChanges } from '@angular/core';
import * as elementResizeDetectorMaker from 'element-resize-detector';
import { WaterfallData } from './../../../model/waterfallData';


@Component({
  selector: 'app-waterfall-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.scss']
})
export class WaterfallChartComponent implements OnInit, OnDestroy, OnChanges {

  // temp
  private static stackColor = {
    Base: '#FFFFFF',
    Fall: '#FFA500',
    Rise: '#0000FF'
  };

  // eventName = 'resize';
  // sensor: BoundSensor;


  @Input() private benchmarkClaimsJSON: any[];
  @Input() private benchmakrTotalMemberCount: any[];

  @Input() private proposalClaimsJSON: any[];
  @Input() private proposalTotalMemberCount: any[];



  @ViewChild('waterfallContainer') private waterfallContainer: ElementRef;
  @ViewChild('proposalWaterfall') private proposalWaterfall: ElementRef;
  @ViewChild('benchmarkWaterfall') private benchmarkWaterfall: ElementRef;



  private benchmarkClaim: WaterfallData;
  private benchmarkConditionGroupData: any[];
  private benchmarkGraphData: any[];

  private proposalClaim: WaterfallData;
  private proposalConditionGroupData: any[];
  private proposalGraphData: any[];


  private benchmarkD3Chart: WaterfallD3Chart;
  private proposalD3Chart: WaterfallD3Chart;


  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });
  private margin: any = { top: 60, right: 20, bottom: 80, left: 50 };


  zoom = false;


  constructor() { }




  ngOnInit() {

    console.log('waterfall init');


    // listen to div resize event
    this.resizeDetector.listenTo(this.benchmarkWaterfall.nativeElement, (elem: HTMLElement) => {

      setTimeout(() => {
        this.updateChart_benchmark();
      }, 100);
    });


  }



  ngOnChanges() {
    console.log('waterfall on changes!');

    if (!this.benchmarkD3Chart) {
      this.createChartData();
      this.createChart_benchmark();
      this.updateChart_benchmark();

      if (this.proposalClaimsJSON) {
        this.createChart_proposal();
      }

      console.log('waterfall data created');
    }


  }

  createChartData() {

    // console.log(this.benchmakrTotalMemberCount);
    this.benchmarkClaim = new WaterfallData(this.benchmarkClaimsJSON, this.benchmakrTotalMemberCount);
    this.benchmarkConditionGroupData = this.benchmarkClaim.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaim.getGraphData();

    if (this.proposalClaimsJSON) {
      console.log('has proposal Claim data');

      this.proposalClaim = new WaterfallData(this.proposalClaimsJSON, this.proposalTotalMemberCount);
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
      xScaleDomain: this.benchmarkClaim.getGraphData()[0].map(val => (val.data.key)),
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaim.getGraphMaxValue()] : [this.benchmarkClaim.getWaterfallMinBaseValue(), this.benchmarkClaim.getGraphMaxValue()]
    }

    this.benchmarkD3Chart = new WaterfallD3Chart(config);
  }


  createChart_proposal() {
    const config: WaterfallChartConfig = {
      title: 'proposal Cost Per Capita',
      margin: this.margin,
      chartContainer: this.proposalWaterfall,
      domID: '#' + this.proposalWaterfall.nativeElement.id,
      xScaleDomain: this.proposalClaim.getGraphData()[0].map(val => (val.data.key)),
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaim.getGraphMaxValue()] : [this.proposalClaim.getWaterfallMinBaseValue(), this.proposalClaim.getGraphMaxValue()]
    }
    this.proposalD3Chart = new WaterfallD3Chart(config);
  }

  updateChart_benchmark() {
    const config: WaterfallChartConfig = {
      chartContainer: this.benchmarkWaterfall,
      domID: '#' + this.benchmarkWaterfall.nativeElement.id,
      tooltipDomID: '#' + 'waterfallTooltip',
      xScaleDomain: this.benchmarkClaim.getGraphData()[0].map(val => (val.data.key)),
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaim.getGraphMaxValue()] : [this.benchmarkClaim.getWaterfallMinBaseValue(), this.benchmarkClaim.getGraphMaxValue()],
      stackColor: WaterfallChartComponent.stackColor,
      zoom: this.zoom,
      barData: this.benchmarkGraphData,
      previousYearKey: '2015',
      currentYearKey: '2016',
      toolTipParent: this.waterfallContainer
    }


    this.benchmarkD3Chart.updateChart(config);

    // const chartConfig = {
    //   chartContainer: this.benchmarkDemoChartContainer,
    //   ageGroup: this.ageGroup,
    //   maxPercentage: this.maxPercentage,
    //   createGrid: true
    // };
    // this.benchmarkD3Chart.updateChart('#benchmarkDemographic', chartConfig, this.benchmarkgraphData, this.demographicParent, '#demographicTooltip');

  }


  ngOnDestroy() {
    // this.sensor.detachSensor();

    this.resizeDetector.removeAllListeners(this.benchmarkWaterfall.nativeElement);

    // this.resizeDetector.uninstall(this.benchmarkWaterfall.nativeElement);

    console.log('waterfall is destroyed!');
  }



}
