import { Selector } from './../../../model/utils/selector.model';
import { AvgClaimCostChartConfig } from './../../../model/utils/chart-config';
import { AvgCostD3Chart } from './../../../model/D3chart/avg-cost-d3-chart.model';
import { WaterfallData, ClaimsAggregateData } from './../../../model/D3chartData/waterfall-data.model';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import * as elementResizeDetectorMaker from 'element-resize-detector';
import * as d3 from 'd3';

@Component({
  selector: 'app-claims-avg-cost',
  templateUrl: './claims-avg-cost.component.html',
  styleUrls: ['./claims-avg-cost.component.scss']
})


export class ClaimsAvgCostComponent implements OnInit {

  static series = {
    prevYear: 1,
    currYear: 2,
    benchmarkCurrYear: 3
  };

  @Input() private benchmarkClaimAvgCost: WaterfallData;
  @Input() private proposalClaimAvgCost: WaterfallData;
  @Input() private conditionGroupTranslation: any;
  @Input() private claimMargin: any;
  @Input() private conditionGroups: string[];

  @Input() countryCode: string;


  @ViewChild('claimsAvgCostContainer') private claimsAvgCostContainer: ElementRef;
  @ViewChild('claimsAvgCostGraph') private claimsAvgCostGraph: ElementRef;


  private benchmarkAggregate: ClaimsAggregateData[];
  private benchmarkAggregateTotal: ClaimsAggregateData;

  private proposalAggregate: ClaimsAggregateData[];
  private proposalAggregateTotal: ClaimsAggregateData;

  private avgCostGraphData: AvgCostGraph[];

  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });


  private avgCostD3Chart: AvgCostD3Chart;

  private xDomain: any[];
  private x1Domain: any[];


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

    this.populateDomainValue();
    this.createChartData();
    this.creatOrUpdateChart();

  }



  getMaxAvgCost(): number {
    return (d3.max(this.avgCostGraphData, (d) => d.value)) ? d3.max(this.avgCostGraphData, (d) => d.value) : 0;
  }


  populateDomainValue() {
    // x axis text
    this.xDomain = Object.keys(this.conditionGroupTranslation).map(key => this.conditionGroupTranslation[key]);
    this.xDomain[0] = 'Total';
    this.xDomain.pop();

    if (this.proposalClaimAvgCost) {
      this.x1Domain = [ClaimsAvgCostComponent.series.prevYear, ClaimsAvgCostComponent.series.currYear, ClaimsAvgCostComponent.series.benchmarkCurrYear];
    } else {
      this.x1Domain = [ClaimsAvgCostComponent.series.benchmarkCurrYear];
    }

    this.conditionGroupTranslation['TOTAL'] = 'Total';

  }

  createChartData() {

    this.waterfallGridData = [];

    // combine benchmark and proposal data here
    this.avgCostGraphData = [];

    this.benchmarkAggregate = this.benchmarkClaimAvgCost.getClaimsAggregateData();
    this.benchmarkAggregateTotal = this.benchmarkClaimAvgCost.getClaimsAggregateDataTotal();

    if (this.proposalClaimAvgCost) {
      this.proposalAggregate = this.proposalClaimAvgCost.getClaimsAggregateData();
      this.proposalAggregateTotal = this.proposalClaimAvgCost.getClaimsAggregateDataTotal();

      for (const item of this.proposalAggregate) {
        const benchmarkItem = this.benchmarkAggregate.find(d => item.key === d.key);
        const temp: AvgCostGraph = {
          key: item.key,
          series: ClaimsAvgCostComponent.series.currYear,
          value: item.currYearAvgClaimCost
        };

        const temp1: AvgCostGraph = {
          key: item.key,
          series: ClaimsAvgCostComponent.series.prevYear,
          value: item.prevYearAvgClaimCost
        };

        const temp2: AvgCostGraph = {
          key: item.key,
          series: ClaimsAvgCostComponent.series.benchmarkCurrYear,
          value: benchmarkItem.currYearAvgClaimCost
        };

        this.avgCostGraphData.push(temp, temp1, temp2);
      }


      // push total data
      const total: AvgCostGraph = {
        key: this.proposalAggregateTotal.key,
        series: ClaimsAvgCostComponent.series.currYear,
        value: this.proposalAggregateTotal.currYearAvgClaimCost
      };

      const total1: AvgCostGraph = {
        key: this.proposalAggregateTotal.key,
        series: ClaimsAvgCostComponent.series.prevYear,
        value: this.proposalAggregateTotal.prevYearAvgClaimCost
      };

      const total2: AvgCostGraph = {
        key: this.proposalAggregateTotal.key,
        series: ClaimsAvgCostComponent.series.benchmarkCurrYear,
        value: this.benchmarkAggregateTotal.currYearAvgClaimCost
      };

      this.avgCostGraphData.push(total, total1, total2);


      // create grid data
      this.conditionGroups.forEach(element => {
        const proposal = this.proposalClaimAvgCost.getClaimsAggregateData().find(item => item.key === element);
        const benchmark = this.benchmarkClaimAvgCost.getClaimsAggregateData().find(item => item.key === element);


        let temp: WaterfallGridData = null;
        temp = {
          key: element,
          prev: (proposal) ? proposal.prevYearAvgClaimCost : 0,
          curr: (proposal) ? proposal.currYearAvgClaimCost : 0,
          benchmark: (benchmark) ? benchmark.currYearAvgClaimCost : 0
        };

        this.waterfallGridData.push(temp);
      });

      // total
      this.waterfallGridDataTotal = {
        key: 'TOTAL',
        prev: this.proposalClaimAvgCost.getClaimsAggregateDataTotal().prevYearAvgClaimCost,
        curr: this.proposalClaimAvgCost.getClaimsAggregateDataTotal().currYearAvgClaimCost,
        benchmark: this.benchmarkClaimAvgCost.getClaimsAggregateDataTotal().currYearAvgClaimCost
      };

    } else {
      // no proposal data, only benchmark
      for (const item of this.benchmarkAggregate) {
        const temp: AvgCostGraph = {
          key: item.key,
          series: ClaimsAvgCostComponent.series.benchmarkCurrYear,
          value: this.benchmarkAggregateTotal.currYearAvgClaimCost
        };
        this.avgCostGraphData.push(temp);
      }

      const total: AvgCostGraph = {
        key: this.benchmarkAggregateTotal.key,
        series: ClaimsAvgCostComponent.series.benchmarkCurrYear,
        value: this.benchmarkAggregateTotal.currYearAvgClaimCost
      };
      this.avgCostGraphData.push(total);

      this.conditionGroups.forEach(element => {
        const benchmark = this.benchmarkClaimAvgCost.getClaimsAggregateData().find(item => item.key === element);

        let temp: WaterfallGridData = null;
        if (benchmark) {
          temp = {
            key: element,
            prev: 0,
            curr: 0,
            benchmark: benchmark.currYearAvgClaimCost
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
        benchmark: this.benchmarkClaimAvgCost.getClaimsAggregateDataTotal().currYearAvgClaimCost
      };


    }
  }


  updateChartData(conditionGroup: string[], selectors: Selector[]) {
    this.benchmarkClaimAvgCost.updateData(conditionGroup, selectors);
    if (this.proposalClaimAvgCost) {
      this.proposalClaimAvgCost.updateData(conditionGroup, selectors);
    }

    this.createChartData();
  }

  createChart() {
    if (this.claimsAvgCostGraph.nativeElement.offsetWidth === 0 && this.claimsAvgCostGraph.nativeElement.offsetHeight === 0) {
      console.log('container size is zero, chart is not created');
    } else {
      if (!this.avgCostD3Chart) {
        const config: AvgClaimCostChartConfig = {
          title: 'Avg cost',
          margin: this.claimMargin,
          chartContainer: this.claimsAvgCostGraph,
          domID: '#' + this.claimsAvgCostGraph.nativeElement.id,
          xScaleDomain: this.xDomain,
          x1ScaleDomain: this.x1Domain,
          yScaleDomain: [0, this.getMaxAvgCost()],
          toolTipParent: this.claimsAvgCostContainer.nativeElement.id,
          conditionGroupTranslation: this.conditionGroupTranslation
        };
        this.avgCostD3Chart = new AvgCostD3Chart(config);
      }
    }
  }


  updateChart() {
    if (this.avgCostD3Chart) {
      const config: AvgClaimCostChartConfig = {
        title: 'Avg cost',
        margin: this.claimMargin,
        chartContainer: this.claimsAvgCostGraph,
        domID: '#' + this.claimsAvgCostGraph.nativeElement.id,
        xScaleDomain: this.xDomain,
        x1ScaleDomain: this.x1Domain,
        yScaleDomain: [0, this.getMaxAvgCost()],
        toolTipParent: this.claimsAvgCostContainer,
        tooltipDomID: '#avgCostTooltip',
        conditionGroupTranslation: this.conditionGroupTranslation,
        barData: this.avgCostGraphData
      };
      this.avgCostD3Chart.updateChart(config);
      console.log('avg cost chart update!');
    }
  }



  creatOrUpdateChart() {
    this.createChart();
    this.updateChart();
  }


  listenToDivResize() {
    this.resizeDetector.listenTo(this.claimsAvgCostContainer.nativeElement, (elem: HTMLElement) => {
      this.updateChart();
    });
    console.log('listen to claims avg cost divs');
  }

  unListenToDivResize() {
    this.resizeDetector.removeAllListeners(this.claimsAvgCostContainer.nativeElement);
    console.log('unlisten claims avg cost divs');
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



export interface AvgCostGraph {
  key: string;
  series: number;
  value: number;
}


export interface WaterfallGridData {
  key: string;
  prev: number;
  curr: number;
  benchmark: number;
}
