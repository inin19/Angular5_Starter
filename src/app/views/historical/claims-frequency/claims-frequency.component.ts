// import { WaterfallD3Grid } from './../../../model/D3grid/waterfall-grid.model';
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


  zoom: boolean;

  private claimPerCapitaXDomain: string[];


  // new form
  sorting: string;


  // gridData
  waterfallGridData: WaterfallGridData[];
  waterfallGridDataTotal: WaterfallGridData;



  private gridSorting = {
    conditionGroup: { default: true },
    prev: { asc: false, desc: false },
    curr: { asc: false, desc: false },
    benchmark: { asc: false, desc: false }
  };

  private currenctSorting = { column: 'conditionGroup', order: 'default' };

  grid: false;

  gridDispaly = 'Grid';


  constructor() { }

  ngOnInit() {
    console.log('claim frequency init');

    this.claimPerCapitaXDomain = Object.keys(this.conditionGroupTranslation).map(key => this.conditionGroupTranslation[key]);

    this.sorting = 'Default';
    this.zoom = false;

    this.createChartData();
    this.creatOrUpdateChart();
  }


  ngOnChanges() {
    console.log('claim frequncey on changes');
  }



  createChartData() {
    this.waterfallGridData = [];
    this.benchmarkConditionGroupData = this.benchmarkClaimFrequency.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimFrequency.getGraphData();

    if (this.proposalClaimFrequency) {
      this.proposalConditionGroupData = this.proposalClaimFrequency.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimFrequency.getGraphData();

      // default to claim acount
      // console.log(this.conditionGroups);
      this.conditionGroups.forEach(element => {
        const proposal = this.proposalClaimFrequency.getClaimsAggregateData().find(item => item.key === element);
        const benchmark = this.benchmarkClaimFrequency.getClaimsAggregateData().find(item => item.key === element);

        let temp: WaterfallGridData = null;
        temp = {
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

        let temp: WaterfallGridData = null;

        if (benchmark) {
          temp = {
            key: element,
            prev: 0,
            curr: 0,
            benchmark: benchmark.currYearClaimFrequency
          };
        } else {
          temp = {
            key: element,
            prev: 0,
            curr: 0,
            benchmark: 0
          };
        }

        this.waterfallGridData.push(temp);
      });


      this.waterfallGridDataTotal = {
        key: 'TOTAL',
        prev: 0,
        curr: 0,
        benchmark: this.benchmarkClaimFrequency.getClaimsAggregateDataTotal().currYearClaimFrequency
      };
    }


  }


  updateChartData(conditionGroup: string[], selectors: Selector[]) {

    this.waterfallGridData = [];

    this.benchmarkClaimFrequency.updateData(conditionGroup, selectors);
    this.benchmarkClaimFrequency.createWaterfallData(this.sorting, 'frequency');

    this.benchmarkConditionGroupData = this.benchmarkClaimFrequency.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimFrequency.getGraphData();

    if (this.proposalClaimFrequency) {
      this.proposalClaimFrequency.updateData(conditionGroup, selectors);
      this.proposalClaimFrequency.createWaterfallData(this.sorting, 'frequency');

      this.proposalConditionGroupData = this.proposalClaimFrequency.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaimFrequency.getGraphData();

      this.conditionGroups.forEach(element => {
        const proposal = this.proposalClaimFrequency.getClaimsAggregateData().find(item => item.key === element);
        const benchmark = this.benchmarkClaimFrequency.getClaimsAggregateData().find(item => item.key === element);


        let temp: WaterfallGridData = null;
        temp = {
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

        let temp: WaterfallGridData = null;

        if (benchmark) {
          temp = {
            key: element,
            prev: 0,
            curr: 0,
            benchmark: benchmark.currYearClaimFrequency
          };
        } else {
          temp = {
            key: element,
            prev: 0,
            curr: 0,
            benchmark: 0
          };
        }
        this.waterfallGridData.push(temp);
      });


      this.waterfallGridDataTotal = {
        key: 'TOTAL',
        prev: 0,
        curr: 0,
        benchmark: this.benchmarkClaimFrequency.getClaimsAggregateDataTotal().currYearClaimFrequency
      };



    }
  }


  createChart_benchmark() {
    if (this.benchmarkClaimsFrequency.nativeElement.offsetWidth === 0 && this.benchmarkClaimsFrequency.nativeElement.offsetHeight === 0) {
      console.log('container size is zero, chart is not created');
    } else {
      if (!this.benchmarkD3Chart) {
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
    }
  }


  createChart_proposal() {

    if (this.proposalClaimsFrequency.nativeElement.offsetWidth === 0 && this.proposalClaimsFrequency.nativeElement.offsetHeight === 0) {
      console.log('container size is zero, chart is not created');
    } else {
      if (!this.proposalD3Chart) {
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
    }
  }




  updateChart_benchmark() {
    if (this.benchmarkD3Chart) {
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
  }

  updateChart_proposal() {
    if (this.proposalD3Chart) {
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
  }



  creatOrUpdateChart() {
    this.createChart_benchmark();
    this.updateChart_benchmark();

    if (this.proposalClaimFrequency) {
      this.createChart_proposal();
      this.updateChart_proposal();
    }

  }




  ngOnDestroy() {
    console.log('claim PerCapita component destroy');
  }



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


  sortByHeader(column: string, order: string) {
    this.resetGridSorting();
    this.gridSorting[column][order] = true;

    this.currenctSorting.column = column;
    this.currenctSorting.order = order;




    if (column === 'conditionGroup') {
      this.waterfallGridData.sort((a, b) =>
        this.conditionGroups.indexOf(a.key) > this.conditionGroups.indexOf(b.key) ? 1 : -1);
    } else {
      this.waterfallGridData.sort((a, b) => order === 'asc' ? a[column] - b[column] : b[column] - a[column]);
    }

  }

  resetGridSorting() {
    this.gridSorting.conditionGroup.default = false;
    this.gridSorting.curr.asc = false;
    this.gridSorting.curr.desc = false;
    this.gridSorting.prev.asc = false;
    this.gridSorting.prev.desc = false;
    this.gridSorting.benchmark.asc = false;
    this.gridSorting.benchmark.desc = false;
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





}


export interface WaterfallGridData {
  key: string;
  prev: number;
  curr: number;
  benchmark: number;
}
