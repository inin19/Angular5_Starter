import { ElementRef } from '@angular/core';
import { ProjectionChartConfig } from '../chart-config'
import * as d3 from 'd3';


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

  private legendWidth: number;

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
      .attr('y', 0 - (this.margin.top))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(chartConfig.title);



    // create legend
    this.legend = this.chart.append('g').classed('legendWrapper', true)
      .selectAll('.legend')
      .data(chartConfig.categories)
      .enter().append('g')
      .classed('legend', true);

    const textWidth = [];
    const textX = {};
    let legendText = null;
    let textHeight = 0;
    const rectHeight = 10;

    let textY: number;
    let rectY: number;

    legendText = this.legend.selectAll('.dummyText')
      .data(d => [d])
      .enter()
      .append('text')
      .attr('x', d => textX[d])
      .attr('y', 0 - (this.margin.top / 4))
      // .attr('dy', '0.5em')
      .classed('dummyText', true)
      .text(function (d) { return d; })
      .each(function (d) {
        textWidth.push(this.getComputedTextLength());
        textHeight = this.getBoundingClientRect().height;
        textY = this.getBoundingClientRect().top;
        // this.remove();
      });

    // textWidth.pop();

    let curr = 12;

    chartConfig.categories.forEach((element, i) => {
      textX[element] = curr;
      curr = curr + textWidth[i] + 30;
    });


    this.legend.selectAll('rect')
      .data(d => [d])
      .enter()
      .append('rect')
      .attr('x', d => textX[d] - 12)
      .attr('y', 0 - (this.margin.top / 4))
      .attr('width', rectHeight)
      .attr('height', rectHeight)
      .attr('fill', d => ProjectionD3Chart.colors[d])
      .each(function (d) {
        rectY = this.getBoundingClientRect().top;
        // console.log(this.getBoundingClientRect());
      })
      ;

    // console.log(textY, rectY, textHeight, rectHeight);

    this.legend.selectAll('rect')
      .attr('y', 0 - (this.margin.top / 4) + (textY - rectY) + ((textHeight - rectHeight) / 2));

    legendText = this.legend.selectAll('.legendText')
      .data(d => [d])
      .enter()
      .append('text')
      .classed('legendText', true)
      .attr('x', d => textX[d])
      .attr('y', 0 - (this.margin.top / 4))
      .text(function (d) { return d; });


    let wrapperWidth = 0;


    d3.select('.legendWrapper').call(getElementWidth, this);

    function getElementWidth(e): void {
      e.select(function () {
        wrapperWidth = this.getBoundingClientRect().width;
      })
    }

    this.legendWidth = wrapperWidth;

    d3.select('.legendWrapper')
      .attr('transform', 'translate(' + (this.width - this.legendWidth) / 2 + ',0)');



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

    // update legend

    d3.select('.legendWrapper')
      .attr('transform', 'translate(' + (this.width - this.legendWidth) / 2 + ',0)');

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


    // rejoin data VERY IMPORTANT
    groups = this.chart.selectAll('.group')
      .data(chartConfig.xScaleDomain);



    const bars = groups.selectAll('.bar')
      .data((d) => chartConfig.barData.filter((item) => d === item.period));

    bars.exit().remove();

    // update existing bars
    bars
      .transition()
      .attr('width', d => (d.period === 0 && chartConfig.x1ScaleDomain.length === 2) ? this.x1Scale.bandwidth() * 2 : this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.column))
      .attr('y', d => this.yScale(d.yEnd))
      .attr('height', d => (d.period === 0 && d.column === 'PROPOSED') ? 0 : this.yScale(d.yBegin) - this.yScale(d.yEnd))
      .style('fill', d => ProjectionD3Chart.colors[d.categoery])
      ;

    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', d => (d.period === 0 && chartConfig.x1ScaleDomain.length === 2) ? this.x1Scale.bandwidth() * 2 : this.x1Scale.bandwidth())
      .attr('x', d => this.x1Scale(d.column))
      .attr('y', d => this.yScale(d.yEnd))
      .attr('height', d => (d.period === 0 && d.column === 'PROPOSED') ? 0 : this.yScale(d.yBegin) - this.yScale(d.yEnd))
      .style('fill', d => ProjectionD3Chart.colors[d.categoery])
      .on('mouseover', this.handleMouseOver(chartConfig))
      .on('mousemove', this.handleMouseMove(chartConfig))
      .on('mouseout', this.handleMouseOut(chartConfig));



  }



  handleMouseOver(chartConfig: ProjectionChartConfig): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .attr('opacity', 0.5);
      const f = d3.format('.2s');
      d3.select(chartConfig.tooltipDomID)
        .style('opacity', 1)
        .html(
          d.column + ': ' + d.categoery + '<br/>' + f(d.value)
        );
    };
  }

  handleMouseOut(chartConfig: ProjectionChartConfig): (d, i) => void {
    return (d, i) => {
      // console.log('in MouseOut');
      d3.select(d3.event.currentTarget)
        .attr('opacity', 1);
      d3.select(chartConfig.tooltipDomID)
        .style('opacity', 0);
    };
  }

  handleMouseMove(chartConfig: ProjectionChartConfig): (d, i) => void {
    return (d, i) => {
      const bounds = chartConfig.toolTipParent.nativeElement.getBoundingClientRect();
      d3.select(chartConfig.tooltipDomID)
        .style('left', d3.event.clientX - bounds.left + 10 + 'px')
        .style('top', d3.event.clientY - bounds.top + 10 + 'px');
    };
  }

}




