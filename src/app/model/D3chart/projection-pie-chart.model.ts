import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class ProjectionPieChart {

  private width: number;
  private height: number;
  private svg: any;
  private chart: any;

  private chartInner: any;

  private pie: any;


  private margin: { top: number, right: number, bottom: number, left: number };


  constructor(
    elementRef: ElementRef,
    margin: any,
    pieData: any[]
  ) {


    const color = d3.scaleOrdinal(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);


    const color2 = ['#f97563', '#e3b505', '#156568', '#6ac1b6', '#00a6fb'];

    const data = [
      {
        age: '<5',
        population: 2704659
      },
      {
        age: '5-13',
        population: 4499890
      },
      {
        age: '14-17',
        population: 2159981
      },
      {
        age: '18-24',
        population: 3853788
      },
      {
        age: '25-44',
        population: 14106543
      },
      {
        age: '45-64',
        population: 8819342
      },
      {
        age: '≥65',
        population: 612463
      }
    ];




    const domID = '#' + elementRef.nativeElement.id;
    this.margin = margin;

    this.width = elementRef.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = elementRef.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;



    this.svg = d3.select(domID).select('svg');

    this.svg
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);


    const radius = Math.min(this.width, this.height) / 2;


    this.chartInner = this.svg.select('g');

    this.chartInner
      .attr('transform', `translate( ${this.width / 2}, ${this.height / 2})`);



    const pie = d3.pie();


    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);


    const values = pieData.map(d => d.value);

    const arc = this.chartInner.selectAll('.arc')
      .data(pie(values))
      .enter().append('g')
      .attr('class', 'arc');


    arc.append('path')
      .attr('d', path)
      .attr('fill', function (d, i) {
        return color(i);
      });


    arc.append('text')
      .attr('transform', function (d) { return `translate( ${label.centroid(d)})`; })
      .attr('dy', '0.35em')
      .text(function (d, i) {
        // return d.data.age;
        console.log('plan ID');

        console.log(pieData[d.index].key.planId);
        return 'plan: ' + pieData[i].key.planId;
      });
  }


  updateChart() {

  }





}


