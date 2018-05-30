import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent implements OnInit {

  hidden = false;


  constructor() { }

  ngOnInit() {

  }


  toggle() {
    console.log('toggle!');
    this.hidden = !this.hidden;
  }



}
