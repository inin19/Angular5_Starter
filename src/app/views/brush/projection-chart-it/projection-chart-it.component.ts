import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

// model
import { Selector, SelectionItem } from './../../../model/utils/selector.model';
import { ProjectionData, ProjectionOutput, ProjectionGridData } from './../../../model/D3chartData/projection-data.model';
import { ProjectionD3Chart } from './../../../model/D3chart/projection-d3-chart.model';
import { ProjectionPieChart } from './../../../model/D3chart/projection-pie-chart.model';
import { Scatterplot } from './../../../model/D3chart/scatterplot.model';


// services
import { ProjectionPlanSelectionService } from './../../../services/projection-plan-selection.service';
import { ProjectionTrendTypeService } from './../../../providers/charts/projection-trend-type.service';
// 3rd party
import * as elementResizeDetectorMaker from 'element-resize-detector';

@Component({
  selector: 'app-projection-chart-it',
  templateUrl: './projection-chart-it.component.html',
  styleUrls: ['./projection-chart-it.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectionChartItComponent implements OnInit, OnChanges, OnDestroy {

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {

  }

  ngOnDestroy() {

  }

}


class Translations {
  public static categoryTranslate = {
    TOTAL_LIVES: 'Enrollment',
    TOTAL_COST: 'Total Cost',
    MEMBER_PREMIUM: 'Member Premium Co-Share',
    EMPLOYER_PREMIUM: 'Employer Premium',
    FUNDING_GAP: 'Funding Gap',
    ESTIMATED_MEMBER_OOP_COST: 'Estimated Member Out-of-pocket Cost %',
    TAX: 'Tax',
    FEES: 'Fees'
  };
}
