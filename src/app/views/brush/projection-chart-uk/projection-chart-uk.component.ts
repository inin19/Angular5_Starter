import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-projection-chart-uk',
  templateUrl: './projection-chart-uk.component.html',
  styleUrls: ['./projection-chart-uk.component.scss']
})
export class ProjectionChartUkComponent implements OnInit {

  static graphCategories = ['EMPLOYER_PREMIUM', 'FUNDING_GAP', 'MEMBER_PREMIUM', 'TAX', 'FEES'];
  static gridCategories = ['TOTAL_LIVES', 'TOTAL_COST', 'MEMBER_PREMIUM', 'EMPLOYER_PREMIUM', 'FUNDING_GAP', 'ESTIMATED_MEMBER_OOP_COST', 'TAX', 'FEES'];

  static colors = {
    EMPLOYER_PREMIUM: '#5cbae6',
    FUNDING_GAP: '#fac364',
    MEMBER_PREMIUM: '#b6d957',
    TAX: '#d998cb',
    FEES: '#93b9c6'
  };


  @Input() private projectionJSON: any[];
  @Input() private lossRatioData: any[];
  trendType = 'BENCHMARK';



  filterPanelHidden = false;
  constructor() { }

  ngOnInit() {
  }


  toggleFilterPanel() {
    console.log('toggle!');
    this.filterPanelHidden = !this.filterPanelHidden;
  }


}
