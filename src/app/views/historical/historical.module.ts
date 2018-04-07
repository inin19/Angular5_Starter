import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ClickOutsideModule } from 'ng4-click-outside';


import { HistoricalRoutingModule } from './historical-routing.module';
import { HistoricalComponent } from './historical.component';

import { DemographicService } from '../../services/demographic.service';
import { ClaimDataService } from '../../services/claims.service';
import { TornadoChartComponent } from './tornado-chart/tornado-chart.component';
import { WaterfallChartComponent } from './waterfall-chart/waterfall-chart.component';


@NgModule({
  imports: [
    CommonModule,
    HistoricalRoutingModule,
    HttpClientModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    ClickOutsideModule
  ],
  declarations: [
    HistoricalComponent,
    TornadoChartComponent,
    WaterfallChartComponent
  ],
  providers: [
    DemographicService,
    ClaimDataService
  ]
})
export class HistoricalModule { }
