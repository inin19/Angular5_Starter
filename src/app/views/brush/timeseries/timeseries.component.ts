import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Scatterplot } from './../../../model/D3chart/scatterplot.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.scss']
})
export class TimeseriesComponent implements OnInit, AfterViewInit {
  static margin: any = { top: 20, right: 20, bottom: 30, left: 40 };

  @ViewChild('scatterplot') scatterplotContainer: ElementRef;
  @Input() data: any[];

  private scatterplotD3Chart: Scatterplot;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log(TimeseriesComponent.margin);
    this.scatterplotD3Chart = new Scatterplot(
      this.scatterplotContainer,
      this.scatterplotContainer,
      TimeseriesComponent.margin,
      this.data
    );


  }




}
