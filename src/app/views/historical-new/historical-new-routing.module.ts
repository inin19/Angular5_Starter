import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoricalNewComponent } from './historical-new.component';
const routes: Routes = [{
  path: '',
  component: HistoricalNewComponent,
  data: {
    title: 'Historical'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricalNewRoutingModule { }
