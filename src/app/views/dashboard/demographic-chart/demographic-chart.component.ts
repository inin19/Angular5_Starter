import { Component, OnInit, Input, ViewEncapsulation, OnChanges, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TornadoChartData } from '../../../model/tornadoData';



import * as d3 from 'd3';

@Component({
  selector: 'app-demographic-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './demographic-chart.component.html',
  styleUrls: ['./demographic-chart.component.scss']
})
export class DemographicChartComponent implements OnInit, OnChanges {
  static barType = ['proposal', 'benchmark'];

  // tooltip: (selection) => void;

  @Input() private proposalDemographicJson: any[];
  @Input() private benchmarkDemographicJson: any[];


  @ViewChild('proposalDemographic') private proposalDemoChartContainer: ElementRef;
  @ViewChild('benchmarkDemographic') private benchmarkDemoChartContainer: ElementRef;

  private proposalChartData: TornadoChartData;
  private proposalgraphData: Array<any>;

  private benchmarkChartData: TornadoChartData;
  private benchmarkgraphData: Array<any>;

  private graphDataCombined: Array<any>;

  private maxPercentage: number;
  private proposalDemoMaxPercentage: number;
  private BenchmarkDemoMaxPercentage: number;


  // chart element

  private margin: any = { top: 50, right: 20, bottom: 30, left: 50 };
  private chart_1: any;
  private width_1: number;
  private height_1: number;
  private xScale_1: any;
  private yScale_1: any;
  private yInnerScale_1: any;
  private xAxis_1: any;
  private yAxis_1: any;
  private svg_1: any;

  private chart_2: any;
  private width_2: number;
  private height_2: number;
  private xScale_2: any;
  private yScale_2: any;
  private yInnerScale_2: any;
  private xAxis_2: any;
  private yAxis_2: any;
  private svg_2: any;



  private allRegionCombined: string[];
  private allRelationCombined: string[];


  // All Checkbox
  private selectedRegionAll: any;
  private selectedRelationAll: any;

  // Element Checkbox

  public regionSelector: Array<any>;
  public relationSelector: Array<any>;


  // maintaining current selection
  regionSelection: Array<string>;
  relationSelection: Array<string>;



  constructor() {
  }



  ngOnInit() {

    this.updateChartData();
    this.createSelector();


    // check data input

    // this.proposalgraphData.forEach(element => {
    //   console.log(element);
    // });

    this.createChart_proposal();
    this.createChart_benchmark();

    this.updateChart_proposal(this.proposalDemographicJson);
    this.updateChart_benchmark(this.benchmarkDemographicJson);

  }

  ngOnChanges() {

  }

  createSelector() {
    // initialize Region Selectors
    this.regionSelector = new Array();
    this.selectedRegionAll = true;
    this.regionSelection = new Array();


    this.allRegionCombined.forEach(element => {
      this.regionSelector.push({ region: element, selected: true });
      this.regionSelection.push(element);
    });

    // console.log(this.regionSelector);
    // console.log(this.regionSelection);


    // initialize Relation Selectors
    this.relationSelector = new Array();
    this.selectedRelationAll = true;
    this.relationSelection = new Array();

    this.allRelationCombined.forEach(element => {
      this.relationSelector.push({ relation: element, selected: true });
      this.relationSelection.push(element);
    });

  }

  selectRegionAll() {
    this.regionSelection = [];
    for (const i of this.regionSelector) {
      i.selected = this.selectedRegionAll;
    }

    if (this.selectedRegionAll) {
      for (const i of this.regionSelector) {
        this.regionSelection.push(i.region);
      }

    }

    // do update

    this.updateChart_proposal(this.proposalDemographicJson, this.regionSelection, this.relationSelection);
    this.updateChart_benchmark(this.benchmarkDemographicJson, this.regionSelection, this.relationSelection);

  }


  checkIfAllRegionSelected() {
    this.selectedRegionAll = this.regionSelector.every(function (item: any) {
      return item.selected === true;
    });
    this.regionSelection = [];
    for (const i of this.regionSelector) {
      if (i.selected) {
        this.regionSelection.push(i.region);
      }
    }

    // do update


    this.updateChart_proposal(this.proposalDemographicJson, this.regionSelection, this.relationSelection);
    this.updateChart_benchmark(this.benchmarkDemographicJson, this.regionSelection, this.relationSelection);
  }

  selectRelationAll() {
    this.relationSelection = [];
    for (const i of this.relationSelector) {
      i.selected = this.selectedRelationAll;
    }

    if (this.selectedRelationAll) {
      for (const i of this.relationSelector) {
        this.relationSelection.push(i.relation);
      }
    }
    // do update
    this.updateChart_proposal(this.proposalDemographicJson, this.regionSelection, this.relationSelection);
    this.updateChart_benchmark(this.benchmarkDemographicJson, this.regionSelection, this.relationSelection);


  }


  checkIfAllRelationSelected() {
    this.selectedRelationAll = this.relationSelector.every(function (item: any) {
      return item.selected === true;
    });
    this.relationSelection = [];
    for (const i of this.relationSelector) {
      if (i.selected) {
        this.relationSelection.push(i.relation);
      }
    }

    // do update

    this.updateChart_proposal(this.proposalDemographicJson, this.regionSelection, this.relationSelection);
    this.updateChart_benchmark(this.benchmarkDemographicJson, this.regionSelection, this.relationSelection);


  }




  updateChartData() {
    this.proposalChartData = new TornadoChartData(this.proposalDemographicJson);
    this.proposalgraphData = this.proposalChartData.getGraphData();

    this.benchmarkChartData = new TornadoChartData(this.benchmarkDemographicJson);
    this.benchmarkgraphData = this.benchmarkChartData.getGraphData();

    // // for combined
    // this.proposalgraphData.forEach(el => el.source = 'proposal');
    // this.benchmarkgraphData.forEach(el => el.source = 'benchmark');
    // this.graphDataCombined = this.benchmarkgraphData.concat(this.proposalgraphData);


    const allRegionCombinedSet = new Set([...this.proposalChartData.getAllRegion(), ...this.benchmarkChartData.getAllRegion()]);
    const allRelationCombinedSet = new Set([...this.proposalChartData.getAllRelation(), ...this.benchmarkChartData.getAllRelation()]);

    // console.log(Array.from(this.allRegionCombined).sort());

    this.allRegionCombined = Array.from(allRegionCombinedSet).sort();
    this.allRelationCombined = Array.from(allRelationCombinedSet).sort();
  }


  createChart_proposal() {
    const htmlElement = this.proposalDemoChartContainer.nativeElement;
    this.width_1 = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height_1 = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;


    this.svg_1 = d3.select('#proposalDemographic').append('svg')
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    this.chart_1 = this.svg_1
      .append('g')
      .classed('bars', true)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);


    this.proposalDemoMaxPercentage = this.proposalChartData.getMaxPercentage() + 0.05;

    // create scales
    this.xScale_1 = d3.scaleLinear()
      .domain([-this.proposalDemoMaxPercentage, this.proposalDemoMaxPercentage])
      .range([0, this.width_1]);

    this.yScale_1 = d3.scaleBand()
      .domain(TornadoChartData.UKAgeGroup)
      .range([this.height_1, 0])
      .padding(0.2);


    // this.yInnerScale_1 = d3.scaleBand().domain(DemographicChartComponent.barType)
    //   .range([0, this.yScale_1.bandwidth()])
    //   .paddingInner(0.2);


    // x axis  percentage formatting remove (-) sign
    const xaxis = d3.axisBottom(this.xScale_1)
      .tickFormat((d) => d3.format('.0%')(Math.abs(Number(d))));

    const yaxis = d3.axisLeft(this.yScale_1)
      .tickSize(0);


    this.xAxis_1 = this.chart_1.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height_1})`)
      .call(xaxis);

    this.yAxis_1 = this.chart_1.append('g')
      .attr('class', 'y axis')
      .call(yaxis);

    // move y axis path to the middle
    d3.select('#proposalDemographic .y.axis path')
      .attr('transform', 'translate(' + this.xScale_1(0) + ',0)');



  }


  createChart_benchmark() {
    const htmlElement = this.benchmarkDemoChartContainer.nativeElement;
    this.width_2 = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height_2 = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg_2 = d3.select('#benchmarkDemographic').append('svg')
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    this.chart_2 = this.svg_2
      .append('g')
      .classed('bars', true)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.BenchmarkDemoMaxPercentage = this.benchmarkChartData.getMaxPercentage() + 0.05;


    // create scales
    this.xScale_2 = d3.scaleLinear()
      .domain([-this.BenchmarkDemoMaxPercentage, this.BenchmarkDemoMaxPercentage])
      .range([0, this.width_2]);

    this.yScale_2 = d3.scaleBand()
      .domain(TornadoChartData.UKAgeGroup)
      .range([this.height_2, 0])
      .padding(0.2);



    // x axis  percentage formatting remove (-) sign
    const xaxis = d3.axisBottom(this.xScale_2)
      .tickFormat((d) => d3.format('.0%')(Math.abs(Number(d))));

    const yaxis = d3.axisLeft(this.yScale_2)
      .tickSize(0);


    this.xAxis_2 = this.chart_2.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height_2})`)
      .call(xaxis);

    this.yAxis_2 = this.chart_2.append('g')
      .attr('class', 'y axis')
      .call(yaxis);

    // move y axis path to the middle
    d3.select('#benchmarkDemographic .y.axis path')
      .attr('transform', 'translate(' + this.xScale_2(0) + ',0)');

  }

  updateChart_proposal(jsonData: any[], regions?: Array<string>, relation?: Array<string>) {
    // update container size

    const htmlElement = this.proposalDemoChartContainer.nativeElement;
    this.width_1 = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height_1 = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg_1
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    this.xScale_1.range([0, this.width_1]);
    this.yScale_1.range([this.height_1, 0]);

    // update data  add filters to process data
    this.proposalChartData.processGraphData(regions, relation);
    this.proposalgraphData = this.proposalChartData.getGraphData();
    this.proposalDemoMaxPercentage = this.proposalChartData.getMaxPercentage() + 0.05;

    // update scales
    this.xScale_1
      .domain([-this.proposalDemoMaxPercentage, this.proposalDemoMaxPercentage]);

    // probabaly not needed
    this.yScale_1
      .domain(TornadoChartData.UKAgeGroup);


    // update axis
    const xaxis = d3.axisBottom(this.xScale_1)
      .tickFormat((d) => d3.format('.0%')(Math.abs(Number(d))));

    this.xAxis_1
      .transition()
      .attr('transform', `translate(0, ${this.height_1})`)
      .call(xaxis);

    const yaxis = d3.axisLeft(this.yScale_1)
      .tickSize(0);

    this.yAxis_1
      .transition()
      .call(yaxis);

    // move y axis path to the middle
    d3.select('#proposalDemographic .y.axis path')
      .attr('transform', 'translate(' + this.xScale_1(0) + ',0)');

    // start groups
    let groups = this.chart_1.selectAll('#proposalDemographic .group')
      .data(TornadoChartData.UKAgeGroup);

    groups.exit().remove();

    groups
      .attr('transform', d => 'translate(0,' + this.yScale_1(d) + ')');

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true)
      .attr('transform', d => 'translate(0,' + this.yScale_1(d) + ')');

    // rejoin data VERY IMPORTANT
    groups = this.chart_1.selectAll('#proposalDemographic .group')
      .data(TornadoChartData.UKAgeGroup);

    const bars = groups.selectAll('.bar')
      .data((d) => this.proposalgraphData.filter(d1 => (d1.key.ageGroup === d)));

    bars.exit().remove();

    // update existing bars
    bars
      .transition()
      .attr('x', (d) => this.xScale_1(Math.min(0, d.percentage)))
      .attr('width', (d) => Math.abs(this.xScale_1(d.percentage) - this.xScale_1(0)))
      .attr('height', this.yScale_1.bandwidth());

    // adding new bars
    bars
      .enter()
      .append('rect')
      .attr('class', function (d) { return 'bar bar--' + (d.percentage < 0 ? 'negative' : 'positive'); })
      .attr('x', (d) => this.xScale_1(Math.min(0, d.percentage)))
      .attr('width', (d) => Math.abs(this.xScale_1(d.percentage) - this.xScale_1(0)))
      .attr('height', this.yScale_1.bandwidth())
      .on('mouseover', this.handleMouseOver())
      .on('mousemove', this.handleMouseMove())
      .on('mouseout', this.handleMouseOut());


  }

  updateChart_benchmark(jsonData: any[], regions?: Array<string>, relation?: Array<string>) {
    const htmlElement = this.benchmarkDemoChartContainer.nativeElement;
    this.width_2 = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height_2 = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg_2
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    this.xScale_2.range([0, this.width_2]);
    this.yScale_2.range([this.height_2, 0]);

    // update data  add filters to process data
    this.benchmarkChartData.processGraphData(regions, relation);
    this.benchmarkgraphData = this.benchmarkChartData.getGraphData();
    this.BenchmarkDemoMaxPercentage = this.benchmarkChartData.getMaxPercentage() + 0.05;

    // update scales
    this.xScale_2
      .domain([-this.BenchmarkDemoMaxPercentage, this.BenchmarkDemoMaxPercentage]);

    // probabaly not needed
    this.yScale_2
      .domain(TornadoChartData.UKAgeGroup);

    // update axis
    const xaxis = d3.axisBottom(this.xScale_2)
      .tickFormat((d) => d3.format('.0%')(Math.abs(Number(d))));

    this.xAxis_2
      .transition()
      .attr('transform', `translate(0, ${this.height_2})`)
      .call(xaxis);

    const yaxis = d3.axisLeft(this.yScale_2)
      .tickSize(0);

    this.yAxis_2
      .transition()
      .call(yaxis);

    // move y axis path to the middle
    d3.select('#benchmarkDemographic .y.axis path')
      .attr('transform', 'translate(' + this.xScale_2(0) + ',0)');


    // start groups
    let groups = this.chart_2.selectAll('#benchmarkDemographic .group')
      .data(TornadoChartData.UKAgeGroup);

    groups.exit().remove();

    groups
      .attr('transform', d => 'translate(0,' + this.yScale_2(d) + ')');

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true)
      .attr('transform', d => 'translate(0,' + this.yScale_2(d) + ')');


    // rejoin data VERY IMPORTANT
    groups = this.chart_2.selectAll('#benchmarkDemographic .group')
      .data(TornadoChartData.UKAgeGroup);

    const bars = groups.selectAll('.bar')
      .data((d) => this.benchmarkgraphData.filter(d1 => (d1.key.ageGroup === d)));

    bars.exit().remove();


    // update existing bars
    bars
      .transition()
      .attr('x', (d) => this.xScale_2(Math.min(0, d.percentage)))
      .attr('width', (d) => Math.abs(this.xScale_2(d.percentage) - this.xScale_2(0)))
      .attr('height', this.yScale_2.bandwidth());

    // adding new bars
    bars
      .enter()
      .append('rect')
      .attr('class', function (d) { return 'bar bar--' + (d.percentage < 0 ? 'negative' : 'positive'); })
      .attr('x', (d) => this.xScale_2(Math.min(0, d.percentage)))
      // .attr('y', (d) => this.yInnerScale(d.source))
      .attr('width', (d) => Math.abs(this.xScale_2(d.percentage) - this.xScale_2(0)))
      .attr('height', this.yScale_2.bandwidth());


  }

  @HostListener('window:resize', ['$event'])
  onresize(event) {
    console.log('resize!');
    this.updateChart_proposal(this.proposalDemographicJson, this.regionSelection, this.relationSelection);
    this.updateChart_benchmark(this.benchmarkDemographicJson, this.regionSelection, this.relationSelection);
  }


  // private onMouseover(): (d, i) => void {
  //   return (d, i) => {
  //     d3.select(d3.event.currentTarget).style({
  //       'fill': 'yellow'
  //     });
  //     this.logData(d);
  //   }
  // }

  // i is the index of the data, d is the actual data
  handleMouseOver(): (d, i) => void {
    return (d, i) => {
      console.log('in mouseOver');
      // console.log(d3.event.currentTarget);  is the current selcted DOM element
      d3.select(d3.event.currentTarget)
        .attr('opacity', 0.5);


      const formatFixedPercent = d3.format('.1%');

      d3.select('#myTooltip')
        .style('opacity', 1)
        .html(formatFixedPercent(Math.abs(d.percentage)));

    };
  }

  handleMouseOut(): (d, i) => void {
    return (d, i) => {
      console.log('in MouseOut');
      // console.log(d3.event.currentTarget);  is the current selcted DOM element
      d3.select(d3.event.currentTarget)
        .attr('opacity', 1);

      d3.select('#myTooltip')
        .style('opacity', 0);

    };
  }


  handleMouseMove(): (d, i) => void {
    return (d, i) => {


      d3.select('#myTooltip')
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 10 + 'px');

    };
  }



}
