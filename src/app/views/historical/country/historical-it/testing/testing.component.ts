import { Component, OnInit, Input } from '@angular/core';
import { WaterfallDataNEW, ClaimsAggregateData } from './../../../../../model/d3chartData/waterfall-data.model';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  @Input() benchmarkClaim: WaterfallDataNEW;
  aggregate: ClaimsAggregateData[];
  aggregateTotal: ClaimsAggregateData;

  constructor() { }

  ngOnInit() {
    this.aggregate = this.benchmarkClaim.getClaimsAggregateData();
    this.aggregateTotal = this.benchmarkClaim.getClaimsAggregateDataTotal();
  }

}
