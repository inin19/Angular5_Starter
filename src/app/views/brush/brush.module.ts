import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BrushRoutingModule } from './brush-routing.module';
import { TimeseriesComponent } from './timeseries/timeseries.component';
import { BrushComponent } from './brush.component';
import { TimeSeriesService } from './../../providers/test/time-series.service';
import { ProjectionService } from './../../providers/charts/projection.service';
import { ProjectionChartUkComponent } from './projection-chart-uk/projection-chart-uk.component';

@NgModule({
  imports: [
    CommonModule,
    BrushRoutingModule,
    HttpClientModule
  ],
  declarations: [TimeseriesComponent, BrushComponent, ProjectionChartUkComponent],
  providers: [TimeSeriesService, ProjectionService]

})
export class BrushModule { }
