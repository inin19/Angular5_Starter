import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// import { TimeSeriesService } from './../../providers/test/time-series.service';

import { ProjectionService } from './../../providers/charts/projection.service';

import * as d3 from 'd3';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent implements OnInit {

  data: any[];

  @ViewChild('donut') private piechartContainer: ElementRef;


  private chart_m: number;
  private chart_r: number;

  private color: any;

  private charts: any;

  constructor(private projectionService: ProjectionService) { }

  ngOnInit() {

    // this.create(this.genData());
    this.fetchData();

  }




  fetchData(): void {

    this.projectionService.getScatterPlotData()
      .subscribe(
        data => { this.data = data; }
      );
  }



  create(dataset: any[]) {

    this.chart_m = this.piechartContainer.nativeElement.offsetWidth / dataset.length / 2 * 0.14;
    this.chart_r = this.piechartContainer.nativeElement.offsetWidth / dataset.length / 2 * 0.85;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.charts = d3.select('#donut-charts');



    const donut = this.charts.selectAll('.donut')
      .data(dataset)
      .enter().append('svg:svg')
      .attr('width', (this.chart_r + this.chart_m) * 2)
      .attr('height', (this.chart_r + this.chart_m) * 2)
      .append('svg:g')
      .attr('class', function (d, i) {
        return 'donut type' + i;
      })
      .attr('transform', 'translate(' + (this.chart_r + this.chart_m) + ',' + (this.chart_r + this.chart_m) + ')');

    const donuts = d3.selectAll('.donut');

    donuts.append('svg:circle')
      .attr('r', this.chart_r * 0.6)
      .style('fill', '#E7E7E7')
      .on('mouseover', this.handleMouseOver_middle())
      .on('mouseout', this.handleMouseOut_middle())
      .on('click', this.handleClick_middle());

    donuts.append('text')
      .attr('class', 'center-txt type')
      .attr('y', this.chart_r * -0.16)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text(function (d, i) {
        return d['type'];
      });
    donuts.append('text')
      .attr('class', 'center-txt value')
      .attr('text-anchor', 'middle');
    donuts.append('text')
      .attr('class', 'center-txt percentage')
      .attr('y', this.chart_r * 0.16)
      .attr('text-anchor', 'middle')
      .style('fill', '#A2A2A2');


    const pie = d3.pie()
      .sort(null)
      .value(function (d) {
        // console.log(d);
        return d['val'];
      });

    const _thisItem = this;

    const arc = d3.arc()
      .innerRadius(this.chart_r * 0.7)
      .outerRadius(function () {
        return (d3.select(this).classed('clicked')) ? _thisItem.chart_r * 1.08 : _thisItem.chart_r;
      });


    // Start joining data with paths
    const paths = this.charts.selectAll('.donut')
      .selectAll('path')
      .data(function (d, i) {
        return pie(d.data);
      });

    paths
      .transition()
      .duration(1000)
      .attr('d', arc);

    paths.enter()
      .append('svg:path')
      .attr('d', arc)
      .style('fill', (d, i) => {
        return this.color(i);
      })
      .style('stroke', '#FFFFFF')
      .on('mouseover', this.handleMouseOver())
      .on('mouseout', this.handleMouseout())
      .on('click', this.handleMouseClick());

    paths.exit().remove();

    this.resetAllCenterText();


  }

  private handleMouseClick(): (d, i, j) => void {
    return (d, i, j) => {
      const thisDonut = d3.select(d3.event.currentTarget.parentNode);


      if (0 === thisDonut.selectAll('.clicked').size()) {
        thisDonut.select('circle').on('click');
      }

      const thisPath = d3.select(d3.event.currentTarget);

      // check class !!!
      const clicked = thisPath.classed('clicked');

      const pathConst = (clicked === true) ? 0 : 1;

      // console.log('click!!! ', ~~(!clicked));

      this.pathAnim(thisPath, pathConst);
      thisPath.classed('clicked', !clicked);

      this.setCenterText(thisDonut);

    };
  }



  private handleMouseOver(): (d, i) => void {
    return (d, i) => {
      this.pathAnim(d3.select(d3.event.currentTarget), 1);
      const thisDonut = d3.select(d3.event.currentTarget.parentNode);

      thisDonut.select('.value').text(function (donut_d) {
        return d.data.val.toFixed(1) + donut_d['unit'];
      });
      thisDonut.select('.percentage').text(function (donut_d) {
        return (d.data.val / donut_d['total'] * 100).toFixed(2) + '%';
      });

    };
  }


  private handleMouseout(): (d, i) => void {
    return (d, i) => {
      const thisPath = d3.select(d3.event.currentTarget);
      if (!thisPath.classed('clicked')) {
        this.pathAnim(thisPath, 0);
      }
      const thisDonut = d3.select(d3.event.currentTarget.parentNode);
      this.setCenterText(thisDonut);
    };
  }


  private setCenterText(thisDonut) {
    const sum = d3.sum(thisDonut.selectAll('.clicked').data(), function (d) {
      return d['data'].val;
    });

    thisDonut.select('.value')
      .text(function (d) {
        return (sum) ? sum.toFixed(1) + d.unit
          : d.total.toFixed(1) + d.unit;
      });
    thisDonut.select('.percentage')
      .text(function (d) {
        return (sum) ? (sum / d.total * 100).toFixed(2) + '%'
          : '';
      });

  }


  private handleClick_middle(): (d, i) => void {
    return (d, i) => {
      const paths = this.charts.selectAll('.clicked');
      this.pathAnim(paths, 0);
      paths.classed('clicked', false);
      this.resetAllCenterText();
    };
  }

  private handleMouseOver_middle(): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .transition()
        .attr('r', this.chart_r * 0.65);
    };
  }

  private handleMouseOut_middle(): (d, i) => void {
    return (d, i) => {
      d3.select(d3.event.currentTarget)
        .transition()
        .duration(500)
        .ease(d3.easeBounce)
        .attr('r', this.chart_r * 0.6);
    };
  }



  private pathAnim = function (path, dir) {
    switch (dir) {
      case 0:
        path.transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr('d', d3.arc()
            .innerRadius(this.chart_r * 0.7)
            .outerRadius(this.chart_r)
          );
        break;

      case 1:
        path.transition()
          .attr('d', d3.arc()
            .innerRadius(this.chart_r * 0.7)
            .outerRadius(this.chart_r * 1.08)
          );
        break;
    }
  };


  private resetAllCenterText = function () {
    this.charts.selectAll('.value')
      .text(function (d) {
        return d.total.toFixed(1) + d.unit;
      });
    this.charts.selectAll('.percentage')
      .text('');
  };

  private genData() {
    const type = ['Users', 'Avg Upload', 'Avg Files Shared'];
    const unit = ['M', 'GB', ''];
    const cat = ['Google Drive', 'Dropbox', 'iCloud', 'OneDrive', 'Box'];

    const dataset = new Array();

    for (let i = 0; i < type.length; i++) {
      const data = new Array();
      let total = 0;

      for (let j = 0; j < cat.length; j++) {
        const value = Math.random() * 10 * (3 - i);
        total += value;
        data.push({
          'cat': cat[j],
          'val': value
        });
      }

      dataset.push({
        'type': type[i],
        'unit': unit[i],
        'data': data,
        'total': total
      });
    }
    return dataset;
  }


}
