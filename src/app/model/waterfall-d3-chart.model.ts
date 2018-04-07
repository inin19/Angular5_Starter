import { ElementRef } from '@angular/core';
import { WaterfallChartConfig } from './chart-config';

import * as elementResizeDetectorMaker from 'element-resize-detector';

import * as d3 from 'd3';


export class WaterfallD3Chart {

  private width: number;
  private height: number;
  private svg: any;
  private chart: any;

  private graphTitle: any;
  private xScale: any;
  private yScale: any;
  private yInnerScale: any;
  private xAxis: any;
  private yAxis: any;

  private legend: any;

  private margin: { top: number, right: number, bottom: number, left: number };


  // get dom id by nativeElement.id

  constructor(chartConfig: WaterfallChartConfig) {
    const htmlElement = chartConfig.chartContainer.nativeElement;
    this.margin = chartConfig.margin;
    this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;


    this.svg = d3.select(chartConfig.domID).append('svg')
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    // adding legend area

    // charting area

    this.chart = this.svg
      .append('g')
      .classed('bars', true)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // adding graph title
    this.graphTitle = this.chart.append('text')
      .classed('graphTitle', true)
      .attr('x', (this.width / 2))
      .attr('y', 0 - (this.margin.top / 1.5))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(chartConfig.title);

    // adding scales
    this.xScale = d3.scaleBand()
      .domain(chartConfig.xScaleDomain)
      .rangeRound([0, this.width])
      .padding(0.2);

    this.yScale = d3.scaleLinear()
      .domain(chartConfig.yScaleDomain)
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

    d3.select(chartConfig.domID + ' .x.axis').selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
  }

  updateChart(chartConfig: WaterfallChartConfig) {
    const htmlElement = chartConfig.chartContainer.nativeElement;
    this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    // update graphtitle
    this.graphTitle
      .attr('x', (this.width / 2))
      .attr('y', 0 - (this.margin.top / 1.5));

    // update scales
    this.xScale.rangeRound([0, this.width]);
    this.yScale.range([this.height, 0]);


    // update scale domain
    this.xScale.domain(chartConfig.xScaleDomain);
    this.yScale.domain(chartConfig.yScaleDomain);

    // update axis
    const xaxis = d3.axisBottom(this.xScale)
      .tickSizeOuter(0);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.3s'));

    this.xAxis.transition().call(xaxis);
    this.yAxis.transition().call(yaxis);


    // updating grouops and charts
    let groups = this.chart.selectAll('.group')
      .data(['Fall', 'Rise']);

    groups.exit().remove();

    // update eixisitng group
    groups
      .attr('fill', d => (chartConfig.stackColor[d]));

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true)
      .attr('fill', d => (chartConfig.stackColor[d]));

    groups = this.chart.selectAll('.group')
      .data(['Fall', 'Rise']);

    const bars = groups.selectAll('.bar')
      .data((d) => chartConfig.barData.filter((item) => item.key === d)[0]);

    bars.exit().remove();

    bars
      .transition()
      .attr('x', d => this.xScale(d.data.key))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => {

        if ((d.data.key === chartConfig.previousYearKey || d.data.key === chartConfig.currentYearKey) && chartConfig.zoom) {
          // min
          return this.yScale(d[0]) - this.yScale(d[1] - chartConfig.yScaleDomain[0]);
        } else {
          return this.yScale(d[0]) - this.yScale(d[1]);
        }

      });

    // adding new bars
    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('x', d => this.xScale(d.data.key))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => {
        if ((d.data.key === chartConfig.previousYearKey || d.data.key === chartConfig.currentYearKey) && chartConfig.zoom) {
          // min
          return this.yScale(d[0]) - this.yScale(d[1] - chartConfig.yScaleDomain[0]);
        } else {
          return this.yScale(d[0]) - this.yScale(d[1]);
        }
      })
      .on('mouseover', this.handleMouseOver(chartConfig))
      .on('mousemove', this.handleMouseMove(chartConfig.toolTipParent, chartConfig.tooltipDomID))
      .on('mouseout', this.handleMouseOut(chartConfig.tooltipDomID));

    ;

  }



  // i is the index of the data, d is the actual data
  handleMouseOver(chartConfig: WaterfallChartConfig): (d, i) => void {
    return (d, i) => {
      // console.log('in mouseOver');


      d3.select(d3.event.currentTarget)
        .attr('opacity', 0.5);


      const f = d3.format('.1f');

      d3.select(chartConfig.tooltipDomID)
        .style('opacity', 1)
        .html(
          // f(d.data.Per_Capita)
          d.data.Per_Capita
        );

      // console.log(d.data.Per_Capita);
    };
  }


  handleMouseOut(tooltipDom: string): (d, i) => void {
    return (d, i) => {
      // console.log('in MouseOut');
      d3.select(d3.event.currentTarget)
        .attr('opacity', 1);
      d3.select(tooltipDom)
        .style('opacity', 0);
    };
  }



  handleMouseMove(chartParent: ElementRef, tooltipDom: string): (d, i) => void {
    return (d, i) => {
      // const bounds = document.getElementById('demographicChartsArea').getBoundingClientRect();
      const bounds = chartParent.nativeElement.getBoundingClientRect();

      d3.select(tooltipDom)
        .style('left', d3.event.clientX - bounds.left + 10 + 'px')
        .style('top', d3.event.clientY - bounds.top + 10 + 'px');
    };
  }



}
