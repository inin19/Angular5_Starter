import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class Scatterplot {

  private width: number;
  private height: number;
  private svg: any;
  private chart: any;

  private xScale: any;
  private x1Scale: any;

  private yScale: any;
  private xAxis: any;
  private yAxis: any;

  private pathCurrent: any;
  private pathProposed: any;

  private margin: { top: number, right: number, bottom: number, left: number };

  private type: string;

  constructor(
    chartParent: ElementRef,
    elementRef: ElementRef,
    margin: any,
    data: any[],
    lossRatio: boolean
  ) {
    this.updateChart(chartParent, elementRef, margin, data, lossRatio);
  }

  updateChart(
    chartParent: ElementRef,
    elementRef: ElementRef,
    margin: any,
    data: any[],
    lossRatio: boolean
  ) {

    if (lossRatio === true) {
      this.type = 'lossRatio';
    } else {
      this.type = 'renewalRate';
    }
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const domID = '#' + elementRef.nativeElement.id;
    this.margin = margin;

    this.width = elementRef.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = elementRef.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;
    this.svg = d3.select(domID).select('svg');


    this.chart = this.svg.select('.scatterplotGroup')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);






    this.xScale = d3.scaleBand()
      .domain(['0', '1', '2', '3', '4', '5'])
      .rangeRound([0, this.width])
      .paddingInner(0.2)
      .paddingOuter(0.2);


    this.x1Scale = d3.scaleBand()
      .domain(['CURRENT', 'PROPOSED'])
      .range([0, this.xScale.bandwidth()])
      .paddingInner(0.2);


    // console.log(d3.extent(data, (d) => d.lossRatio));

    this.yScale = d3.scaleLinear()
      .domain([d3.extent(data, (d) => d[this.type])[0], d3.extent(data, (d) => d[this.type])[1] + 0.05]).nice()
      .range([this.height, 0]);



    this.pathCurrent = this.chart.select('.line.currentPath')
      .attr('transform', `translate(${this.x1Scale.bandwidth() / 2}, 0)`);


    this.pathProposed = this.chart.select('.line.proposedPath')
      .attr('transform', `translate(${this.xScale.bandwidth() / 2 + this.x1Scale.bandwidth() / 2 + 8}, 0)`);

    const valueline = d3.line()
      .x((d) => this.xScale(d['period']))
      .y((d) => this.yScale(d[this.type]));

    this.pathCurrent
      .data([data.filter(d => d.currentProposed === 'CURRENT')])
      .attr('d', valueline)
      .attr('stroke', 'green');

    this.pathProposed
      .data([data.filter(d => d.currentProposed === 'PROPOSED')])
      .attr('d', valueline)
      .attr('stroke', 'blue');






    const xaxis = d3.axisBottom(this.xScale).tickSize(-this.height);
    const yaxis = d3.axisRight(this.yScale)
      .ticks(4)
      .tickFormat(d3.format('.0%'));


    this.xAxis = this.chart.select('.x.axis')
      .attr('transform', `translate(0, ${this.height})`)
      .transition()
      .call(xaxis);


    this.yAxis = this.chart.select('.y.axis')
      .attr('transform', `translate(${this.width}, 0)`)
      .transition()
      .call(yaxis);


    this.chart.selectAll('.x.axis .tick line')
      .attr('x1', + this.xScale.step() / 2)
      .attr('x2', + this.xScale.step() / 2)
      .style('opacity', 0);


    // update chart
    let groups = this.chart.selectAll('.group')
      .data(['0', '1', '2', '3', '4', '5']);

    groups.exit().remove();

    // update existing groups
    groups
      .attr('transform', d => 'translate(' + this.xScale(d) + ',0)');

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true)
      .attr('transform', d => 'translate(' + this.xScale(d) + ',0)');

    // rejoin data VERY IMPORTANT
    groups = this.chart.selectAll('.group')
      .data(['0', '1', '2', '3', '4', '5']);




    const labels = groups.selectAll('.textLabel')
      .data((d) => data.filter((item) => d === item.period.toString()));
    labels.exit().remove();


    labels
      .transition()
      .attr('x', d => this.x1Scale(d.currentProposed) + this.x1Scale.bandwidth() / 2)
      .attr('y', d => this.yScale(d[this.type]) - 8 * 2)
      .text(d => d3.format('.1%')(d[this.type]))
      ;


    labels
      .enter()
      .append('text')
      .classed('textLabel', true)
      .classed('current', (d) => d.currentProposed === 'CURRENT' ? true : false)
      .classed('proposed', (d) => d.currentProposed === 'PROPOSED' ? true : false)
      .text(d => d3.format('.1%')(d[this.type]))
      .attr('x', d => this.x1Scale(d.currentProposed) + this.x1Scale.bandwidth() / 2)
      .attr('y', d => this.yScale(d[this.type] + 0.05))
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .style('opacity', 0);









    // creating circles
    const dots = groups.selectAll('.dot')
      .data((d) => data.filter((item) => d === item.period.toString()));

    dots.exit().remove();


    // console.log(this.x1Scale('CURRENT'), this.xScale.step() / 2, this.);


    dots
      .transition()
      .attr('r', 8)
      .attr('cx', d => this.x1Scale(d.currentProposed) + this.x1Scale.bandwidth() / 2)
      .attr('cy', d => this.yScale(d[this.type]));

    dots
      .enter()
      .append('circle')
      .classed('dot', true)
      .classed('current', (d) => d.currentProposed === 'CURRENT' ? true : false)
      .classed('proposed', (d) => d.currentProposed === 'PROPOSED' ? true : false)
      .attr('r', 8)
      .attr('cx', d => this.x1Scale(d.currentProposed) + this.x1Scale.bandwidth() / 2)
      .attr('cy', d => this.yScale(d[this.type]))
      .style('fill', (d) => d.currentProposed === 'CURRENT' ? 'green' : 'blue')
      .style('opacity', 0.5)
      .on('mouseover', this.handleMouseOver(chartParent))
      .on('mouseout', this.handleMouseOut())
      ;





  }



  handleMouseOver(chartParent: ElementRef): (d, i) => void {
    return (d, i) => {

      const bounds = chartParent.nativeElement.getBoundingClientRect();

      d3.select(d3.event.currentTarget)
        .transition()
        .style('opacity', 0.8)
        .attr('r', 10);


      if (d.currentProposed === 'CURRENT') {
        d3.select('#lossRatioToolip')
          .style('opacity', 1)
          .style('left', d3.event.clientX - bounds.left + 10 + 'px')
          .style('top', d3.event.clientY - bounds.top + 10 + 'px')
          .html(
            'CURRENT'
          );


        this.pathCurrent
          .transition()
          .style('opacity', 0.5);

        this.chart.selectAll('.dot.current')
          .transition()
          .style('opacity', 0.8);

        this.chart.selectAll('.dot.proposed')
          .transition()
          .style('opacity', 0.1);

        this.chart.selectAll('.textLabel.current')
          .transition()
          .style('opacity', 0.8);
      } else {



        d3.select('#lossRatioToolip')
          .style('opacity', 1)
          .style('left', d3.event.clientX - bounds.left + 10 + 'px')
          .style('top', d3.event.clientY - bounds.top + 10 + 'px')
          .html(
            'PROPOSED'
          );

        this.pathProposed
          .transition()
          .style('opacity', 0.5);

        this.chart.selectAll('.dot.proposed')
          .transition()
          .style('opacity', 0.8);

        this.chart.selectAll('.dot.current')
          .transition()
          .style('opacity', 0.1);


        this.chart.selectAll('.textLabel.proposed')
          .transition()
          .style('opacity', 0.8);

      }
    };
  }



  handleMouseOut(): (d, i) => void {
    return (d, i) => {

      d3.select('#lossRatioToolip')
        .style('opacity', 0);

      d3.select(d3.event.currentTarget)
        .transition()
        .style('opacity', 0.5)
        .attr('r', 8);

      this.chart.selectAll('.textLabel')
        .transition()
        .style('opacity', 0);


      this.chart.selectAll('.dot')
        .transition()
        .style('opacity', 0.5);

      if (d.currentProposed === 'CURRENT') {
        this.pathCurrent
          .transition()
          .style('opacity', 0);

      } else {
        this.pathProposed
          .transition()
          .style('opacity', 0);
      }
    };
  }


}
