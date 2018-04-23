import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng4-click-outside';


import { TabsModule } from 'ngx-bootstrap/tabs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HistoricalRoutingModule } from './historical-routing.module';
import { HistoricalComponent } from './historical.component';
import { DemographicService } from '../../services/demographic.service';
import { ClaimDataService } from '../../services/claims.service';
import { SelectorService } from './../../services/selector.service';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DemographicComponent } from './demographic/demographic.component';
import { ClaimsPerCapitaComponent } from './claims-percapita/claims-percapita.component';
import { ClaimsFrequencyComponent } from './claims-frequency/claims-frequency.component';
import { HistoricalUkComponent } from './country/historical-uk/historical-uk.component';
import { HistoricalItComponent } from './country/historical-it/historical-it.component';
import { TestingComponent } from './country/historical-it/testing/testing.component';


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
    ButtonsModule.forRoot()
  ],
  declarations: [
    HistoricalComponent,
    DemographicComponent,
    ClaimsPerCapitaComponent,
    ClaimsFrequencyComponent,
    HistoricalUkComponent,
    HistoricalItComponent,
    TestingComponent
  ],
  providers: [
    DemographicService,
    ClaimDataService,
    SelectorService
  ]

})
export class HistoricalModule { }
