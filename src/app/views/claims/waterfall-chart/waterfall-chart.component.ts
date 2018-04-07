import { Component, OnInit, OnChanges, ViewChild, Input, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WaterfallData } from './../../../model/waterfallData';
// import { ResizeService } from '../../../services/resize.service';

import * as elementResizeDetectorMaker from 'element-resize-detector';

import * as d3 from 'd3';


@Component({
  selector: 'app-waterfall-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.scss']
})
export class WaterfallChartComponent implements OnInit {

  private static stackColor = {
    Base: '#FFFFFF',
    Fall: '#FFA500',
    Rise: '#0000FF'
  };


  @ViewChild('claimsWaterfall') private chartContainer: ElementRef;

  @Input() private claimsJsonData: any[];
  @Input() private totalMemberCount: any[];


  private benchmarkClaimData: WaterfallData;
  private benchmarkConditionGroupData: any[];
  private benchmarkGraphData: any[];


  // d3 related variables
  private margin: any = { top: 60, right: 20, bottom: 80, left: 40 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private svg: any;




  uncheckableRadioModel = 'Middle';

  // checkModel: any = { left: false, middle: false, right: false };


  zoom: boolean;

  // form related
  sortingForm: FormGroup;



  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });



  constructor(private formBuilder: FormBuilder, private el: ElementRef) { }

  ngOnInit() {

    this.resizeDetector.listenTo(document.getElementById('mycontainer'), (elem: HTMLElement) => {
      console.log(elem.offsetWidth, elem.offsetHeight);
      this.updateChart(this.zoom);
    })




    this.dropdownList = [
      { 'id': 1, 'itemName': 'India' },
      { 'id': 2, 'itemName': 'Singapore' },
      { 'id': 3, 'itemName': 'Australia' },
      { 'id': 4, 'itemName': 'Canada' },
      { 'id': 5, 'itemName': 'South Korea' },
      { 'id': 6, 'itemName': 'Germany' },
      { 'id': 7, 'itemName': 'France' },
      { 'id': 8, 'itemName': 'Russia' },
      { 'id': 9, 'itemName': 'Italy' },
      { 'id': 10, 'itemName': 'Sweden' }
    ];
    this.selectedItems = [
      { 'id': 2, 'itemName': 'Singapore' },
      { 'id': 3, 'itemName': 'Australia' },
      { 'id': 4, 'itemName': 'Canada' },
      { 'id': 5, 'itemName': 'South Korea' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select Countries',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      badgeShowLimit: 3
    };

















    this.sortingForm = this.formBuilder.group({
      sorting: 'Default'
    });

    this.zoom = false;



    this.onSortingFormChanges();


    this.createChartData();
    this.createChart();
    this.updateChart();
  }




  onItemSelect(item: any) {
    console.log(item);

    console.log(item);


    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }



  onSortingFormChanges() {
    this.sortingForm.get('sorting').valueChanges.subscribe(val => {
      console.log(val);
      this.benchmarkClaimData.sortConditionGroupData(val);
      this.benchmarkGraphData = this.benchmarkClaimData.getGraphData();
      this.updateChart(this.zoom);

    });
  }

  createChartData() {
    console.log('createChartData');
    this.benchmarkClaimData = new WaterfallData(this.claimsJsonData, this.totalMemberCount);
    this.benchmarkConditionGroupData = this.benchmarkClaimData.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimData.getGraphData();
  }

  createChart() {
    const htmlElement = this.chartContainer.nativeElement;
    this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;


    this.svg = d3.select('#claimsWaterfall').append('svg')
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);


    this.chart = this.svg
      .append('g')
      .classed('bars', true)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);


    // console.log(this.benchmarkClaimData.getGraphMaxValue());

    // create scales
    this.xScale = d3.scaleBand()
      .domain(this.benchmarkClaimData.getGraphData()[0].map(val => (val.data.key)))
      .rangeRound([0, this.width])
      .padding(0.2);

    this.yScale = d3.scaleLinear()
      .domain([0, this.benchmarkClaimData.getGraphMaxValue()])
      .range([this.height, 0]);

    // x & y axis
    const xaxis = d3.axisBottom(this.xScale)
      .tickSizeOuter(0);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.3s'));

    this.xAxis = this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xaxis);

    this.yAxis = this.chart.append('g')
      .attr('class', 'y axis')
      .call(yaxis);

    d3.select('.x.axis').selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
  }


  // apply filter here
  updateChartData(region?: string[], relation?: string[], gender?: string[], claimType?: string[], ageGroup?: string[]) {
    this.benchmarkClaimData.processGraphData(this.totalMemberCount);
    this.benchmarkGraphData = this.benchmarkClaimData.getGraphData();
  }

  updateChart(zoom?: boolean) {
    // update size
    const htmlElement = this.chartContainer.nativeElement;
    this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;

    d3
      .select('#claimsWaterfall svg')
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    // update scales
    this.xScale.rangeRound([0, this.width]);


    const min = this.benchmarkClaimData.getWaterfallMinBaseValue();

    this.yScale.range([this.height, 0]);

    // update scale domain
    this.xScale.domain(this.benchmarkClaimData.getGraphData()[0].map(val => (val.data.key)));


    if (zoom === true) {
      this.yScale.domain([min, this.benchmarkClaimData.getGraphMaxValue()]);

    } else {
      this.yScale.domain([0, this.benchmarkClaimData.getGraphMaxValue()]);
    }

    // update axis
    const xaxis = d3.axisBottom(this.xScale)
      .tickSizeOuter(0);

    const yaxis = d3.axisLeft(this.yScale)
      // .tickSize(10)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.3s'));

    this.xAxis.transition().call(xaxis);
    this.yAxis.transition().call(yaxis);



    // start charting

    // update stack groups
    // let groups = this.chart.selectAll('.group')
    //   .data(['Base', 'Fall', 'Rise']);

    let groups = this.chart.selectAll('.group')
      .data(['Fall', 'Rise']);

    groups.exit().remove();

    // update eixisitng group
    groups
      .attr('fill', d => (WaterfallChartComponent.stackColor[d]));

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true)
      .attr('fill', d => (WaterfallChartComponent.stackColor[d]));

    // rejoin data VERY IMPORTANT
    // groups = this.chart.selectAll('.group')
    //   .data(['Base', 'Fall', 'Rise']);

    groups = this.chart.selectAll('.group')
      .data(['Fall', 'Rise']);




    const bars = groups.selectAll('.bar')
      .data((d) => this.benchmarkGraphData.filter((item) => item.key === d)[0]);


    // console.log('in updpate chart');

    // this.benchmarkGraphData.forEach(element => {
    //   console.log(element);
    // });

    bars.exit().remove();

    // update existing bars

    bars
      .transition()
      .attr('x', d => this.xScale(d.data.key))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => {

        if ((d.data.key === '2015' || d.data.key === '2016') && zoom) {

          return this.yScale(d[0]) - this.yScale(d[1] - min);
        } else {
          return this.yScale(d[0]) - this.yScale(d[1]);
        }

      });


    // adding new bars
    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .transition()
      .attr('x', d => this.xScale(d.data.key))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => {

        // if (d.data.key === 2015) {
        //   console.log('yScale(d[0]): ', this.yScale(d[0]));
        //   console.log('yScale(d[1]): ', this.yScale(d[1]));
        // }

        return this.yScale(d[0]) - this.yScale(d[1])
      });

    // console.log(this.benchmarkGraphData.filter((item) => item.key === 'Base')[0]);

  }


  newFunction() {

    if (this.zoom === true) {
      this.updateChart(true)
    } else {
      this.updateChart(false)
    }
  }


}

