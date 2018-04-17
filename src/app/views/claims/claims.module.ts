import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimsComponent } from './claims.component';
import { SlidingDemoComponent } from './sliding-demo/sliding-demo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    ClaimsRoutingModule
  ],
  declarations: [ClaimsComponent, SlidingDemoComponent],
  providers: []
})
export class ClaimsModule { }
