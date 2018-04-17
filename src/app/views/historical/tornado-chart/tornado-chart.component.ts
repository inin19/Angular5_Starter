import { Component, Input, ViewChild, ViewEncapsulation, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { TornadoChartData, ChartUpdateParameters } from '../../../model/tornadoData';
import { TornadoD3Chart, ChartConfig } from '../../../model/tornado-d3-chart.model';
import { Selector } from '../../../model/utils/selector.model';
import { animate, state, style, transition, trigger } from '@angular/animations';


import * as elementResizeDetectorMaker from 'element-resize-detector';
import * as d3 from 'd3';

type PaneType1 = 'left' | 'right';
// type PaneType2 = 'left' | 'right';



@Component({
  selector: 'app-tornado-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tornado-chart.component.html',
  styleUrls: ['./tornado-chart.component.scss'],
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class TornadoChartComponent implements OnInit, OnDestroy {

  static barType = ['proposal', 'benchmark'];


  @Input() activePane: PaneType1 = 'left';


  disabled: boolean;


  @Input() private proposalDemographicJSON: any[];
  @Input() private benchmarkDemographicJSON: any[];
  @Input() private ageGroup: string[];

  @ViewChild('proposalDemographic') private proposalDemoChartContainer: ElementRef;
  @ViewChild('benchmarkDemographic') private benchmarkDemoChartContainer: ElementRef;
  @ViewChild('combinedDemographic') private combinedDemoChartContainer: ElementRef;


  @ViewChild('demographicContainer') private demographicParent: ElementRef;
  @ViewChild('demographicCombinedContainer') private demographicCombinedParent: ElementRef;


  // test
  @ViewChild('demographicWrapper') private demographicWrapper: ElementRef;




  private proposalChartData: TornadoChartData;
  private proposalgraphData: Array<any>;
  private proposalD3Chart: TornadoD3Chart;


  private benchmarkChartData: TornadoChartData;
  private benchmarkgraphData: Array<any>;
  private benchmarkD3Chart: TornadoD3Chart;

  private combinedD3Chart: TornadoD3Chart;


  // for combined graph
  private graphDataCombined: Array<any>;

  private maxPercentage: number;



  // chart element
  private margin: any = { top: 50, right: 20, bottom: 30, left: 50 };



  private allRegionCombined: string[];
  private allRelationCombined: string[];

  dropdownStatus = {
    regionDropdown: false,
    relationDropdown: false
  };


  // Resize
  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });

  zoom: boolean;

  private regionSelector: Selector;
  private relationSelector: Selector;



  constructor() { }

  ngOnInit() {

    this.zoom = false;

    this.disabled = true;

    // listen to div resize event
    this.resizeDetector.listenTo(this.proposalDemoChartContainer.nativeElement, (elem: HTMLElement) => {
      if (this.proposalDemographicJSON) {
        this.updateChart_proposal();
      }
    });
    this.resizeDetector.listenTo(this.benchmarkDemoChartContainer.nativeElement, (elem: HTMLElement) => {
      this.updateChart_benchmark();
    });

    this.resizeDetector.listenTo(this.combinedDemoChartContainer.nativeElement, (elem: HTMLElement) => {
      if (this.proposalDemographicJSON) {
        this.updateChart_combined();
      }
    });



    this.createChartData();
    this.createSelector();

    if (this.proposalDemographicJSON) {
      this.createChart_proposal();
      this.updateChart_proposal();

      // create combined chart
      this.createChart_combined();
      this.updateChart_combined();
    }
    this.createChart_benchmark();
    this.updateChart_benchmark();

  }


  ngOnDestroy() {

    this.resizeDetector.removeAllListeners(this.proposalDemoChartContainer.nativeElement);
    this.resizeDetector.removeAllListeners(this.benchmarkDemoChartContainer.nativeElement);
    this.resizeDetector.removeAllListeners(this.combinedDemoChartContainer.nativeElement);


    console.log('tornado is destroyed!');
  }


  createSelector() {
    this.regionSelector = new Selector(this.allRegionCombined);
    this.relationSelector = new Selector(this.allRelationCombined);
  }


  createChartData() {

    this.benchmarkChartData = new TornadoChartData(this.benchmarkDemographicJSON, this.ageGroup);
    this.benchmarkgraphData = this.benchmarkChartData.getGraphData();

    this.benchmarkgraphData.forEach(el => {
      el.source = 'Benchmark';
    });

    // if proposal has demographic data
    if (this.proposalDemographicJSON) {
      this.proposalChartData = new TornadoChartData(this.proposalDemographicJSON, this.ageGroup);
      this.proposalgraphData = this.proposalChartData.getGraphData();

      const allRegionCombinedSet = new Set([...this.proposalChartData.getAllRegion(), ...this.benchmarkChartData.getAllRegion()]);
      const allRelationCombinedSet = new Set([...this.proposalChartData.getAllRelation(), ...this.benchmarkChartData.getAllRelation()]);

      this.allRegionCombined = Array.from(allRegionCombinedSet).sort();
      this.allRelationCombined = Array.from(allRelationCombinedSet).sort();

      this.maxPercentage = this.proposalChartData.getMaxPercentage() > this.benchmarkChartData.getMaxPercentage() ? this.proposalChartData.getMaxPercentage() : this.benchmarkChartData.getMaxPercentage();



      this.proposalgraphData.forEach(el => {
        el.source = 'Client';
      });



      this.graphDataCombined = this.benchmarkgraphData.concat(this.proposalgraphData);

      console.log('in createChartData: ', 'has proposal data');
    } else {
      this.allRegionCombined = this.benchmarkChartData.getAllRegion().sort();
      this.allRelationCombined = this.benchmarkChartData.getAllRelation().sort();

      this.maxPercentage = this.benchmarkChartData.getMaxPercentage();

      console.log('in createChartData: ', 'does not have proposal data');

    }

  }

  // apply filter
  updateChartData(regions: string[], relation: string[]) {

    const update: ChartUpdateParameters = {
      region: regions,
      relation: relation
    };

    // console.log(update);

    this.benchmarkChartData.processGraphData(update);
    this.benchmarkgraphData = this.benchmarkChartData.getGraphData();

    // console.log(this.benchmarkgraphData);

    if (this.proposalDemographicJSON) {
      this.proposalChartData.processGraphData(update);
      this.proposalgraphData = this.proposalChartData.getGraphData();
      this.maxPercentage = this.proposalChartData.getMaxPercentage() > this.benchmarkChartData.getMaxPercentage() ? this.proposalChartData.getMaxPercentage() : this.benchmarkChartData.getMaxPercentage();
    } else {
      this.maxPercentage = this.benchmarkChartData.getMaxPercentage();
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


  // NEW solution
  onClickedOutside(e: Event, dropdownID: string) {
    this.dropdownStatus[dropdownID] = false;
  }

  toggleMultiSelectAll(dropdownID: string) {
    switch (dropdownID) {
      case 'regionDropdown': {
        for (const item of this.regionSelector.selectionItems) {
          item.checked = this.regionSelector.all;
        }

        break;
      }
      case 'relationDropdown': {
        for (const item of this.relationSelector.selectionItems) {
          item.checked = this.relationSelector.all;
        }
        break;
      }
      default: {

        break;
      }
    }

    if (!this.regionSelector.checkIfAllChecked() || !this.relationSelector.checkIfAllChecked()) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }


    // update chartData
    this.updateChartData(this.regionSelector.getCurrentSelction(), this.relationSelector.getCurrentSelction());

    // update chart
    this.updateChart_benchmark();
    if (this.proposalDemographicJSON) {
      this.updateChart_proposal();
      this.updateChart_combined();
    }


  }

  checkIfAllElementSelected(dropdownID: string) {
    switch (dropdownID) {
      case 'regionDropdown': {
        if (this.regionSelector.checkIfAllChecked()) {
          this.regionSelector.all = true;
        } else {
          this.regionSelector.all = false;
        }
        break;
      }
      case 'relationDropdown': {
        if (this.relationSelector.checkIfAllChecked()) {
          this.relationSelector.all = true;
        } else {
          this.relationSelector.all = false;
        }
        break;
      }
      default: {

        break;
      }
    }

    if (!this.regionSelector.checkIfAllChecked() || !this.relationSelector.checkIfAllChecked()) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }

    // update chartData
    this.updateChartData(this.regionSelector.getCurrentSelction(), this.relationSelector.getCurrentSelction());

    // update chart
    this.updateChart_benchmark();
    if (this.proposalDemographicJSON) {
      this.updateChart_proposal();
      this.updateChart_combined();
    }

  }


  toggleDropdown(value: boolean, dropdownID: string) {
    this.dropdownStatus[dropdownID] = value;
  }


  toggleMergeChart() {
    if (this.zoom === true) {
      console.log('toggle: true');

      d3.select('#demographicCombinedChartArea')
        .style('display', 'block');

      d3.selectAll('.tornadoChart')
        .style('display', 'none');

      this.updateChart_combined();

    } else {
      console.log('toogle: false');

      d3.select('#demographicCombinedChartArea')
        .style('display', 'none');

      d3.selectAll('.tornadoChart')
        .style('display', 'block');

      this.updateChart_proposal();
      this.updateChart_benchmark();

    }
  }




}
