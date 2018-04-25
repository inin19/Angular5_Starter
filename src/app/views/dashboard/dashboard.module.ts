import { UKPrjectionPipes } from './../pipes/charts/uk-pipe';
import { ProjectionService } from './../../providers/charts/projection.service';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProjectionComponent } from './projection/projection.component';
import { ClickOutsideModule } from 'ng4-click-outside';




@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ClickOutsideModule
  ],
  declarations: [DashboardComponent, ProjectionComponent, UKPrjectionPipes],
  providers: [ProjectionService]

})
export class DashboardModule { }
