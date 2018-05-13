import { ElementRef } from '@angular/core';

import * as d3 from 'd3';


export class TornadoD3Chart {

  private svg: any;
  private chart: any;
  private width: number;
  private height: number;

  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;

  private margin: { top: number, right: number, bottom: number, left: number };

  constructor(chartParent: ElementRef, elementRef: ElementRef, margin: any, maxPercentage: number, ageGroup: string[], barData: any[], tooltipDom: string, source: string) {
    this.updateChart(chartParent, elementRef, margin, maxPercentage, ageGroup, barData, tooltipDom, source);
  }


  updateChart(chartParent: ElementRef, elementRef: ElementRef, margin: any, maxPercentage: number, ageGroup: string[], barData: any[], tooltipDom: string, source: string) {
    const domID = '#' + elementRef.nativeElement.id;
    this.margin = margin;

    this.width = elementRef.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = elementRef.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(domID).select('svg');

    this.chart = this.svg.select('.bars')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const maxPercentageAdjusted = maxPercentage + 0.04;

    // create scales
    this.xScale = d3.scaleLinear()
      .domain([-maxPercentageAdjusted, maxPercentageAdjusted])
      .range([0, this.width]);

    this.yScale = d3.scaleBand()
      .domain(ageGroup)
      .range([this.height, 0])
      .padding(0.2);



    // x axis  percentage formatting remove (-) sign
    const xaxis = d3.axisBottom(this.xScale)
      .tickFormat((d) => d3.format('.0%')(Math.abs(Number(d))));
    const yaxis = d3.axisLeft(this.yScale)
      .tickSize(-this.width);


    this.xAxis = this.chart.select('.x.axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xaxis);


    this.yAxis = this.chart.select('.y.axis')
      .call(yaxis);


    this.chart.selectAll('.y.axis .tick line')
      .attr('y1', - this.yScale.step() / 2)
      .attr('y2', - this.yScale.step() / 2);


    // create groups
    let groups = this.chart.selectAll('.group')
      .data(ageGroup);

    groups.exit().remove();

    // update existing groups
    groups
      .attr('transform', d => 'translate(0,' + this.yScale(d) + ')');

    // adding new groups
    groups.enter().append('g')
      .classed('group', true)
      .attr('transform', d => 'translate(0,' + this.yScale(d) + ')');

    groups = this.chart.selectAll('.group')
      .data(ageGroup);



    const bars = groups.selectAll('.bar')
      .data((d) => barData.filter(d1 => (d1.key.ageGroup === d)));

    bars.exit().remove();

    // update existing bars
    bars
      .transition()
      .attr('x', (d) => d.percentage < 0 ? this.xScale(Math.min(0, d.percentage)) : this.xScale(Math.min(0, d.percentage)) + 1)
      .attr('width', (d) => Math.abs(this.xScale(d.percentage) - this.xScale(0)))
      .attr('height', this.yScale.bandwidth());

    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .classed('bar--negative', d => (d.percentage < 0 ? true : false))
      .classed('bar--positive', d => (d.percentage < 0 ? false : true))
      .classed('benchmark', d => (source === 'BENCHMARK' ? true : false))
      .classed('client', d => (source === 'BENCHMARK' ? false : true))
      .attr('x', (d) => d.percentage < 0 ? this.xScale(Math.min(0, d.percentage)) : this.xScale(Math.min(0, d.percentage)) + 1)
      .attr('width', (d) => Math.abs(this.xScale(d.percentage) - this.xScale(0)))
      .attr('height', this.yScale.bandwidth())
      .on('mouseover', this.handleMouseOver(tooltipDom))
      .on('mousemove', this.handleMouseMove(chartParent, tooltipDom))
      .on('mouseout', this.handleMouseOut(tooltipDom));
  }

  private handleMouseOver(tooltipDom: string): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .attr('opacity', 0.5);
      const formatFixedPercent = d3.format('.1%');
      d3.select(tooltipDom)
        .style('opacity', 1)
        .html((d.key.gender === 'F' ? 'Female' : 'Male') + ': ' + formatFixedPercent(Math.abs(d.percentage)));
    };
  }

  private handleMouseMove(chartParent: ElementRef, tooltipDom: string): (d, i) => void {
    return (d, i) => {
      const bounds = chartParent.nativeElement.getBoundingClientRect();
      d3.select(tooltipDom)
        .style('left', d3.event.clientX - bounds.left + 10 + 'px')
        .style('top', d3.event.clientY - bounds.top + 10 + 'px');
    };
  }

  private handleMouseOut(tooltipDom: string): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .attr('opacity', 1);
      d3.select(tooltipDom)
        .style('opacity', 0);
    };
  }


}


export class TornadoD3CharCombined {
  private svg: any;
  private chart: any;
  private width: number;
  private height: number;

  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;

  private yInnerScale: any;

  private margin: { top: number, right: number, bottom: number, left: number };

  constructor(chartParent: ElementRef, elementRef: ElementRef, margin: any, maxPercentage: number, ageGroup: string[], barData: any[], tooltipDom: string) {
    this.updateChart(chartParent, elementRef, margin, maxPercentage, ageGroup, barData, tooltipDom);
  }

  updateChart(chartParent: ElementRef, elementRef: ElementRef, margin: any, maxPercentage: number, ageGroup: string[], barData: any[], tooltipDom: string) {
    const domID = '#' + elementRef.nativeElement.id;
    this.margin = margin;

    this.width = elementRef.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = elementRef.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(domID).select('svg');
    this.chart = this.svg.select('.bars')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);


    const maxPercentageAdjusted = maxPercentage + 0.04;


    // create scales
    this.xScale = d3.scaleLinear()
      .domain([-maxPercentageAdjusted, maxPercentageAdjusted])
      .range([0, this.width]);

    this.yScale = d3.scaleBand()
      .domain(ageGroup)
      .range([this.height, 0])
      .padding(0.2);

    this.yInnerScale = d3.scaleBand()
      .domain(['BENCHMARK', 'PROPOSAL'])
      .range([0, this.yScale.bandwidth()])
      .paddingInner(0.2);


    // x axis  percentage formatting remove (-) sign
    const xaxis = d3.axisBottom(this.xScale)
      .tickFormat((d) => d3.format('.0%')(Math.abs(Number(d))));
    const yaxis = d3.axisLeft(this.yScale)
      .tickSize(-this.width);


    this.xAxis = this.chart.select('.x.axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xaxis);


    this.yAxis = this.chart.select('.y.axis')
      .call(yaxis);

    this.chart.selectAll('.y.axis .tick line')
      .attr('y1', - this.yScale.step() / 2)
      .attr('y2', - this.yScale.step() / 2);

    // create groups
    let groups = this.chart.selectAll('.group')
      .data(ageGroup);

    groups.exit().remove();

    // update existing groups
    groups
      .attr('transform', d => 'translate(0,' + this.yScale(d) + ')');

    // adding new groups
    groups.enter().append('g')
      .classed('group', true)
      .attr('transform', d => 'translate(0,' + this.yScale(d) + ')');

    groups = this.chart.selectAll('.group')
      .data(ageGroup);


    const bars = groups.selectAll('.bar')
      .data((d) => barData.filter(d1 => (d1.key.ageGroup === d)));

    bars.exit().remove();

    // update existing bars
    bars
      .transition()
      .attr('x', (d) => d.percentage < 0 ? this.xScale(Math.min(0, d.percentage)) : this.xScale(Math.min(0, d.percentage)) + 1)
      .attr('y', (d) => this.yInnerScale(d.source))
      .attr('width', (d) => Math.abs(this.xScale(d.percentage) - this.xScale(0)))
      .attr('height', this.yInnerScale.bandwidth());

    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .classed('bar--negative', d => (d.percentage < 0 ? true : false))
      .classed('bar--positive', d => (d.percentage < 0 ? false : true))
      .classed('benchmark', d => (d.source === 'BENCHMARK' ? true : false))
      .classed('client', d => (d.source === 'BENCHMARK' ? false : true))
      .attr('x', (d) => d.percentage < 0 ? this.xScale(Math.min(0, d.percentage)) : this.xScale(Math.min(0, d.percentage)) + 1)
      .attr('y', (d) => this.yInnerScale(d.source))
      .attr('width', (d) => Math.abs(this.xScale(d.percentage) - this.xScale(0)))
      .attr('height', this.yInnerScale.bandwidth())
      .on('mouseover', this.handleMouseOver(tooltipDom))
      .on('mousemove', this.handleMouseMove(chartParent, tooltipDom))
      .on('mouseout', this.handleMouseOut(tooltipDom));
  }

  private handleMouseOver(tooltipDom: string): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .attr('opacity', 0.5);
      const formatFixedPercent = d3.format('.1%');

      d3.select(tooltipDom)
        .style('opacity', 1)
        .html(d.source + '<br/>' + (d.key.gender === 'F' ? 'Female' : 'Male') + ': ' + formatFixedPercent(Math.abs(d.percentage)));
    };
  }

  private handleMouseOut(tooltipDom: string): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .attr('opacity', 1);
      d3.select(tooltipDom)
        .style('opacity', 0);
    };
  }

  private handleMouseMove(chartParent: ElementRef, tooltipDom: string): (d, i) => void {
    return (d, i) => {
      const bounds = chartParent.nativeElement.getBoundingClientRect();
      d3.select(tooltipDom)
        .style('left', d3.event.clientX - bounds.left + 10 + 'px')
        .style('top', d3.event.clientY - bounds.top + 10 + 'px');
    };
  }


}




