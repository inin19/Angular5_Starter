import { ElementRef } from '@angular/core';
import * as d3 from 'd3';


export class WaterfallD3Chart {

  static chartType = {
    PERCAPITA: 'PERCAPITA',
    FREQUENCY: 'FREQUENCY'
  };

  // static stackColor = { firstLastBar: '#6b9be2', fall: '#71bc78', rise: '#fcb97d' };


  private yScaleFormat: any;
  private tooltipFormat: any;

  private width: number;
  private height: number;

  private svg: any;
  private chart: any;
  private xScale: any;
  private yScale: any;

  private xAxis: any;
  private yAxis: any;


  private margin: { top: number, right: number, bottom: number, left: number };

  private stackColor = { firstLastBar: '#6b9be2', fall: '#71bc78', rise: '#fcb97d' };

  constructor(
    chartParent: ElementRef,
    elementRef: ElementRef,
    margin: any,
    chartType: string,
    xScaleDomain: any[],
    yScaleDomain: any[],
    barData: any[],
    conditionGroupTranslation: any,
    zoom: boolean,
    tooltipDomID: string) {

    this.updateChart(chartParent, elementRef, margin, chartType, xScaleDomain, yScaleDomain, barData, conditionGroupTranslation, zoom, tooltipDomID);
  }


  updateChart(chartParent: ElementRef,
    elementRef: ElementRef,
    margin: any,
    chartType: string,
    xScaleDomain: any[],
    yScaleDomain: any[],
    barData: any[],
    conditionGroupTranslation: any,
    zoom: boolean,
    tooltipDomID: string) {


    // ??
    if (elementRef.nativeElement.offsetWidth === 0 && elementRef.nativeElement.offsetHeight === 0) {
      return;
    }

    if (chartType === WaterfallD3Chart.chartType.PERCAPITA) {
      this.yScaleFormat = d3.format('.3s');
      this.tooltipFormat = d3.format('.1f');
    } else {
      this.yScaleFormat = d3.format('.2f');
      this.tooltipFormat = d3.format('.4f');
    }

    const domID = '#' + elementRef.nativeElement.id;
    this.margin = margin;

    this.width = elementRef.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = elementRef.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;


    this.svg = d3.select(domID).select('svg');

    this.chart = this.svg.select('.bars')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // adding scales
    this.xScale = d3.scaleBand()
      .domain(xScaleDomain)
      .rangeRound([0, this.width])
      .padding(0.2);

    this.yScale = d3.scaleLinear()
      .domain(yScaleDomain)
      .range([this.height, 0]);

    // x & y axis
    const xaxis = d3.axisBottom(this.xScale)
      .tickSizeOuter(0);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(this.yScaleFormat);


    this.xAxis = this.chart.select('.x.axis')
      .attr('transform', `translate(0, ${this.height})`)
      .transition()
      .call(xaxis);

    this.yAxis = this.chart.select('.y.axis')
      .transition()
      .call(yaxis);


    this.chart.select('.x.axis').selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');


    // updating grouops and charts
    let groups = this.chart.selectAll('.group')
      .data(['Fall', 'Rise']);

    groups.exit().remove();

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true);

    groups = this.chart.selectAll('.group')
      .data(['Fall', 'Rise']);


    // revisit
    const bars = groups.selectAll('.bar')
      .data((d) => barData.filter((item) => item.key === d)[0]);

    bars.exit().remove();


    bars
      .classed('claims__waterfall-year', d => (d.data.key === 'PREVYEAR' || d.data.key === 'CURRYEAR') ? true : false)
      .classed('claims__waterfall-fall', d => (d.data.key !== 'PREVYEAR' && d.data.key !== 'CURRYEAR' && d.data.Fall > 0) ? true : false)
      .classed('claims__waterfall-rise', d => (d.data.key !== 'PREVYEAR' && d.data.key !== 'CURRYEAR' && d.data.Fall === 0) ? true : false)
      .transition()
      .attr('x', d => this.xScale(conditionGroupTranslation[d.data.key]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => {
        if ((d.data.key === 'PREVYEAR' || d.data.key === 'CURRYEAR') && zoom) {
          return this.yScale(d[0]) - this.yScale(d[1] - yScaleDomain[0]);
        } else {
          return this.yScale(d[0]) - this.yScale(d[1]);
        }
      });


    // adding new bars
    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('x', d => this.xScale(conditionGroupTranslation[d.data.key]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => {
        if ((d.data.key === 'PREVYEAR' || d.data.key === 'CURRYEAR') && zoom) {
          return this.yScale(d[0]) - this.yScale(d[1] - yScaleDomain[0]);
        } else {
          return this.yScale(d[0]) - this.yScale(d[1]);
        }
      })

      .classed('claims__waterfall-year', d => (d.data.key === 'PREVYEAR' || d.data.key === 'CURRYEAR') ? true : false)
      .classed('claims__waterfall-fall', d => (d.data.key !== 'PREVYEAR' && d.data.key !== 'CURRYEAR' && d.data.Fall > 0) ? true : false)
      .classed('claims__waterfall-rise', d => (d.data.key !== 'PREVYEAR' && d.data.key !== 'CURRYEAR' && d.data.Fall === 0) ? true : false)

      .on('mouseover', this.handleMouseOver(tooltipDomID, conditionGroupTranslation))
      .on('mousemove', this.handleMouseMove(chartParent, tooltipDomID))
      .on('mouseout', this.handleMouseOut(tooltipDomID));
  }


  // i is the index of the data, d is the actual data
  handleMouseOver(tooltipDomID: string, conditionGroupTranslation: any): (d, i) => void {
    return (d, i) => {
      // console.log('in mouseOver');
      d3.select(d3.event.currentTarget)
        .style('opacity', 0.5);

      d3.select(tooltipDomID)
        .style('opacity', 1)
        .html(
          conditionGroupTranslation[d.data.key] + ': ' +
          this.tooltipFormat(d.data.value)
        );
    };
  }


  handleMouseOut(tooltipDom: string): (d, i) => void {
    return (d, i) => {
      // console.log('in MouseOut');
      d3.select(d3.event.currentTarget)
        .style('opacity', 1);
      d3.select(tooltipDom)
        .style('opacity', 0);
    };
  }



  handleMouseMove(chartParent: ElementRef, tooltipDom: string): (d, i) => void {
    return (d, i) => {
      const bounds = chartParent.nativeElement.getBoundingClientRect();
      d3.select(tooltipDom)
        .style('left', d3.event.clientX - bounds.left + 10 + 'px')
        .style('top', d3.event.clientY - bounds.top + 10 + 'px');
    };
  }

}
