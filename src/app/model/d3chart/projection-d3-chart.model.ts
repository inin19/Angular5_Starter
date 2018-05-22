import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class ProjectionD3Chart {
  static colors = {
    EMPLOYER_PREMIUM: '#5cbae6',
    FUNDING_GAP: '#fac364',
    MEMBER_PREMIUM: '#b6d957',
    TAX: '#d998cb',
    FEES: '#93b9c6',
    ESTIMATED_MEMBER_OOP_COST: '#93b9c6'
  };

  private width: number;
  private height: number;
  private svg: any;
  private chart: any;

  private x0Scale: any;
  private x1Scale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;

  private margin: { top: number, right: number, bottom: number, left: number };
  private color: any;

  constructor(
    chartParent: ElementRef,
    elementRef: ElementRef,
    margin: any,
    xScaleDomain: any[],
    x1ScaleDomain: any[],
    yScaleDomain: any[],
    barData: any[],
    categoryTranslation: any,
    tooltipDomID: string,
    color: any
  ) {
    this.updateChart(chartParent, elementRef, margin, xScaleDomain, x1ScaleDomain, yScaleDomain, barData, categoryTranslation, tooltipDomID, color);
  }


  updateChart(
    chartParent: ElementRef,
    elementRef: ElementRef,
    margin: any,
    xScaleDomain: any[],
    x1ScaleDomain: any[],
    yScaleDomain: any[],
    barData: any[],
    categoryTranslation: any,
    tooltipDomID: string,
    color: any
  ) {


    const domID = '#' + elementRef.nativeElement.id;
    this.margin = margin;

    this.width = elementRef.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = elementRef.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;


    this.svg = d3.select(domID).select('svg');
    this.chart = this.svg.select('.bars')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // create scales
    this.x0Scale = d3.scaleBand().domain(xScaleDomain)
      .rangeRound([0, this.width])
      .paddingInner(0.3)
      .paddingOuter(0.3);


    this.x1Scale = d3.scaleBand().domain(x1ScaleDomain)
      .range([0, this.x0Scale.bandwidth()])
      .paddingInner(0.2);


    this.yScale = d3.scaleLinear()
      .domain(yScaleDomain)
      .range([this.height, 0]);


    //  x & y axis
    const xaxis = d3.axisBottom(this.x0Scale)
      .tickSizeOuter(0)
      // .tickSizeInner(0)

      .tickSize(-this.height)
      .tickFormat((d) => d === 0 ? 'Current Policy' : 'Period ' + d);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.2s'));




    // move tick line

    this.chart.selectAll('.x.axis .tick line')
      .attr('x1', + this.x0Scale.step() / 2)
      .attr('x2', + this.x0Scale.step() / 2);


    // move xaxis text down a little bit
    this.chart.selectAll('.x.axis .tick text')
      .attr('transform', `translate(0,${this.margin.bottom / 3})`);


    this.xAxis = this.chart.select('.x.axis')
      .attr('transform', `translate(0, ${this.height})`)
      .transition()
      .call(xaxis);

    this.yAxis = this.chart.select('.y.axis')
      .transition()
      .call(yaxis);


    // update chart
    let groups = this.chart.selectAll('.group')
      .data(xScaleDomain);

    groups.exit().remove();

    // update existing groups
    groups
      .attr('transform', d => 'translate(' + this.x0Scale(d) + ',0)');

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true)
      .attr('transform', d => 'translate(' + this.x0Scale(d) + ',0)');


    // rejoin data VERY IMPORTANT
    groups = this.chart.selectAll('.group')
      .data(xScaleDomain);


    const bars = groups.selectAll('.bar')
      .data((d) => barData.filter((item) => d === item.period));

    bars.exit().remove();

    // update existing bars
    bars
      .transition()
      .attr('width', d => (d.period === 0 && x1ScaleDomain.length === 2) ? this.x1Scale.bandwidth() * 2 : this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.column))
      .attr('y', d => this.yScale(d.yEnd))
      .attr('height', d => (d.period === 0 && d.column === 'PROPOSED') ? 0 : this.yScale(d.yBegin) - this.yScale(d.yEnd))
      .style('fill', d => ProjectionD3Chart.colors[d.categoery])
      ;

    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', d => (d.period === 0 && x1ScaleDomain.length === 2) ? this.x1Scale.bandwidth() * 2 : this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.column))
      .attr('y', d => this.yScale(d.yEnd))
      .attr('height', d => (d.period === 0 && d.column === 'PROPOSED') ? 0 : this.yScale(d.yBegin) - this.yScale(d.yEnd))
      .style('fill', d => ProjectionD3Chart.colors[d.categoery])
      .on('mouseover', this.handleMouseOver(categoryTranslation, tooltipDomID))
      .on('mousemove', this.handleMouseMove(chartParent, tooltipDomID))
      .on('mouseout', this.handleMouseOut(tooltipDomID));
  }

  handleMouseOver(translation: any, tooltipDomID: string): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .style('opacity', 0.5);
      const f = d3.format('.2s');
      d3.select(tooltipDomID)
        .style('opacity', 1)
        .html(
          d.column + ': ' + translation[d.categoery] + '<br/>' + f(d.value)
        );
    };
  }

  handleMouseOut(tooltipDomID: string): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .style('opacity', 1);
      d3.select(tooltipDomID)
        .style('opacity', 0);
    };
  }

  handleMouseMove(chartParent: ElementRef, tooltipDomID: string): (d, i) => void {
    return (d, i) => {
      const bounds = chartParent.nativeElement.getBoundingClientRect();
      d3.select(tooltipDomID)
        .style('left', d3.event.clientX - bounds.left + 10 + 'px')
        .style('top', d3.event.clientY - bounds.top + 10 + 'px');
    };
  }

}
