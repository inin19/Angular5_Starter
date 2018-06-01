import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class AvgCostD3Chart {
  static colors = {
    1: 'green',
    2: 'green',
    3: 'blue'
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

  constructor(
    chartParent: ElementRef,
    elementRef: ElementRef,
    margin: any,
    xScaleDomain: any[],
    x1ScaleDomain: any[],
    yScaleDomain: any,
    barData: any[],
    conditionGroupTranslation: any,
    tooltipDomID: string
  ) {

    this.updateChart(chartParent, elementRef, margin, xScaleDomain, x1ScaleDomain, yScaleDomain, barData, conditionGroupTranslation, tooltipDomID);

  }

  updateChart(
    chartParent: ElementRef,
    elementRef: ElementRef,
    margin: any,
    xScaleDomain: any[],
    x1ScaleDomain: any[],
    yScaleDomain: any,
    barData: any[],
    conditionGroupTranslation: any,
    tooltipDomID: string

  ) {

    if (elementRef.nativeElement.offsetWidth === 0 && elementRef.nativeElement.offsetHeight === 0) {
      return;
    }

    const domID = '#' + elementRef.nativeElement.id;
    this.margin = margin;

    console.log(elementRef.nativeElement.id);

    this.width = elementRef.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = elementRef.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(domID).select('svg');

    this.chart = this.svg.select('.bars')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // adding scales
    this.x0Scale = d3.scaleBand()
      .domain(xScaleDomain)
      .rangeRound([0, this.width])
      .padding(0.2);

    this.x1Scale = d3.scaleBand()
      .domain(x1ScaleDomain)
      .range([0, this.x0Scale.bandwidth()])
      .paddingInner(0.2);

    this.yScale = d3.scaleLinear()
      .domain(yScaleDomain)
      .range([this.height, 0]);


    const xaxis = d3.axisBottom(this.x0Scale)
      .tickSizeOuter(0)
      ;


    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.2s'));


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



    // update chart
    const groups = this.chart.selectAll('.group')
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


    const bars = groups.selectAll('.bar')
      .data((d) => barData.filter((item) => d === conditionGroupTranslation[item.key]));

    bars.exit().remove();



    // update existing bars
    bars
      .classed('claim-avg-cost__graph-prev', d => d.series === 1)
      .classed('claim-avg-cost__graph-curr', d => d.series === 2)
      .classed('claim-avg-cost__graph-benchmark', d => d.series === 3)
      .classed('red', d => (d.series === 2 && d.diff > 0 ))

      .transition()
      .attr('width', this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.series))
      .attr('y', d => this.yScale(d.value))
      .attr('height', d => (this.yScale(0) - this.yScale(d.value)))
      // .style('fill', d => AvgCostD3Chart.colors[d.series])
      ;


    // revisit the bar colors
    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.series))
      .attr('y', d => this.yScale(d.value))
      .attr('height', d => (this.yScale(0) - this.yScale(d.value)))
      // .style('fill', d => AvgCostD3Chart.colors[d.series])
      .classed('claim-avg-cost__graph-prev', d => d.series === 1)
      .classed('claim-avg-cost__graph-curr', d => d.series === 2)
      .classed('claim-avg-cost__graph-benchmark', d => d.series === 3)
      .classed('red', d => (d.series === 2 && d.diff < 0 ))

      .on('mouseover', this.handleMouseOver(conditionGroupTranslation, tooltipDomID))
      .on('mousemove', this.handleMouseMove(chartParent, tooltipDomID))
      .on('mouseout', this.handleMouseOut(tooltipDomID));

  }

  handleMouseOver(conditionGroupTranslation: any, tooltipDomID: string): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .style('opacity', 0.5);
      const format = d3.format('.2f');
      let text = '';
      if (d.series === 1) {
        text = conditionGroupTranslation[d.key] + '<br/>' + 'Previous Year: ' + format(d.value);
      } else if (d.series === 2) {
        text = conditionGroupTranslation[d.key] + '<br/>' + 'Current Year: ' + format(d.value);
      } else {
        text = conditionGroupTranslation[d.key] + '<br/>' + 'Benchmark Current Year: ' + format(d.value);
      }

      d3.select(tooltipDomID)
        .style('opacity', 1)
        .html(text);
    };
  }

  handleMouseOut(tooltipDomID: string): (d, i) => void {
    return (d, i) => {
      // console.log('in MouseOut');
      d3.select(d3.event.currentTarget)
        .style('opacity', 0.8);
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
