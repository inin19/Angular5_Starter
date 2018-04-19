import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-historical-uk',
  templateUrl: './historical-uk.component.html',
  styleUrls: ['./historical-uk.component.scss']
})
export class HistoricalUkComponent implements OnInit {

  @Input() countryCode: string;
  constructor() { }

  ngOnInit() {

  }

}
