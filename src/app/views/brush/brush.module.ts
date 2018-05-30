import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { BrushRoutingModule } from './brush-routing.module';
import { BrushComponent } from './brush.component';
import { ProjectionService } from './../../providers/charts/projection.service';
import { ProjectionChartUkComponent } from './projection-chart-uk/projection-chart-uk.component';
import { ProjectionTrendTypeService } from './../../providers/charts/projection-trend-type.service';
import { ProjectionPlanSelectionService } from './../../services/projection-plan-selection.service';

@NgModule({
  imports: [
    CommonModule,
    BrushRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  declarations: [BrushComponent, ProjectionChartUkComponent],
  providers: [ProjectionService, ProjectionTrendTypeService, ProjectionPlanSelectionService]

})
export class BrushModule { }
