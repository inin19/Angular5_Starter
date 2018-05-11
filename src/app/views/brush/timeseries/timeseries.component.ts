import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.scss']
})
export class TimeseriesComponent implements OnInit {

  @Input() private data: any[];
  private width1: number;
  private height1: number;

  private width2: number;
  private height2: number;


  private svg1: any;
  private svg2: any;
  private chart1: any;
  private chart2: any;

  private x1Scale: any;
  private x2Scale: any;
  private y1Scale: any;
  private y2Scale: any;

  private xAxis: any;
  private yAxis: any;


  // var x = d3.scaleTime().range([0, width]),
  //   x2 = d3.scaleTime().range([0, width]),
  //   y = d3.scaleLinear().range([height, 0]),
  //   y2 = d3.scaleLinear().range([height2, 0]);

  private margin: { top: 20, right: 50, bottom: 20, left: 50 };


  private parseDate = d3.timeParse('%b %Y');

  @ViewChild('graph1') private graph1: ElementRef;
  @ViewChild('graph2') private graph2: ElementRef;


  constructor() { }

  ngOnInit() {
    this.createGraph();
    console.log(this.svg1);
  }

  createGraph() {

    const htmlElement1 = this.graph1.nativeElement;
    const htmlElement2 = this.graph2.nativeElement;


    this.width1 = htmlElement1.offsetWidth - this.margin.left - this.margin.right;
    this.height1 = htmlElement1.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg1 = d3.select('#graph1 svg');

    this.x1Scale = d3.scaleTime().range([0, this.width1]);



  }

}
