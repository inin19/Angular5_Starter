import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimsComponent } from './claims.component';
import { WaterfallChartComponent } from './waterfall-chart/waterfall-chart.component';
import { ClaimDataService } from './../../services/claims.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ClaimsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    AngularMultiSelectModule
  ],
  declarations: [ClaimsComponent, WaterfallChartComponent],
  providers: [ClaimDataService]
})
export class ClaimsModule { }
