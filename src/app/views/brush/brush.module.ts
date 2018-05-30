import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BrushRoutingModule } from './brush-routing.module';
import { BrushComponent } from './brush.component';
import { ProjectionService } from './../../providers/charts/projection.service';
import { ProjectionChartUkComponent } from './projection-chart-uk/projection-chart-uk.component';
import { ProjectionTrendTypeService } from './../../providers/charts/projection-trend-type.service';


@NgModule({
  imports: [
    CommonModule,
    BrushRoutingModule,
    HttpClientModule
  ],
  declarations: [BrushComponent, ProjectionChartUkComponent],
  providers: [ProjectionService, ProjectionTrendTypeService]

})
export class BrushModule { }
