import { ElementRef } from '@angular/core';
import { ProjectionChartConfig } from '../chart-config'
import * as d3 from 'd3';
import { style } from '@angular/animations';


export class ProjectionD3Chart {

  static colors = {
    EMPLOYER_PREMIUM: '#5cbae6',
    FUNDING_GAP: '#fac364',
    MEMBER_PREMIUM: '#b6d957',
    TAX: '#d998cb',
    FEES: '#93b9c6'
  };

  private width: number;
  private height: number;
  private svg: any;
  private chart: any;

  private graphTitle: any;
  private x0Scale: any;
  private x1Scale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;

  private legend: any;

  // private grids: any;

  private margin: { top: number, right: number, bottom: number, left: number };


  constructor(chartConfig: ProjectionChartConfig) {
    const htmlElement = chartConfig.chartContainer.nativeElement;
    this.margin = chartConfig.margin;
    this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;

    // console.log(this.width, + ' ' + this.height);

    this.svg = d3.select(chartConfig.domID).append('svg')
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    this.chart = this.svg
      .append('g')
      .classed('bars', true)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // // adding graph title
    this.graphTitle = this.chart.append('text')
      .classed('graphTitle', true)
      .attr('x', (this.width / 2))
      .attr('y', 0 - (this.margin.top / 1.5))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(chartConfig.title);

    // // create scales
    this.x0Scale = d3.scaleBand().domain(chartConfig.xScaleDomain)
      .rangeRound([0, this.width])
      .padding(0.2);

    this.x1Scale = d3.scaleBand().domain(chartConfig.x1ScaleDomain)
      .range([0, this.x0Scale.bandwidth()])
      .paddingInner(0.2);


    this.yScale = d3.scaleLinear()
      .domain(chartConfig.yScaleDomain)
      .range([this.height, 0]);

    // // x & y axis
    const xaxis = d3.axisBottom(this.x0Scale)
      .tickSizeOuter(0)
      .tickFormat((d) => d === 0 ? 'Current Policy' : 'Period ' + d);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.2s'));

    this.xAxis = this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xaxis);

    this.yAxis = this.chart.append('g')
      .attr('class', 'y axis')
      .call(yaxis);

  }


  updateChart(chartConfig: ProjectionChartConfig) {
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
    this.x0Scale.rangeRound([0, this.width]);
    this.x1Scale.range([0, this.x0Scale.bandwidth()]);
    this.yScale.range([this.height, 0]);

    // update domain
    this.x0Scale.domain(chartConfig.xScaleDomain);
    this.x1Scale.domain(chartConfig.x1ScaleDomain);
    this.yScale.domain(chartConfig.yScaleDomain);

    // update axis

    const xaxis = d3.axisBottom(this.x0Scale)
      .tickSizeOuter(0)
      .tickFormat((d) => d === '0' ? 'Current Policy' : 'Period ' + d);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.2s'));

    this.xAxis.transition().call(xaxis);
    this.yAxis.transition().call(yaxis);

    // console.log(chartConfig.periodGroup);

    // update chart
    let groups = this.chart.selectAll('.group')
      .data(chartConfig.periodGroup);


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
      .data(chartConfig.periodGroup);



    const bars = groups.selectAll('.bar')
      .data((d) => chartConfig.barData.filter((item) => d === item.period));

    bars.exit().remove();

    // update existing bars
    bars
      .transition()
      .attr('width', d => (d.period === 0 && chartConfig.x1ScaleDomain.length === 2) ? this.x1Scale.bandwidth() * 2 : this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.column))
      .attr('y', d => this.yScale(d.yEnd))
      .attr('height', d => (d.period === 0 && d.column === 'PROPOSED') ? 0 : this.yScale(d.yBegin) - this.yScale(d.yEnd));

    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', d => (d.period === 0 && chartConfig.x1ScaleDomain.length === 2) ? this.x1Scale.bandwidth() * 2 : this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.column))
      .attr('y', d => this.yScale(d.yEnd))
      .attr('height', d => (d.period === 0 && d.column === 'PROPOSED') ? 0 : this.yScale(d.yBegin) - this.yScale(d.yEnd))
      .style('fill', d => ProjectionD3Chart.colors[d.categoery])
      ;



  }

}




