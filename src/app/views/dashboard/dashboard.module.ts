import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';



@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartsModule,
    FormsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [ DashboardComponent ],
  providers: []

})
export class DashboardModule { }
