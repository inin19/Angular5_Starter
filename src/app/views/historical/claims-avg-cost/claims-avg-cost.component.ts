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


  constructor() { }

  ngOnInit() {

    console.log(this.claimsAvgCostContainer);

    this.populateDomainValue();
    this.createChartData();
    this.createChart();
    this.updateChart();

  }


  getMaxAvgCost(): number {
    return d3.max(this.avgCostGraphData, (d) => d.value);
  }


  populateDomainValue() {
    // x axis text
    this.xDomain = Object.keys(this.conditionGroupTranslation).map(key => this.conditionGroupTranslation[key]);
    this.xDomain[0] = 'Total';

    this.xDomain.pop();

    // console.log('xDomiain: ');
    // console.log(this.xDomain);

    if (this.proposalClaimAvgCost) {
      this.x1Domain = [ClaimsAvgCostComponent.series.prevYear, ClaimsAvgCostComponent.series.currYear, ClaimsAvgCostComponent.series.benchmarkCurrYear];
    } else {
      this.x1Domain = [ClaimsAvgCostComponent.series.benchmarkCurrYear];
    }

    this.conditionGroupTranslation['TOTAL'] = 'Total';

    // console.log(this.conditionGroupTranslation);
  }

  createChartData() {
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
    }
  }

  createChart() {
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


  updateChart() {
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

}



export interface AvgCostGraph {
  key: string;
  series: number;
  value: number;
}
