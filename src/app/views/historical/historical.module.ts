import { PercentageFormatPipe, FixedNumberFormatPipe } from './../pipes/grid/grid-format';
import { ConditionGroupPipe } from './../pipes/charts/conditionGroup-pipe';
import { RegionPipe } from './../pipes/charts/dropdown/region.pipe';
import { RelationPipe } from './../pipes/charts/dropdown/relation.pipe';
import { GenderPipe } from './../pipes/charts/dropdown/gender.pipe';
import { ClaimTypePipe } from './../pipes/charts/dropdown/claim-type.pipe';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng4-click-outside';



import { TabsModule } from 'ngx-bootstrap/tabs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';

import { HistoricalRoutingModule } from './historical-routing.module';
import { HistoricalComponent } from './historical.component';
import { DemographicService } from '../../providers/charts/demographic.service';
import { ClaimsService } from '../../providers/charts/claims.service';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DemographicComponent } from './demographic/demographic.component';
import { ClaimsPerCapitaComponent } from './claims-percapita/claims-percapita.component';
import { ClaimsFrequencyComponent } from './claims-frequency/claims-frequency.component';
import { HistoricalUkComponent } from './country/historical-uk/historical-uk.component';
import { HistoricalItComponent } from './country/historical-it/historical-it.component';
import { TestingComponent } from './country/historical-it/testing/testing.component';
import { ClaimsAvgCostComponent } from './claims-avg-cost/claims-avg-cost.component';

import { ResizeDirective } from './../../directives/custom/resize.directive';

import { showHideTrigger } from './../../model/animations/animations';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HistoricalRoutingModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    ToastrModule.forRoot()
  ],
  declarations: [
    HistoricalComponent,
    DemographicComponent,
    ClaimsPerCapitaComponent,
    ClaimsFrequencyComponent,
    HistoricalUkComponent,
    HistoricalItComponent,
    TestingComponent,
    ClaimsAvgCostComponent,
    PercentageFormatPipe,
    FixedNumberFormatPipe,
    ConditionGroupPipe,
    ResizeDirective,
    RegionPipe,
    RelationPipe,
    GenderPipe,
    ClaimTypePipe
  ],
  providers: [
    DemographicService,
    ClaimsService
  ]

})
export class HistoricalModule { }
