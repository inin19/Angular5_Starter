import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projection-chart-uk',
  templateUrl: './projection-chart-uk.component.html',
  styleUrls: ['./projection-chart-uk.component.scss']
})
export class ProjectionChartUkComponent implements OnInit {

  hidden = false;
  constructor() { }

  ngOnInit() {
  }


  toggle() {
    console.log('toggle!');
    this.hidden = !this.hidden;
  }


}
