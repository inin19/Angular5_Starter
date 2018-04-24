import { AvgClaimCostChartConfig } from './../utils/chart-config';
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

  private graphTitle: any;

  private x0Scale: any;
  private x1Scale: any;

  private yScale: any;

  private xAxis: any;
  private yAxis: any;

  private legend: any;

  private margin: { top: number, right: number, bottom: number, left: number };

  constructor(chartConfig: AvgClaimCostChartConfig) {
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
    this.x0Scale = d3.scaleBand()
      .domain(chartConfig.xScaleDomain)
      .rangeRound([0, this.width])
      .padding(0.2);

    this.x1Scale = d3.scaleBand()
      .domain(chartConfig.x1ScaleDomain)
      .range([0, this.x0Scale.bandwidth()])
      .paddingInner(0.2);

    this.yScale = d3.scaleLinear()
      .domain(chartConfig.yScaleDomain)
      .range([this.height, 0]);


    const xaxis = d3.axisBottom(this.x0Scale)
      .tickSizeOuter(0)
      // .tickFormat((d) => d === 0 ? 'Current Policy' : 'Period ' + d)
      ;


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

    d3.select(chartConfig.domID + ' .x.axis').selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      ;

  }

  updateChart(chartConfig: AvgClaimCostChartConfig) {

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

    // update domain
    this.x0Scale.domain(chartConfig.xScaleDomain);
    this.x1Scale.domain(chartConfig.x1ScaleDomain);
    this.yScale.domain(chartConfig.yScaleDomain);

    // update scales
    this.x0Scale.rangeRound([0, this.width]);
    this.x1Scale.range([0, this.x0Scale.bandwidth()]);
    this.yScale.range([this.height, 0]);


    // update axis

    const xaxis = d3.axisBottom(this.x0Scale)
      .tickSizeOuter(0);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.2s'));

    this.xAxis.transition()
      .attr('transform', `translate(0, ${this.height})`)
      .call(xaxis);
    this.yAxis.transition().call(yaxis);



    // update chart
    const groups = this.chart.selectAll('.group')
      .data(chartConfig.xScaleDomain);


    groups.exit().remove();


    // update existing groups
    groups
      .attr('transform', d => 'translate(' + this.x0Scale(d) + ',0)');

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true)
      .attr('transform', d => 'translate(' + this.x0Scale(d) + ',0)');


    // // rejoin data VERY IMPORTANT
    // groups = this.chart.selectAll('.group')
    //   .data(chartConfig.xScaleDomain);

    const bars = groups.selectAll('.bar')
      .data((d) => chartConfig.barData.filter((item) => d === chartConfig.conditionGroupTranslation[item.key]));

    bars.exit().remove();



    // update existing bars
    bars
      .transition()
      .attr('width', this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.series))
      .attr('y', d => this.yScale(d.value))
      .attr('height', d => (this.yScale(0) - this.yScale(d.value)))
      .style('fill', d => AvgCostD3Chart.colors[d.series])
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
      .style('fill', d => AvgCostD3Chart.colors[d.series])
      .on('mouseover', this.handleMouseOver(chartConfig))
      .on('mousemove', this.handleMouseMove(chartConfig))
      .on('mouseout', this.handleMouseOut(chartConfig))
      ;


  }

  handleMouseOver(chartConfig: AvgClaimCostChartConfig): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .attr('opacity', 0.5);
      const format = d3.format('.2s');

      let text = '';
      if (d.series === 1) {
        text = chartConfig.conditionGroupTranslation[d.key] + '<br/>' + 'Previous Year: ' + format(d.value);
      } else if (d.series === 2) {
        text = chartConfig.conditionGroupTranslation[d.key] + '<br/>' + 'Current Year: ' + format(d.value);
      } else {
        text = chartConfig.conditionGroupTranslation[d.key] + '<br/>' + 'Benchmark Current Year: ' + format(d.value);

      }

      d3.select(chartConfig.tooltipDomID)
        .style('opacity', 1)
        .html(
          text
        );
    };
  }

  handleMouseOut(chartConfig: AvgClaimCostChartConfig): (d, i) => void {
    return (d, i) => {
      // console.log('in MouseOut');
      d3.select(d3.event.currentTarget)
        .attr('opacity', 1);
      d3.select(chartConfig.tooltipDomID)
        .style('opacity', 0);
    };
  }


  handleMouseMove(chartConfig: AvgClaimCostChartConfig): (d, i) => void {
    return (d, i) => {
      const bounds = chartConfig.toolTipParent.nativeElement.getBoundingClientRect();
      d3.select(chartConfig.tooltipDomID)
        .style('left', d3.event.clientX - bounds.left + 10 + 'px')
        .style('top', d3.event.clientY - bounds.top + 10 + 'px');
    };
  }


}


