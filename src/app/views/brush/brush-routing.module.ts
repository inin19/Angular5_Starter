import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrushComponent  } from './brush.component';

const routes: Routes = [
  {
    path: '',
    component: BrushComponent,
    data: {
      title: 'Brush'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrushRoutingModule { }
