import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng4-click-outside';


import { TabsModule } from 'ngx-bootstrap/tabs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HistoricalNewRoutingModule } from './historical-new-routing.module';
import { HistoricalNewComponent } from './historical-new.component';
import { DemographicService } from '../../services/demographic.service';
import { ClaimDataService } from '../../services/claims.service';
import { SelectorService } from './../../services/selector.service';


import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DemographicComponent } from './demographic/demographic.component';
import { ClaimsComponent } from './claims/claims.component';
import { ClaimFrequencyComponent } from './claim-frequency/claim-frequency.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HistoricalNewRoutingModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  declarations: [
    HistoricalNewComponent,
    DemographicComponent,
    ClaimsComponent,
    ClaimFrequencyComponent
  ],
  providers: [
    DemographicService,
    ClaimDataService,
    SelectorService
  ]

})
export class HistoricalNewModule { }
