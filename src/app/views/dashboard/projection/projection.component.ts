import { Component, OnInit, Input, OnChanges, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { ProjectionData } from '../../../model/d3chartData/projection-data.model';

@Component({
  selector: 'app-projection',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.scss']
})
export class ProjectionComponent implements OnInit, OnChanges, OnDestroy {


  @Input() private projectionJSON: any[];

  constructor() { }

  ngOnInit() {
    console.log('projection init');

    this.projectionJSON.forEach(element => {
      console.log(element);
    });
  }

  ngOnChanges() {
    console.log('projection on changes');
  }

  ngOnDestroy() {
    console.log('projection ondestroy');
  }

}
