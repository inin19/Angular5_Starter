import { ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { Selector } from './../utils/selector.model';
import { ProjectionPlanSelectionService } from './../../services/projection-plan-selection.service';


export class ProjectionPieChart {

  private radius: number;
  private width: number;
  private height: number;
  private svg: any;
  private donut: any;

  private pieData: any[];

  private margin: { top: number, right: number, bottom: number, left: number };

  private numberFormat = d3.format('.2s');
  private percentageFormat = d3.format('.2%');

  private planSelectorService: ProjectionPlanSelectionService;

  constructor(
    chartParent: ElementRef,
    elementRef: ElementRef,
    pieData: any[],
    tooltipDomID: string,
    planSelectorService: ProjectionPlanSelectionService
  ) {
    this.updateChart(chartParent, elementRef, pieData, tooltipDomID, planSelectorService);
  }




  updateChart(
    chartParent: ElementRef,
    elementRef: ElementRef,
    pieData: any[],
    tooltipDomID: string,
    planSelectorService: ProjectionPlanSelectionService

  ) {

    this.planSelectorService = planSelectorService;

    this.pieData = pieData;
    const color = d3.scaleOrdinal(d3.schemeCategory10);


    const domID = '#' + elementRef.nativeElement.id;

    this.width = elementRef.nativeElement.offsetWidth;
    this.height = elementRef.nativeElement.offsetHeight;

    this.svg = d3.select(domID).select('svg');

    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
    // .attr('viewBox', `0 0 ${this.width} ${this.height}`);





    // const radius = Math.min(this.width, this.height) / 2;

    this.radius = Math.min(this.width, this.height) / 2.3;


    this.donut = this.svg.select('.piechartContainer');
    this.donut
      .attr('transform', `translate( ${this.width / 2}, ${this.height / 2})`);



    // start mid part
    const circle = this.donut.select('circle');

    circle
      .attr('r', this.radius * 0.65)
      .attr('fill', '#E7E7E7')
      .on('mouseover', this.handleMouseOver_middle())
      .on('mouseout', this.handleMouseOut_middle())
      .on('click', this.handleClick_middle())
      ;

    this.donut.select('.center-txt.type')
      .attr('y', this.radius * -0.16)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      ;


    this.donut.select('.center-txt.value')
      .attr('text-anchor', 'middle')
      ;

    this.donut.select('.center-txt.percentage')
      .attr('y', this.radius * 0.16)
      .attr('text-anchor', 'middle')
      .style('fill', '#A2A2A2');


    this.resetAllCenterText();


    const pie = d3.pie();
    const _radius = this.radius;

    const path = d3.arc()
      .innerRadius(this.radius * 0.75)
      .outerRadius(function () {
        return (d3.select(this).classed('clicked')) ? _radius * 1.08 : _radius;
      });



    const values = pieData.map(d => d.value);

    let arc = this.donut.selectAll('.arc')
      .data(pie(values));

    arc.exit().remove();

    // update existing groups

    // adding new groups
    arc.enter().append('g')
      .classed('arc', true);

    // rejoin data VERY IMPORTANT
    arc = this.donut.selectAll('.arc')
      .data(pie(values));


    const paths = arc.selectAll('path')
      .data((d) => {
        return [d];
      });

    paths.exit().remove();

    paths
      .transition()
      .duration(1000)
      .attr('d', path)
      .attr('fill', function (d, i, j) {
        return color(j[0].__data__.index);
      });

    paths
      .enter().append('path')
      .attr('d', path)
      .style('stroke', '#FFFFFF')  // for the gap between each pie
      .attr('fill', function (d, i, j) {
        // const ind = j[0].__data__.index;
        // console.log(pieData[ind]);
        return color(j[0].__data__.index);
      })
      .on('mouseover', this.handleMouseover(tooltipDomID))
      .on('mouseout', this.handleMouseout(tooltipDomID))
      .on('click', this.handleClick())
      .on('mousemove', this.handleMousemove(chartParent, tooltipDomID))
      ;
  }

  private handleClick_middle(): (d, i) => void {
    return (d, i) => {
      const paths = this.donut.selectAll('.clicked');
      this.pathAnim(paths, 0);
      paths.classed('clicked', false);
      this.resetAllCenterText();

      this.sendPlan();
    };
  }



  private handleMouseOver_middle(): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .transition()
        .attr('r', this.radius * 0.7);
    };
  }

  private handleMouseOut_middle(): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .transition()
        .duration(500)
        .ease(d3.easeBounce)
        .attr('r', this.radius * 0.65);
    };
  }



  private handleClick(): (d, i) => void {
    return (d, i) => {
      const thisPath = d3.select(d3.event.currentTarget);
      // check class !!!
      const clicked = thisPath.classed('clicked');

      const pathConst = (clicked === true) ? 0 : 1;


      this.pathAnim(thisPath, pathConst);
      thisPath.classed('clicked', !clicked);

      this.setCenterText(this.donut);


      // services
      this.sendPlan();

    };
  }


  private sendPlan() {
    const index = this.donut.selectAll('.clicked').data().map(data => data.index);
    this.planSelectorService.sendPlans(index.map(item => this.pieData[item].key.planId));
  }


  private handleMouseover(tooltipDomID: string): (d, i) => void {
    return (d, i) => {
      this.pathAnim(d3.select(d3.event.currentTarget), 1);
      this.donut.select('.value').text(this.numberFormat(d.data));
      this.donut.select('.percentage').text(this.percentageFormat(this.pieData[d.index].value / this.pieData[d.index].total));

      d3.select(tooltipDomID)
        .style('opacity', 1)
        .html('Plan: ' + this.pieData[d.index].key.planId);
    };

  }
  private handleMouseout(tooltipDomID: string): (d, i) => void {
    return (d, i) => {
      const thisPath = d3.select(d3.event.currentTarget);
      if (!thisPath.classed('clicked')) {
        this.pathAnim(thisPath, 0);
      }
      this.setCenterText(this.donut);
      d3.select(tooltipDomID)
        .style('opacity', 0);
    };
  }

  private handleMousemove(chartParent: ElementRef, tooltipDomID: string): (d, i) => void {
    return (d, i) => {
      const bounds = chartParent.nativeElement.getBoundingClientRect();
      d3.select(tooltipDomID)
        .style('left', d3.event.clientX - bounds.left + 10 + 'px')
        .style('top', d3.event.clientY - bounds.top + 10 + 'px');
    };
  }

  private pathAnim(path, dir) {
    switch (dir) {
      case 0:
        path.transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', d3.arc()
            .innerRadius(this.radius * 0.75)
            .outerRadius(this.radius)
          );
        break;

      case 1:
        path.transition()
          .attr('d', d3.arc()
            .innerRadius(this.radius * 0.75)
            .outerRadius(this.radius * 1.08)
          );
        break;
    }
  }

  private setCenterText(thisDonut) {
    const sum = d3.sum(thisDonut.selectAll('.clicked').data(), d => d['data']);
    thisDonut.select('.value')
      .text(sum ? this.numberFormat(sum) : this.numberFormat(this.pieData[0].total));

    thisDonut.select('.percentage')
      .text(sum ? this.percentageFormat(sum / this.pieData[0].total) : '');

  }

  private resetAllCenterText() {
    this.donut.selectAll('.value')
      .text(d3.format('0.2s')(this.pieData[0].total));
    this.donut.selectAll('.percentage')
      .text('');
  }


}


