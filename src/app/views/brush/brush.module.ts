import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BrushRoutingModule } from './brush-routing.module';
import { TimeseriesComponent } from './timeseries/timeseries.component';
import { BrushComponent } from './brush.component';
import { TimeSeriesService } from './../../providers/test/time-series.service';


@NgModule({
  imports: [
    CommonModule,
    BrushRoutingModule,
    HttpClientModule
  ],
  declarations: [TimeseriesComponent, BrushComponent],
  providers: [TimeSeriesService]

})
export class BrushModule { }
