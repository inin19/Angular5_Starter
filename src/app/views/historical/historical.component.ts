import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit, OnDestroy {


  // get it from services
  // countryCode = 'ISO2_GB';


  // countryCode = 'ISO2_GB';
  countryCode = 'ISO2_IT';


  ngOnInit() {
    console.log('historical on init');
  }

  ngOnDestroy() {
    console.log('historical on destroy');
  }



}
